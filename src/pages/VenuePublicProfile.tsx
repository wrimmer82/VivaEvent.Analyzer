import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Users, 
  Star, 
  Calendar,
  Share2,
  ArrowLeft,
  Music2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VenuePublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [venue, setVenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenueData = async () => {
      if (!id) {
        toast({
          title: "Errore",
          description: "ID venue non valido",
          variant: "destructive",
        });
        navigate(-1);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("venues")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Venue non trovata",
            description: "La venue richiesta non esiste",
            variant: "destructive",
          });
          navigate(-1);
          return;
        }

        setVenue(data);
      } catch (error) {
        console.error("Error loading venue:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati della venue",
          variant: "destructive",
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadVenueData();
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

  if (!venue) {
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
        {/* Hero Section with Image Gallery */}
        <Card className="overflow-hidden mb-6 bg-gradient-to-br from-card to-secondary border-primary/20">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="relative bg-muted">
              <div className="aspect-[4/3] relative overflow-hidden">
                {venue.avatar_url ? (
                  <img
                    src={venue.avatar_url}
                    alt={venue.nome_locale}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Venue Info */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {venue.nome_locale}
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                    {venue.citta}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Indirizzo</p>
                    <p className="text-muted-foreground text-sm">{venue.indirizzo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Capacità</p>
                    <p className="text-muted-foreground text-sm">{venue.capacita} posti</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Budget Medio</p>
                    <p className="text-muted-foreground text-sm">€{venue.budget_medio}</p>
                  </div>
                </div>
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
              <Music2 className="h-5 w-5 text-primary" />
              Descrizione
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {venue.email || "Informazioni di contatto non disponibili"}
            </p>
          </Card>

          {/* Musical Genres */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Generi Musicali Preferiti
            </h2>
            <div className="flex flex-wrap gap-2">
              {venue.generi_preferiti && venue.generi_preferiti.length > 0 ? (
                venue.generi_preferiti.map((genere: string) => (
                  <Badge
                    key={genere}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/30"
                  >
                    {genere}
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">Nessun genere specificato</p>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Budget Medio</span>
                <span className="font-bold text-foreground">€{venue.budget_medio}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Capacità</span>
                <span className="font-bold text-foreground">{venue.capacita} posti</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Città</span>
                <span className="font-bold text-foreground">{venue.citta}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VenuePublicProfile;
