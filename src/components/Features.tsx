import { Brain, ShieldCheck } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Waveform = () => {
  // Simulated waveform bars like a recording studio DAW
  const bars = [
    12, 25, 18, 35, 28, 45, 55, 40, 65, 75, 60, 85, 95, 80, 70, 90, 100, 85, 75, 95,
    88, 70, 60, 80, 90, 72, 55, 68, 82, 50, 40, 62, 78, 45, 35, 58, 70, 42, 30, 50,
    65, 38, 25, 45, 55, 32, 20, 38, 48, 28, 15, 30, 40, 22, 18, 28, 35, 20, 12, 22,
  ];

  return (
    <div className="w-full h-24 flex items-center justify-center gap-[1px] px-2">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: `linear-gradient(to top, hsl(195, 100%, 40%), hsl(160, 84%, 50%))`,
            opacity: 0.7 + (h / 100) * 0.3,
            boxShadow: h > 70 ? '0 0 4px hsl(195, 100%, 50%, 0.5)' : 'none',
            animation: `wavePulse ${1.5 + (i % 5) * 0.3}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.05}s`,
          }}
        />
      ))}
    </div>
  );
};

const Features = () => {
  const { lang, t } = useI18n();

  const features = [
    {
      icon: null as any,
      title: t.features.title1[lang],
      description: t.features.desc1[lang],
      isWaveform: true,
    },
    {
      icon: Brain,
      title: t.features.title2[lang],
      description: t.features.desc2[lang],
      isWaveform: false,
    },
    {
      icon: ShieldCheck,
      title: t.features.title3[lang],
      description: t.features.desc3[lang],
      isWaveform: false,
    },
  ];

  return (
    <section id="features" className="py-20 bg-background relative">
      <style>{`
        @keyframes wavePulse {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.6); }
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-4 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                {feature.isWaveform ? (
                  <div className="w-full rounded-2xl bg-secondary/50 border border-border/30 p-3 group-hover:scale-105 group-hover:border-primary/50 transition-all overflow-hidden">
                    <Waveform />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all">
                    <Icon
                      className="w-8 h-8 text-primary animate-pulse"
                      style={{
                        filter: 'drop-shadow(0 0 10px hsl(195, 100%, 50%))',
                      }}
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
