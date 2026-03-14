import { ShieldCheck } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Waveform = () => {
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

const SpectrumAnalyzer = () => {
  // Frequency spectrum bands like an EQ analyzer in a DAW
  const bands = [
    30, 45, 60, 80, 95, 85, 70, 90, 100, 88, 72, 65, 80, 92, 78, 55, 68, 85, 75, 60,
    50, 70, 82, 68, 55, 45, 62, 75, 58, 42,
  ];

  return (
    <div className="w-full h-24 flex items-end justify-center gap-[2px] px-2 relative">
      {/* Grid lines */}
      {[25, 50, 75].map((pos) => (
        <div
          key={pos}
          className="absolute w-full left-0"
          style={{
            bottom: `${pos}%`,
            height: '1px',
            background: 'hsl(210, 50%, 20%)',
            opacity: 0.4,
          }}
        />
      ))}
      {bands.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm relative"
          style={{
            height: `${h}%`,
            background: h > 85
              ? `linear-gradient(to top, hsl(195, 100%, 45%), hsl(45, 93%, 58%))`
              : h > 60
              ? `linear-gradient(to top, hsl(195, 100%, 40%), hsl(160, 84%, 50%))`
              : `linear-gradient(to top, hsl(210, 80%, 30%), hsl(195, 100%, 45%))`,
            boxShadow: h > 80 ? '0 -2px 8px hsl(45, 93%, 58%, 0.4)' : h > 60 ? '0 0 4px hsl(195, 100%, 50%, 0.3)' : 'none',
            animation: `spectrumBounce ${0.8 + (i % 7) * 0.15}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.08}s`,
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
      title: t.features.title1[lang],
      description: t.features.desc1[lang],
      type: 'waveform' as const,
    },
    {
      title: t.features.title2[lang],
      description: t.features.desc2[lang],
      type: 'studioImage' as const,
    },
    {
      icon: ShieldCheck,
      title: t.features.title3[lang],
      description: t.features.desc3[lang],
      type: 'icon' as const,
    },
  ];

  return (
    <section id="features" className="py-20 bg-background relative">
      <style>{`
        @keyframes wavePulse {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.6); }
        }
        @keyframes spectrumBounce {
          0% { transform: scaleY(1); }
          100% { transform: scaleY(0.5); }
        }
      `}</style>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {feature.type === 'waveform' && (
                <div className="w-full rounded-2xl bg-secondary/50 border border-border/30 p-3 group-hover:scale-105 group-hover:border-primary/50 transition-all overflow-hidden">
                  <Waveform />
                </div>
              )}
              {feature.type === 'studioImage' && (
                <div className="w-full rounded-2xl border border-border/30 group-hover:scale-105 group-hover:border-primary/50 transition-all overflow-hidden">
                  <img src={studioAnalytics} alt="Studio di registrazione - Analisi predittiva" className="w-full h-32 object-cover" />
                </div>
              )}
              {feature.type === 'icon' && 'icon' in feature && (
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all">
                  <feature.icon
                    className="w-8 h-8 text-primary animate-pulse"
                    style={{ filter: 'drop-shadow(0 0 10px hsl(195, 100%, 50%))' }}
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
