const Testimonials = () => {
  const farBuildings = [
    { left: "2%", width: "5%", height: 120 },
    { left: "10%", width: "4%", height: 170 },
    { left: "17%", width: "6%", height: 135 },
    { left: "27%", width: "4%", height: 190 },
    { left: "35%", width: "5%", height: 150 },
    { left: "44%", width: "6%", height: 210 },
    { left: "55%", width: "4%", height: 145 },
    { left: "63%", width: "5%", height: 185 },
    { left: "72%", width: "6%", height: 160 },
    { left: "82%", width: "4%", height: 200 },
    { left: "89%", width: "5%", height: 140 },
  ];

  const nearBuildings = [
    { left: "6%", width: "7%", height: 210 },
    { left: "20%", width: "8%", height: 280 },
    { left: "33%", width: "7%", height: 240 },
    { left: "48%", width: "9%", height: 320 },
    { left: "64%", width: "8%", height: 260 },
    { left: "79%", width: "7%", height: 300 },
    { left: "91%", width: "5%", height: 220 },
  ];

  return (
    <section className="relative overflow-hidden py-28 bg-transparent">
      <div className="absolute inset-0 pointer-events-none">
        {/* atmospheric haze */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,194,255,0.10) 0%, rgba(0,15,40,0.04) 35%, transparent 70%)",
          }}
        />

        {/* distant city glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-32 w-[90%] h-40"
          style={{
            background:
              "radial-gradient(ellipse, rgba(0,194,255,0.18) 0%, rgba(0,194,255,0.06) 35%, transparent 75%)",
            filter: "blur(18px)",
          }}
        />

        {/* far buildings */}
        <div className="absolute inset-x-0 bottom-24 h-[240px]">
          {farBuildings.map((b, i) => (
            <div
              key={`far-${i}`}
              className="absolute bottom-0 rounded-t-sm"
              style={{
                left: b.left,
                width: b.width,
                height: `${b.height}px`,
                background:
                  "linear-gradient(to top, rgba(2,8,23,0.85), rgba(10,40,70,0.35))",
                borderTop: "1px solid rgba(0,194,255,0.10)",
                boxShadow: "0 0 30px rgba(0,194,255,0.04)",
                opacity: 0.5,
                filter: "blur(0.4px)",
              }}
            />
          ))}
        </div>

        {/* near buildings */}
        <div className="absolute inset-x-0 bottom-10 h-[340px]">
          {nearBuildings.map((b, i) => (
            <div
              key={`near-${i}`}
              className="absolute bottom-0 rounded-t-sm"
              style={{
                left: b.left,
                width: b.width,
                height: `${b.height}px`,
                background:
                  "linear-gradient(to top, rgba(4,18,35,0.92), rgba(16,52,86,0.42))",
                borderTop: "1px solid rgba(0,194,255,0.18)",
                borderLeft: "1px solid rgba(0,194,255,0.05)",
                borderRight: "1px solid rgba(0,194,255,0.05)",
                boxShadow: "0 0 40px rgba(0,194,255,0.05)",
                opacity: 0.75,
              }}
            />
          ))}
        </div>

        {/* floor perspective glow */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[120%] h-48"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(0,194,255,0.14) 0%, rgba(0,194,255,0.05) 35%, transparent 75%)",
            filter: "blur(10px)",
          }}
        />

        {/* perspective floor lines */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`h-${i}`}
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              bottom: `${18 + i * 24}px`,
              width: `${96 - i * 12}%`,
              height: "1px",
              background: `rgba(0,194,255,${0.08 - i * 0.012})`,
            }}
          />
        ))}

        {/* vertical perspective lines */}
        {[-40, -20, 0, 20, 40].map((x, i) => (
          <div
            key={`v-${i}`}
            className="absolute left-1/2 bottom-0 origin-bottom"
            style={{
              width: "1px",
              height: "180px",
              background: "linear-gradient(to top, rgba(0,194,255,0.08), transparent)",
              transform: `translateX(${x}vw) skewX(${x < 0 ? 28 : -28}deg)`,
            }}
          />
        ))}

        {/* central mist */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-24 w-[55%] h-44"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.05) 0%, rgba(0,194,255,0.04) 30%, transparent 75%)",
            filter: "blur(26px)",
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <p
            className="text-3xl md:text-5xl font-semibold text-white tracking-tight"
            style={{
              textShadow: "0 0 28px rgba(0,194,255,0.12)",
            }}
          >
            “The Eagle has landed”
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
