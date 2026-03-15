import { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();

    // Katakana + Latin + Numbers
    const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const chars = katakana + latin + nums;

    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    // Draw micro-grid once on a separate canvas for performance
    const gridCanvas = document.createElement('canvas');
    const gridCtx = gridCanvas.getContext('2d')!;
    const drawGrid = () => {
      gridCanvas.width = canvas.width;
      gridCanvas.height = canvas.height;
      gridCtx.strokeStyle = 'rgba(0, 194, 255, 0.10)';
      gridCtx.lineWidth = 1;
      for (let x = 0; x < gridCanvas.width; x += fontSize) {
        gridCtx.beginPath();
        gridCtx.moveTo(x, 0);
        gridCtx.lineTo(x, gridCanvas.height);
        gridCtx.stroke();
      }
    };
    drawGrid();

    const draw = () => {
      // Slower fade for smoother trails
      ctx.fillStyle = 'rgba(2, 4, 15, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw micro-grid behind rain
      ctx.drawImage(gridCanvas, 0, 0);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        const brightness = Math.random();
        
        if (brightness > 0.98) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        } else if (brightness > 0.9) {
          ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        } else {
          ctx.fillStyle = `rgba(0, 180, 255, ${0.1 + Math.random() * 0.25})`;
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    };

    // ~28fps for smoother linear feel
    const interval = setInterval(draw, 28);

    const handleResize = () => {
      resizeCanvas();
      const newColumns = Math.floor(canvas.width / fontSize);
      while (drops.length < newColumns) {
        drops.push(Math.random() * -100);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-30"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default MatrixRain;
