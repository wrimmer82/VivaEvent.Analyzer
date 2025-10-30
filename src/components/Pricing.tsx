import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "0",
    description: "Perfetto per iniziare",
    features: [
      "3 proposte al mese",
      "Profilo base",
      "Supporto via email",
      "Accesso alla community"
    ],
    cta: "Inizia Gratis",
    popular: false
  },
  {
    name: "Pro",
    price: "6,99",
    description: "Per artisti professionisti",
    features: [
      "Proposte illimitate",
      "Analytics avanzati",
      "Supporto prioritario",
      "Profilo verificato",
      "Dashboard personalizzata",
      "AI chatbot dedicato"
    ],
    cta: "Diventa Pro",
    popular: true
  },
  {
    name: "Commission",
    price: "4-6%",
    description: "Sul cachet di ogni booking",
    features: [
      "Split equo artista-venue",
      "Zero costi fissi mensili",
      "Pagamenti sicuri garantiti",
      "Dashboard completa",
      "Supporto prioritario",
      "Fatturazione automatica"
    ],
    cta: "Scopri di Più",
    popular: false
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Prezzi Trasparenti
          </h2>
          <p className="text-xl text-muted-foreground">
            Scegli il piano perfetto per te. Zero costi nascosti, cancella quando vuoi
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative flex flex-col bg-gradient-to-br from-card via-card to-card/50 backdrop-blur-sm ${
                plan.popular 
                  ? 'border-2 border-primary shadow-elegant scale-105' 
                  : 'border-[hsl(210,20%,35%)]'
              }`}
              style={!plan.popular ? {
                background: 'linear-gradient(135deg, hsl(0, 0%, 5%), hsl(210, 15%, 12%))',
                borderColor: 'hsl(210, 20%, 35%)'
              } : undefined}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold px-4 py-1 rounded-full">
                    Più Popolare
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-5xl font-bold text-foreground">€{plan.price}</span>
                  {plan.name !== "Commission" && (
                    <span className="text-muted-foreground ml-2">/mese</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-8">
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            Tutti i piani includono • Protezione pagamenti • Supporto via email • Cancella quando vuoi
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
