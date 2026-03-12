import { Thermometer, Brain, ShieldCheck } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const Features = () => {
  const { lang, t } = useI18n();

  const features = [
    {
      icon: Thermometer,
      title: t.features.title1[lang],
      description: t.features.desc1[lang],
    },
    {
      icon: Brain,
      title: t.features.title2[lang],
      description: t.features.desc2[lang],
    },
    {
      icon: ShieldCheck,
      title: t.features.title3[lang],
      description: t.features.desc3[lang],
    },
  ];

  return (
    <section id="features" className="py-20 bg-background relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-4 group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/30 flex items-center justify-center group-hover:scale-110 group-hover:border-primary/50 transition-all">
                  <Icon
                    className="w-8 h-8 text-primary animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 10px hsl(195, 100%, 50%))',
                    }}
                  />
                </div>
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
