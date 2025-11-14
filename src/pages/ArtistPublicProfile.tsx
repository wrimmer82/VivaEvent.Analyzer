import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Users, 
  Euro,
  Share2,
  ArrowLeft,
  Music2,
  Image as ImageIcon,
  Link as LinkIcon,
  Mail,
  FileText,
  Play,
  Video
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ArtistPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtistData = async () => {
      if (!id) {
        toast({
          title: "Errore",
          description: "ID artista non valido",
          variant: "destructive",
        });
        navigate(-1);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("artisti")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        if (!data) {
          toast({
            title: "Artista non trovato",
            description: "L'artista richiesto non esiste",
            variant: "destructive",
          });
          navigate(-1);
          return;
        }

        setArtist(data);
      } catch (error) {
        console.error("Error loading artist:", error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati dell'artista",
          variant: "destructive",
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    loadArtistData();
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

  if (!artist) {
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
                {artist.avatar_url ? (
                  <img
                    src={artist.avatar_url}
                    alt={artist.nome_completo}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Artist Info */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {artist.nome_completo}
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                    {artist.genere_musicale}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Quick Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Città</p>
                    <p className="text-muted-foreground text-sm">{artist.citta}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Euro className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Cachet Desiderato</p>
                    <p className="text-muted-foreground text-sm">€{artist.cachet_desiderato}</p>
                  </div>
                </div>

                {artist.fanbase_size > 0 && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Fanbase</p>
                      <p className="text-muted-foreground text-sm">{artist.fanbase_size.toLocaleString()} followers</p>
                    </div>
                  </div>
                )}

                {artist.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Contatto</p>
                      <p className="text-muted-foreground text-sm">{artist.email}</p>
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
          {/* Biography */}
          <Card className="md:col-span-2 p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Music2 className="h-5 w-5 text-primary" />
              Biografia
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {artist.biografia || "Biografia non disponibile"}
            </p>

            {/* Social Media Links */}
            {artist.links && (
              <>
                {(artist.links.instagram || artist.links.facebook || artist.links.spotify || artist.links.youtube || artist.links.tiktok) && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      Social Media
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {artist.links.instagram && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 hover:bg-primary/10"
                          onClick={() => window.open(artist.links.instagram, '_blank')}
                        >
                          Instagram
                        </Button>
                      )}
                      {artist.links.facebook && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 hover:bg-primary/10"
                          onClick={() => window.open(artist.links.facebook, '_blank')}
                        >
                          Facebook
                        </Button>
                      )}
                      {artist.links.spotify && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 hover:bg-primary/10"
                          onClick={() => window.open(artist.links.spotify, '_blank')}
                        >
                          Spotify
                        </Button>
                      )}
                      {artist.links.youtube && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 hover:bg-primary/10"
                          onClick={() => window.open(artist.links.youtube, '_blank')}
                        >
                          YouTube
                        </Button>
                      )}
                      {artist.links.tiktok && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-primary/30 hover:bg-primary/10"
                          onClick={() => window.open(artist.links.tiktok, '_blank')}
                        >
                          TikTok
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {/* EPK Download */}
                {artist.links.epk && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Electronic Press Kit (EPK)
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full border-primary/30 hover:bg-primary/10 gap-2"
                      onClick={() => window.open(artist.links.epk, '_blank')}
                    >
                      <FileText className="h-4 w-4" />
                      Scarica EPK
                    </Button>
                  </>
                )}

                {/* Photo Gallery */}
                {artist.links.photos && artist.links.photos.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-primary" />
                      Foto Professionali
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {artist.links.photos.map((photoUrl: string, index: number) => (
                        <div key={index} className="aspect-square overflow-hidden rounded-lg border border-border">
                          <img
                            src={photoUrl}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(photoUrl, '_blank')}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Audio Samples */}
                {artist.links.audio && artist.links.audio.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <Play className="h-5 w-5 text-primary" />
                      Accenni di Brani
                    </h3>
                    <div className="space-y-3">
                      {artist.links.audio.map((audioUrl: string, index: number) => (
                        <div key={index} className="p-3 bg-muted rounded-lg border border-border">
                          <p className="text-sm font-medium text-foreground mb-2">Brano {index + 1}</p>
                          <audio controls className="w-full">
                            <source src={audioUrl} type="audio/mpeg" />
                            Il tuo browser non supporta l'elemento audio.
                          </audio>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Video */}
                {artist.links.video && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                      <Video className="h-5 w-5 text-primary" />
                      Video
                    </h3>
                    <Button
                      variant="outline"
                      className="w-full border-primary/30 hover:bg-primary/10 gap-2"
                      onClick={() => window.open(artist.links.video, '_blank')}
                    >
                      <Video className="h-4 w-4" />
                      Guarda Video
                    </Button>
                  </>
                )}
              </>
            )}
          </Card>

          {/* Musical Genres & Stats */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Generi Musicali
            </h2>
            <div className="flex flex-wrap gap-2">
              {artist.generi && artist.generi.length > 0 ? (
                artist.generi.map((genere: string) => (
                  <Badge
                    key={genere}
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/30"
                  >
                    {genere}
                  </Badge>
                ))
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  {artist.genere_musicale}
                </Badge>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Cachet</span>
                <span className="font-bold text-foreground">€{artist.cachet_desiderato}</span>
              </div>
              {artist.fanbase_size > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Fanbase</span>
                  <span className="font-bold text-foreground">{artist.fanbase_size.toLocaleString()}</span>
                </div>
              )}
              {artist.avg_attendance_last_3_gigs > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Media ultimi 3 concerti</span>
                  <span className="font-bold text-foreground">{artist.avg_attendance_last_3_gigs}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Città</span>
                <span className="font-bold text-foreground">{artist.citta}</span>
              </div>
            </div>

            {/* Target Audience */}
            {artist.target_audience && artist.target_audience.length > 0 && (
              <>
                <Separator className="my-6" />
                <h3 className="text-lg font-bold text-foreground mb-3">
                  Target Audience
                </h3>
                <div className="flex flex-wrap gap-2">
                  {artist.target_audience.map((target: string) => (
                    <Badge
                      key={target}
                      variant="outline"
                      className="border-primary/30 text-foreground"
                    >
                      {target}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ArtistPublicProfile;
