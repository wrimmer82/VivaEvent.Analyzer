import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image as ImageIcon, Music, Video, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ArtistMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId: string;
  artistName: string;
}

interface ArtistData {
  nome_completo: string;
  genere_musicale: string;
  citta: string;
  biografia: string;
  avatar_url: string;
  links: {
    epk?: string;
    photos?: string[];
    audio?: string[];
    video?: string;
    instagram?: string;
    facebook?: string;
    spotify?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export const ArtistMediaModal = ({ open, onOpenChange, artistId, artistName }: ArtistMediaModalProps) => {
  const [loading, setLoading] = useState(true);
  const [artistData, setArtistData] = useState<ArtistData | null>(null);

  useEffect(() => {
    if (open && artistId) {
      loadArtistData();
    }
  }, [open, artistId]);

  const loadArtistData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artisti')
        .select('*')
        .eq('id', artistId)
        .single();

      if (error) throw error;

      setArtistData(data as ArtistData);
    } catch (error) {
      console.error('Error loading artist data:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati dell'artista",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] bg-[#0a0f1e] border-cyan-500/30">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const links = artistData?.links || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#0a0f1e] border-cyan-500/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {artistData?.nome_completo || artistName}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              {artistData?.genere_musicale}
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              {artistData?.citta}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6 mt-4">
            {/* Biografia */}
            {artistData?.biografia && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Biografia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm leading-relaxed">{artistData.biografia}</p>
                </CardContent>
              </Card>
            )}

            {/* EPK PDF */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <FileText className="h-5 w-5 text-cyan-500" />
                  Electronic Press Kit (EPK)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {links.epk ? (
                  <Button
                    onClick={() => openInNewTab(links.epk!)}
                    className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visualizza EPK PDF
                  </Button>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Nessun file disponibile</p>
                )}
              </CardContent>
            </Card>

            {/* Foto Professionali */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <ImageIcon className="h-5 w-5 text-cyan-500" />
                  Foto Professionali
                </CardTitle>
              </CardHeader>
              <CardContent>
                {links.photos && links.photos.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {links.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer rounded-lg overflow-hidden border border-cyan-500/30 hover:border-cyan-500 transition-all"
                        onClick={() => openInNewTab(photo)}
                      >
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <ExternalLink className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Nessun file disponibile</p>
                )}
              </CardContent>
            </Card>

            {/* Accenni di Brani */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <Music className="h-5 w-5 text-cyan-500" />
                  Accenni di Brani
                </CardTitle>
              </CardHeader>
              <CardContent>
                {links.audio && links.audio.length > 0 ? (
                  <div className="space-y-3">
                    {links.audio.map((audio, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-[#0a0f1e] rounded-lg border border-cyan-500/30"
                      >
                        <Music className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                        <audio controls className="flex-1 h-10" style={{ maxWidth: '100%' }}>
                          <source src={audio} />
                          Your browser does not support the audio element.
                        </audio>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openInNewTab(audio)}
                          className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-4">Nessun file disponibile</p>
                )}
              </CardContent>
            </Card>

            {/* Video */}
            {links.video && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Video className="h-5 w-5 text-cyan-500" />
                    Video
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => openInNewTab(links.video!)}
                    className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Guarda Video
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {(links.instagram || links.facebook || links.spotify || links.youtube || links.tiktok) && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Link Social</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {links.instagram && (
                      <Button
                        size="sm"
                        onClick={() => openInNewTab(links.instagram!)}
                        className="bg-pink-500/20 hover:bg-pink-500/30 text-pink-400 border border-pink-500/30"
                      >
                        Instagram
                      </Button>
                    )}
                    {links.facebook && (
                      <Button
                        size="sm"
                        onClick={() => openInNewTab(links.facebook!)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30"
                      >
                        Facebook
                      </Button>
                    )}
                    {links.spotify && (
                      <Button
                        size="sm"
                        onClick={() => openInNewTab(links.spotify!)}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                      >
                        Spotify
                      </Button>
                    )}
                    {links.youtube && (
                      <Button
                        size="sm"
                        onClick={() => openInNewTab(links.youtube!)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                      >
                        YouTube
                      </Button>
                    )}
                    {links.tiktok && (
                      <Button
                        size="sm"
                        onClick={() => openInNewTab(links.tiktok!)}
                        className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                      >
                        TikTok
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
