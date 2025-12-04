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

    // Fragment shader for Matrix rain effect
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
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = gl_FragCoord.xy;
        
        // More columns for denser effect
        float columns = 120.0;
        float columnWidth = u_resolution.x / columns;
        
        vec2 grid = vec2(floor(p.x / columnWidth), floor(p.y / 18.0));
        vec2 gridUV = mod(p, vec2(columnWidth, 18.0)) / vec2(columnWidth, 18.0);
        
        float columnRandom = random(vec2(grid.x, 0.0));
        float speed = 1.5 + columnRandom * 3.0;
        float offset = columnRandom * 100.0;
        
        float row = mod(grid.y + u_time * speed * 4.0 + offset, u_resolution.y / 18.0);
        
        float charRandom = random(vec2(grid.x, floor(row)));
        float charCode = floor(charRandom * 15.0);
        
        float brightness = 0.0;
        
        // Leading bright character - longer trail
        float headRow = mod(u_time * speed * 4.0 + offset, u_resolution.y / 18.0);
        float distFromHead = mod(headRow - grid.y + u_resolution.y / 18.0, u_resolution.y / 18.0);
        
        // Brighter head and longer trail
        if (distFromHead < 2.0) {
          brightness = 1.5;
        } else if (distFromHead < 40.0) {
          brightness = (40.0 - distFromHead) / 40.0;
          brightness = brightness * brightness * 1.2;
        }
        
        // More intense flicker effect
        float flicker = random(vec2(grid.x, grid.y + floor(u_time * 15.0)));
        brightness *= 0.7 + flicker * 0.5;
        
        // Character rendering
        float char = character(charCode * 1000.0, gridUV * 2.0 - 0.5);
        
        // Matrix cyan color with green tint
        vec3 color = vec3(0.0, 0.95, 0.9);
        
        // Head glow is bright white-cyan
        if (distFromHead < 2.0) {
          color = vec3(0.9, 1.0, 1.0);
        }
        
        float alpha = char * brightness;
        
        // Enhanced glow effect for immersion
        float glow = brightness * 0.6 * (1.0 - length(gridUV - 0.5) * 1.2);
        glow = max(glow, 0.0);
        
        // Add depth fog effect - characters in "background" slightly dimmer
        float depth = random(vec2(grid.x * 0.1, 0.0));
        float depthFactor = 0.6 + depth * 0.4;
        
        // Add ambient glow
        float ambientGlow = 0.02 * brightness;
        
        vec3 finalColor = color * alpha * depthFactor + vec3(0.0, 0.9, 0.85) * glow * 1.5 + vec3(0.0, 0.3, 0.3) * ambientGlow;
        
        gl_FragColor = vec4(finalColor, (alpha + glow * 0.8 + ambientGlow) * 1.2);
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
