import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { 
  Music, 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ArrowRight,
  Users,
  Calendar,
  TrendingUp,
  Shield
} from "lucide-react";

const GetStarted = () => {
  const userTypes = [
    {
      icon: Music,
      title: "Artista",
      description: "Sei un musicista o una band? Trova venue e opportunità per esibirti.",
      features: [
        "Crea il tuo profilo artistico",
        "Carica la tua musica e video",
        "Ricevi proposte di booking",
        "Gestisci i tuoi eventi",
        "Analizza le tue performance"
      ],
      link: "/crea-profilo",
      color: "from-primary to-accent"
    },
    {
      icon: Building2,
      title: "Venue",
      description: "Gestisci un locale o uno spazio per eventi? Trova gli artisti perfetti.",
      features: [
        "Pubblica i tuoi spazi disponibili",
        "Cerca artisti per genere e stile",
        "Gestisci le prenotazioni",
        "Calendario eventi integrato",
        "Statistiche di affluenza"
      ],
      link: "/profilo-venue",
      color: "from-accent to-primary"
    },
    {
      icon: Briefcase,
      title: "Professionista",
      description: "Sei un manager, booking agent o promoter? Gestisci il tuo roster.",
      features: [
        "Gestisci più artisti",
        "Negozia contratti",
        "Dashboard completa",
        "Report finanziari",
        "Networking professionale"
      ],
      link: "/profilo-professionista",
      color: "from-primary/80 to-accent/80"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Registrati",
      description: "Crea il tuo account gratuito in pochi secondi. Scegli il tipo di profilo più adatto a te.",
      icon: Users
    },
    {
      number: "02",
      title: "Completa il Profilo",
      description: "Aggiungi le tue informazioni, foto, video e tutto ciò che ti rappresenta al meglio.",
      icon: CheckCircle2
    },
    {
      number: "03",
      title: "Inizia a Connetterti",
      description: "Cerca opportunità, invia proposte o ricevi offerte. Il nostro AI ti aiuta a trovare i match perfetti.",
      icon: Calendar
    },
    {
      number: "04",
      title: "Cresci e Prospera",
      description: "Monitora le tue performance, gestisci i pagamenti e fai crescere la tua presenza nel mondo della musica live.",
      icon: TrendingUp
    }
  ];

  const benefits = [
    "Matching AI intelligente per artisti e venue",
    "Pagamenti sicuri e tracciati",
    "Contratti digitali automatici",
    "Calendario e gestione eventi",
    "Analytics e statistiche dettagliate",
    "Supporto clienti dedicato"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 animate-fade-in">
            <Badge className="mx-auto" variant="outline">
              Inizia Gratis Oggi
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Benvenuto in VivaEvent
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              La piattaforma che rivoluziona il booking della musica dal vivo. Connetti artisti, venue e professionisti in un unico ecosistema intelligente.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild className="gap-2">
                <Link to="/accedi">
                  Inizia Ora <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/#how-it-works">Scopri Come Funziona</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scegli il Tuo Percorso
            </h2>
            <p className="text-muted-foreground text-lg">
              Ogni profilo è pensato per le tue esigenze specifiche
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {userTypes.map((type, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}>
                    <type.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{type.title}</CardTitle>
                  <CardDescription className="text-base">
                    {type.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link to={type.link}>Inizia come {type.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Come Funziona
            </h2>
            <p className="text-muted-foreground text-lg">
              4 semplici passi per entrare nel mondo del live music booking
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex gap-4 animate-fade-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <step.icon className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perché Scegliere VivaEvent
            </h2>
            <p className="text-muted-foreground text-lg">
              Tutto ciò di cui hai bisogno per il tuo successo nella musica dal vivo
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-md transition-all animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="font-medium">{benefit}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Pronto per Iniziare?
            </h2>
            <p className="text-xl text-muted-foreground">
              Unisciti a migliaia di artisti, venue e professionisti che stanno già usando VivaEvent
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" asChild className="gap-2">
                <Link to="/accedi">
                  Registrati Gratis <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/">Torna alla Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GetStarted;
