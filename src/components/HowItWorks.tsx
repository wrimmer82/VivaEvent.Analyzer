import { Search, BarChart2, TrendingUp, ChevronRight } from "lucide-react";
import { useI18n } from "@/hooks/useI18n";

const HowItWorks = () => {
  const { lang } = useI18n();

  const title = { it: "Come Funziona", en: "How It Works", es: "Cómo Funciona", fr: "Comment ça marche", de: "So funktioniert's" };

  const cards = [
    {
      icon: Search,
      number: "01",
      title: { it: "Cerca un Artista", en: "Search an Artist", es: "Busca un Artista", fr: "Chercher un Artiste", de: "Künstler suchen" },
      text: {
        it: "Inserisci il nome di un artista o un catalogo musicale.",
        en: "Enter an artist name or music catalog.",
        es: "Ingresa el nombre de un artista o catálogo musical.",
        fr: "Entrez le nom d'un artiste ou d'un catalogue musical.",
        de: "Geben Sie einen Künstlernamen oder Musikkatalog ein.",
      },
    },
    {
      icon: BarChart2,
      number: "02",
      title: { it: "Analizziamo i Dati", en: "We Analyze the Data", es: "Analizamos los Datos", fr: "Nous Analysons les Données", de: "Wir Analysieren die Daten" },
      text: {
        it: "Il nostro sistema elabora streaming, trend e rischi attraverso fonti dati globali.",
        en: "Our system processes streams, trends and risks from global data sources.",
        es: "Nuestro sistema procesa streams, tendencias y riesgos de fuentes de datos globales.",
        fr: "Notre système traite les flux, tendances et risques à partir de sources de données mondiales.",
        de: "Unser System verarbeitet Streams, Trends und Risiken aus globalen Datenquellen.",
      },
    },
    {
      icon: TrendingUp,
      number: "03",
      title: { it: "Vedi il Risultato", en: "See the Result", es: "Ve el Resultado", fr: "Voir le Résultat", de: "Ergebnis Ansehen" },
      text: {
        it: "Ottieni una valutazione chiara del valore e del rischio del catalogo.",
        en: "Get a clear assessment of the catalog's value and risk.",
        es: "Obtén una evaluación clara del valor y riesgo del catálogo.",
        fr: "Obtenez une évaluation claire de la valeur et du risque du catalogue.",
        de: "Erhalten Sie eine klare Bewertung des Katalogwerts und -risikos.",
      },
    },
  ];

  return (
    <section id="come-funziona" className="relative" style={{ padding: "80px 0", background: "transparent" }}>
      <style>{`
        @keyframes arrowPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <h2
        className="text-center font-bold mb-16"
        style={{
          fontSize: "2.2rem",
          background: "linear-gradient(135deg, hsl(195, 100%, 60%), hsl(160, 84%, 55%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {title[lang]}
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0 px-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="flex flex-col md:flex-row items-center">
              <div
                className="w-full max-w-[320px] md:w-[240px] md:max-w-none flex flex-col items-center text-center transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(0,194,255,0.15)",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  backdropFilter: "blur(6px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,194,255,0.45)";
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(0,194,255,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(0,194,255,0.15)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Icon size={34} style={{ color: "hsl(195, 100%, 60%)" }} className="mb-3" />
                <span className="font-mono text-sm mb-2" style={{ color: "rgba(0,194,255,0.5)" }}>{card.number}</span>
                <h3 className="font-bold text-foreground text-lg mb-2">{card.title[lang]}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{card.text[lang]}</p>
              </div>

              {i < cards.length - 1 && (
                <div className="py-3 md:px-5 md:py-0">
                  <ChevronRight
                    size={26}
                    className="rotate-90 md:rotate-0"
                    style={{
                      color: "rgba(0,194,255,0.4)",
                      animation: "arrowPulse 1.8s ease-in-out infinite",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HowItWorks;
