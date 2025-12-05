import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    
    // Fallback to 2D if WebGL not available
    if (!gl) {
      console.warn('WebGL not supported, using 2D fallback');
      return fallback2D(canvas);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Vertex shader
    const vertexShaderSource = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    // Fragment shader for Matrix rain effect with 3D depth
    const fragmentShaderSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      varying vec2 v_texCoord;
      
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }
      
      float character(float n, vec2 p) {
        p = floor(p * vec2(4.0, -4.0) + 2.5);
        if (clamp(p.x, 0.0, 4.0) == p.x && clamp(p.y, 0.0, 4.0) == p.y) {
          float x = mod(n / exp2(p.x + 5.0 * p.y), 2.0);
          if (int(x) == 1) return 1.0;
        }
        return 0.0;
      }
      
      void main() {
        vec2 p = gl_FragCoord.xy;
        float invertedY = u_resolution.y - p.y;
        
        vec3 finalColor = vec3(0.0);
        float finalAlpha = 0.0;
        
        // Render 3 depth layers for 3D effect
        for (int layer = 0; layer < 3; layer++) {
          float layerDepth = float(layer);
          
          // Depth affects: column count, character size, speed, brightness
          float depthScale = 1.0 + layerDepth * 0.6; // 1.0, 1.6, 2.2
          float columns = 60.0 + layerDepth * 30.0; // 60, 90, 120 columns
          float charSize = 24.0 - layerDepth * 4.0; // 24, 20, 16 pixel height
          
          // Slower, more cinematic speed - back layers even slower
          float baseSpeed = 0.4 - layerDepth * 0.1; // 0.4, 0.3, 0.2
          
          float columnWidth = u_resolution.x / columns;
          
          vec2 grid = vec2(floor(p.x / columnWidth), floor(invertedY / charSize));
          vec2 gridUV = mod(p, vec2(columnWidth, charSize)) / vec2(columnWidth, charSize);
          
          float columnRandom = random(vec2(grid.x + layerDepth * 100.0, layerDepth));
          float speed = baseSpeed + columnRandom * 0.3;
          float offset = columnRandom * 80.0 + layerDepth * 25.0;
          
          float maxRows = u_resolution.y / charSize;
          float row = mod(grid.y + u_time * speed * 3.0 + offset, maxRows);
          
          float charRandom = random(vec2(grid.x, floor(row) + layerDepth * 50.0));
          float charCode = floor(charRandom * 15.0);
          
          float brightness = 0.0;
          
          // Leading character with long cinematic trail
          float headRow = mod(u_time * speed * 3.0 + offset, maxRows);
          float distFromHead = mod(headRow - grid.y + maxRows, maxRows);
          
          // Foreground (layer 0) is brightest, background dimmer
          float layerBrightness = 1.3 - layerDepth * 0.35; // 1.3, 0.95, 0.6
          
          if (distFromHead < 2.5) {
            brightness = 1.6 * layerBrightness;
          } else if (distFromHead < 50.0) {
            brightness = (50.0 - distFromHead) / 50.0;
            brightness = brightness * brightness * layerBrightness;
          }
          
          // Subtle flicker
          float flicker = random(vec2(grid.x, grid.y + floor(u_time * 8.0) + layerDepth));
          brightness *= 0.75 + flicker * 0.35;
          
          // Character rendering - foreground chars slightly larger in UV
          float charScale = 2.0 - layerDepth * 0.15;
          float char = character(charCode * 1000.0, gridUV * charScale - (charScale - 2.0) * 0.25);
          
          // Depth-based color: foreground cyan-white, background deeper cyan-green
          vec3 color = vec3(0.0, 0.95 - layerDepth * 0.1, 0.9 - layerDepth * 0.15);
          
          // Bright head glow
          if (distFromHead < 2.5) {
            color = mix(vec3(0.95, 1.0, 1.0), vec3(0.5, 1.0, 0.95), layerDepth * 0.3);
          }
          
          float alpha = char * brightness;
          
          // Glow effect - stronger for foreground
          float glowIntensity = 0.7 - layerDepth * 0.15;
          float glow = brightness * glowIntensity * (1.0 - length(gridUV - 0.5) * 1.1);
          glow = max(glow, 0.0);
          
          // Depth fog - back layers more faded
          float depthFog = 1.0 - layerDepth * 0.25;
          
          // Ambient glow per layer
          float ambientGlow = 0.015 * brightness * (1.0 - layerDepth * 0.3);
          
          // Accumulate layers with depth blending
          vec3 layerColor = color * alpha * depthFog + vec3(0.0, 0.9, 0.85) * glow * 1.2 + vec3(0.0, 0.25, 0.25) * ambientGlow;
          float layerAlpha = (alpha + glow * 0.7 + ambientGlow) * depthFog;
          
          // Back layers render first (behind), foreground on top
          finalColor = finalColor * (1.0 - layerAlpha * 0.5) + layerColor;
          finalAlpha = max(finalAlpha, layerAlpha);
        }
        
        gl_FragColor = vec4(finalColor, finalAlpha * 1.1);
      }
    `;

    // Compile shader
    function compileShader(gl: WebGLRenderingContext, source: string, type: number): WebGLShader | null {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return;

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up geometry (full screen quad)
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

    // Enable blending for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let animationId: number;
    const startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform1f(timeLocation, time);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, []);

  // 2D Canvas fallback
  const fallback2D = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00d9ff';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-60"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default MatrixRain;
