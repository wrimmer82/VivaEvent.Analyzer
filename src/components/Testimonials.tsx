const Testimonials = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-transparent">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-x-0 bottom-0 h-[260px]"
          style={{
            background:
              "linear-gradient(to top, rgba(0,194,255,0.10), rgba(0,194,255,0.02) 35%, transparent 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-[220px] flex items-end gap-2 px-6 opacity-70">
          {[90, 140, 110, 180, 130, 210, 160, 120, 190, 150, 230, 170, 115, 200, 145, 175, 135, 205].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${h}px`,
                background: "rgba(0, 194, 255, 0.08)",
                borderTop: "1px solid rgba(0, 194, 255, 0.22)",
                boxShadow: "0 0 18px rgba(0,194,255,0.05)",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-10 h-px bg-[rgba(0,194,255,0.10)]" />
        <div className="absolute inset-x-0 bottom-20 h-px bg-[rgba(0,194,255,0.08)]" />
        <div className="absolute inset-x-0 bottom-32 h-px bg-[rgba(0,194,255,0.06)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[rgba(0,194,255,0.18)] bg-[rgba(255,255,255,0.03)] px-8 py-14 text-center backdrop-blur-md">
          <div
            className="mx-auto mb-6 h-12 w-12 rounded-full border border-[rgba(0,194,255,0.20)] flex items-center justify-center text-2xl"
            style={{ boxShadow: "0 0 25px rgba(0,194,255,0.10)" }}
          >
            ”
          </div>

          <p className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
            The Eagle has landed
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
