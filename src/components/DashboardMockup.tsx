import { useI18n } from "@/hooks/useI18n";
import { BarChart2 } from "lucide-react";

const DashboardMockup = () => {
  const { lang, t } = useI18n();

  const chartBars = [40, 55, 50, 65, 60, 75, 70, 85, 80, 95, 90, 100];
  const years = ["2021", "2022", "2023", "2024", "2025"];

  return (
    <div className="relative rounded-xl overflow-hidden border border-border/30 bg-card/80 backdrop-blur-sm" style={{ boxShadow: '0 20px 60px -15px hsl(195, 100%, 50%, 0.15)' }}>
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-secondary/60 border-b border-border/30">
        <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0, 84%, 60%)' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(45, 93%, 58%)' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(160, 84%, 45%)' }} />
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground font-mono">{t.dashboard.catalog[lang]}</span>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Chart area */}
        <div className="md:col-span-7 rounded-lg border border-border/30 bg-secondary/30 p-4">
          <p className="text-xs text-muted-foreground mb-3">{t.dashboard.projectionTitle[lang]}</p>
          <div className="flex items-end gap-1 h-32 md:h-40">
            {chartBars.map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${h}%`,
                  background: `linear-gradient(to top, hsl(195, 100%, 40%), hsl(180, 100%, 55%))`,
                  opacity: 0.6 + (i / chartBars.length) * 0.4,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {years.map(y => (
              <span key={y} className="text-[10px] text-muted-foreground/60">{y}</span>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="md:col-span-5 space-y-4">
          {/* Risk Score */}
          <div className="rounded-lg border border-border/30 bg-secondary/30 p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">{t.dashboard.riskScore[lang]}</p>
            <div className="relative w-20 h-20 mx-auto">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(210, 50%, 20%)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  stroke="hsl(160, 84%, 45%)"
                  strokeWidth="3"
                  strokeDasharray="18 82"
                  strokeLinecap="round"
                  style={{ filter: 'drop-shadow(0 0 4px hsl(160, 84%, 45%))' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-foreground" style={{ filter: 'drop-shadow(0 0 6px hsl(160, 84%, 45%))' }}>18</span>
                <span className="text-[10px] text-muted-foreground">/100</span>
              </div>
            </div>
            <p className="text-xs font-bold mt-1" style={{ color: 'hsl(160, 84%, 45%)' }}>{t.dashboard.low[lang]}</p>
          </div>

          {/* Key Insights */}
          <div className="rounded-lg border border-border/30 bg-secondary/30 p-4 hidden md:block">
            <p className="text-xs font-semibold text-foreground mb-1">{t.dashboard.keyInsights[lang]}</p>
            <p className="text-[10px] text-muted-foreground/70 mb-2">{t.dashboard.generatedByAi[lang]}</p>
            <ul className="space-y-1">
              {[t.dashboard.insight1[lang], t.dashboard.insight2[lang], t.dashboard.insight3[lang]].map((insight, i) => (
                <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">•</span> {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="md:col-span-8 rounded-lg border border-border/30 bg-secondary/30 p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.dashboard.estimatedValue[lang]}</p>
            <p className="text-xl md:text-2xl font-bold text-foreground mt-1">€4,500,000 - €5,200,000</p>
          </div>
        </div>

        <div className="md:col-span-4 rounded-lg border border-border/30 p-4 flex flex-col items-center justify-center" style={{ background: 'hsl(160, 84%, 45%, 0.1)', borderColor: 'hsl(160, 84%, 45%, 0.3)' }}>
          <CheckCircle className="w-8 h-8 mb-1" style={{ color: 'hsl(160, 84%, 45%)' }} />
          <p className="text-xs font-bold" style={{ color: 'hsl(160, 84%, 45%)' }}>{t.dashboard.purchaseAdvice[lang]}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
