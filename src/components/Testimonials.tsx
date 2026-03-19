const Testimonials = () => {
  const buildings = [
    { w: 4, h: 180, x: 2 }, { w: 3, h: 120, x: 7 }, { w: 5, h: 220, x: 12 },
    { w: 3, h: 150, x: 18 }, { w: 6, h: 260, x: 22 }, { w: 4, h: 190, x: 29 },
    { w: 3, h: 140, x: 34 }, { w: 5, h: 300, x: 38 }, { w: 4, h: 170, x: 44 },
    { w: 6, h: 240, x: 49 }, { w: 3, h: 130, x: 56 }, { w: 5, h: 280, x: 60 },
    { w: 4, h: 200, x: 66 }, { w: 3, h: 160, x: 71 }, { w: 6, h: 320, x: 75 },
    { w: 4, h: 180, x: 82 }, { w: 3, h: 140, x: 87 }, { w: 5, h: 250, x: 91 },
    { w: 4, h: 110, x: 96 },
  ];

  const windows = Array.from({ length: 80 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 60 + 5,
    opacity: Math.random() * 0.6 + 0.1,
    delay: Math.random() * 4,
  }));

  return (
    <section className="relative py-28 overflow-hidden bg-transparent">

      {/* === SFONDO CITTÀ 3D === */}
      <div className="absolute inset-0 pointer-events-none">

        {/* Nebbia digitale base */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 120% 60% at 50% 100%, rgba(0,40,80,0.55) 0%, transparent 70%)',
        }} />

        {/* Pavimento riflettente */}
        <div className="absolute bottom-0 left-0 right-0 h-32" style={{
          background: 'linear-gradient(to top, rgba(0,194,255,0.07), transparent)',
        }} />

        {/* Linee griglia pavimento (prospettiva) */}
        {[0, 8, 18, 32, 52].map((b, i) => (
          <div key={i} className="absolute left-0 right-0" style={{
            bottom: `${b}px`,
            height: '1px',
            background: `rgba(0,194,255,${0.03 + i * 0.018})`,
          }} />
        ))}

        {/* Palazzi */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end" style={{ height: '340px' }}>
          {buildings.map((b, i) => (
            <div key={i} className="absolute bottom-0 rounded-t-sm" style={{
              left: `${b.x}%`,
              width: `${b.w}%`,
              height: `${b.h}px`,
              background: `linear-gradient(to top, rgba(0,20,50,0.95), rgba(0,40,90,0.5))`,
              borderTop: '1px solid rgba(0,194,255,0.25)',
              borderLeft: '1px solid rgba(0,194,255,0.10)',
              borderRight: '1px solid rgba(0,194,255,0.10)',
              boxShadow: '0 -4px 30px rgba(0,194,255,0.06)',
            }} />
          ))}
        </div>

        {/* Luci finestre nei palazzi */}
        {windows.map((w, i) => (
          <div key={i} className="absolute" style={{
            left: `${w.x}%`,
            bottom: `${w.y}px`,
            width: '2px',
            height: '2px',
            borderRadius: '1px',
            background: 'rgba(0,194,255,0.9)',
            opacity: w.opacity,
            boxShadow: '0 0 4px rgba(0,194,255,0.8)',
            animation: `winBlink ${2 + w.delay}s ease-in-out infinite alternate`,
            animationDelay: `${w.delay}s`,
          }} />
        ))}

        {/* Glow orizzonte */}
        <div className="absolute left-0 right-0" style={{
          bottom: '300px',
          height: '80px',
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(0,194,255,0.12), transparent)',
          filter: 'blur(8px)',
        }} />

        {/* Overlay superiore per sfumare la città */}
        <div className="absolute inset-x-0 top-0 h-1/2" style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.0) 100%)',
        }} />

      </div>

      <style>{`
        @keyframes winBlink {
          0% { opacity: 0.1; }
          100% { opacity: 0.7; }
        }
      `}</style>

      {/* === CONTENUTO === */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-2xl rounded-2xl text-center px-8 py-14"
          style={{
            background: 'rgba(0,10,30,0.55)',
            border: '1px solid rgba(0,194,255,0.20)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 60px rgba(0,194,255,0.08)',
          }}>
          <div className="mx-auto mb-6 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{
              border: '1px solid rgba(0,194,255,0.25)',
              color: 'hsl(195,100%,60%)',
              boxShadow: '0 0 20px rgba(0,194,255,0.12)',
            }}>
            "
          </div>
          <p className="text-3xl md:text-4xl font-bold tracking-tight text-white"
            style={{ textShadow: '0 0 40px rgba(0,194,255,0.3)' }}>
            The Eagle has landed
          </p>
        </div>
      </div>

    </section>
  );
};

export default Testimonials;
