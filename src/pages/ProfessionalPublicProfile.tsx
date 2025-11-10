import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Share2,
  ArrowLeft,
  Briefcase,
  Image as ImageIcon,
  Mail
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProfessionalPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfessionalData = async () => {
      if (!id) {
        toast({
          title: "Errore",
          description: "ID professionista non valido",
          variant: "destructive",
        });
        navigate(-1);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("professionisti")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Professionista non trovato",
            description: "Il professionista richiesto non esiste",
            variant: "destructive",
          });
          navigate(-1);
          return;
        }

        setProfessional(data);
      } catch (error) {
        console.error("Error loading professional:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati del professionista",
          variant: "destructive",
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadProfessionalData();
  }, [id, navigate]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiato!",
      description: "Il link del profilo è stato copiato negli appunti",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!professional) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 text-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna ai Match
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <Card className="overflow-hidden mb-6 bg-gradient-to-br from-card to-secondary border-primary/20">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative bg-muted">
              <div className="aspect-[4/3] relative overflow-hidden">
                {professional.avatar_url ? (
                  <img
                    src={professional.avatar_url}
                    alt={professional.nome_completo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Professional Info */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {professional.nome_completo}
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                    {professional.ruolo}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Ruolo</p>
                    <p className="text-muted-foreground text-sm">{professional.ruolo}</p>
                  </div>
                </div>

                {professional.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Contatto</p>
                      <p className="text-muted-foreground text-sm">{professional.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="flex gap-3 mt-8">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2 border-primary/30 hover:bg-primary/10"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                  Condividi
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Details Section */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Description */}
          <Card className="md:col-span-2 p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Informazioni Professionali
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Professionista specializzato in <strong>{professional.ruolo}</strong> nel settore musicale.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Per maggiori informazioni e per richieste di collaborazione, contattare via email.
            </p>
          </Card>

          {/* Contact Info */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Dettagli
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Ruolo</span>
                <span className="font-bold text-foreground">{professional.ruolo}</span>
              </div>
              {professional.email && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">Email</span>
                  <span className="font-bold text-foreground text-sm break-all">{professional.email}</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPublicProfile;
