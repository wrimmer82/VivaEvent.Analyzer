import { Music, Building2, TrendingUp, FileCheck, CreditCard, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import concertMetallicBackground from "@/assets/concert-metallic-background.png";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${concertMetallicBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Come Funziona
          </h2>
          <p className="text-xl text-muted-foreground">
            Processo completamente automatizzato con AI per artisti e venue
          </p>
        </div>

        <Tabs defaultValue="artists" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-12">
            <TabsTrigger value="artists" className="text-lg py-3">
              <Music className="w-5 h-5 mr-2" />
              Per Artisti
            </TabsTrigger>
            <TabsTrigger value="venues" className="text-lg py-3">
              <Building2 className="w-5 h-5 mr-2" />
              Per Venue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artists" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Crea Profilo Smart</h3>
                  <p className="text-muted-foreground">
                    Carica EPK, video live, genere musicale, fanbase locale e statistiche social
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">AI Matching</h3>
                  <p className="text-muted-foreground">
                    L'algoritmo suggerisce venue compatibili per genere, capacità e budget
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center">
                    <FileCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Contratto Digitale</h3>
                  <p className="text-muted-foreground">
                    Firma elettronica e pagamento escrow automatico per massima sicurezza
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="venues" className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Profilo Venue</h3>
                  <p className="text-muted-foreground">
                    Imposta capacità, generi preferiti, budget show e calendario eventi
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Suggerimenti AI</h3>
                  <p className="text-muted-foreground">
                    Artisti consigliati basati su affluenza prevista, genere e fanbase locale
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-accent/50 transition-all hover:shadow-card">
                <CardContent className="pt-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Dashboard Analytics</h3>
                  <p className="text-muted-foreground">
                    Monitora affluenza, incassi e feedback post-evento in tempo reale
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default HowItWorks;
