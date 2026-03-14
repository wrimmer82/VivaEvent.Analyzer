import { useI18n } from "@/hooks/useI18n";

const Waveform = () => {
  const points = 64;
  const data = Array.from({ length: points }, () => Math.random());

  return (
    <div className="w-full h-24 flex items-center justify-center">
      <svg viewBox={`0 0 ${points} 1`} width="100%" height="100%">
        <path
          d={`M0 1 ${data.map((y, x) => `L${x} ${1 - y}`).join(" ")} L${points - 1} 1 Z`}
          fill="hsl(230, 60%, 65%)"
          stroke="hsl(230, 60%, 75%)"
          strokeWidth="0.02"
        />
      </svg>
    </div>
  );
};

const SpectrumAnalyzer = () => {
  const bars = 32;

  return (
    <div className="w-full h-24 flex items-center justify-center gap-1 px-2">
      {Array.from({ length: bars }, (_, i) => {
        const level = Math.random() * 0.8 + 0.2;
        const color = `hsl(${i * (360 / bars)}, 70%, 50%)`;

        return (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              background: color,
              height: `${level * 100}%`,
              opacity: 0.8,
              boxShadow: `0 0 4px ${color}`,
              animation: `pulse ${2 + Math.sin(i)}s ease-in-out infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
};

const RiskMeter = () => {
  const segments = 20;
  return (
    <div className="w-full h-24 flex flex-col justify-center gap-1.5 px-2">
      <div className="relative w-full h-1 rounded-full overflow-hidden" style={{ background: 'hsl(210, 50%, 15%)' }}>
        <div
          className="absolute h-full w-1/3 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(160, 84%, 45%), transparent)',
            animation: 'riskLine 2s ease-in-out infinite',
          }}
        />
      </div>
      <div className="flex items-end gap-[2px] h-16">
        {Array.from({ length: segments }, (_, i) => {
          const level = i < 12 ? 60 + i * 3 : i < 16 ? 50 - (i - 12) * 8 : 25 - (i - 16) * 4;
          const color = i < 10
            ? 'hsl(160, 84%, 45%)'
            : i < 15
            ? 'hsl(45, 93%, 58%)'
            : 'hsl(0, 84%, 55%)';
          return (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{
                height: `${Math.max(level, 10)}%`,
                background: color,
                opacity: i < 14 ? 0.9 : 0.5,
                boxShadow: i < 10 ? `0 0 4px ${color}` : 'none',
                animation: `riskPulse ${1.2 + (i % 4) * 0.25}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          );
        })}
      </div>
      <div className="flex justify-between">
        <span className="text-[8px]" style={{ color: 'hsl(160, 84%, 45%)' }}>LOW</span>
        <span className="text-[8px]" style={{ color: 'hsl(45, 93%, 58%)' }}>MED</span>
        <span className="text-[8px]" style={{ color: 'hsl(0, 84%, 55%)' }}>HIGH</span>
      </div>
    </div>
  );
};

const Features = () => {
  const { t } = useI18n();

  const features = [
    {
      title: t("historicalPerformance"),
      description: t("historicalPerformanceDescription"),
      icon: SpectrumAnalyzer,
    },
    {
      title: t("riskAssessment"),
      description: t("riskAssessmentDescription"),
      icon: RiskMeter,
    },
    {
      title: t("predictiveAnalysis"),
      description: t("predictiveAnalysisDescription"),
      icon: Waveform,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center gap-4 px-4 py-8 rounded-xl bg-zinc-900/50 backdrop-blur-sm">
          <div className="w-full max-w-xs">{<feature.icon />}</div>
          <h3 className="text-xl font-semibold text-center">{feature.title}</h3>
          <p className="text-sm text-center text-zinc-400">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Features;
