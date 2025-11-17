import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Image as ImageIcon, Music, Video, ExternalLink, Loader2, Instagram, Youtube } from "lucide-react";
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
  epk_pdf: string[];
  foto_professionali: string[];
  accenni_brani: string[];
  video_artistici: string[];
  links: {
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
  const hasEpk = artistData?.epk_pdf && artistData.epk_pdf.length > 0;
  const hasPhotos = artistData?.foto_professionali && artistData.foto_professionali.length > 0;
  const hasAudio = artistData?.accenni_brani && artistData.accenni_brani.length > 0;
  const hasVideos = artistData?.video_artistici && artistData.video_artistici.length > 0;
  const hasAnyMedia = hasEpk || hasPhotos || hasAudio || hasVideos;

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

            {!hasAnyMedia && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardContent className="p-6">
                  <p className="text-gray-400 text-center">Nessun file disponibile</p>
                </CardContent>
              </Card>
            )}

            {/* EPK PDF */}
            {hasEpk && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    Electronic Press Kit (EPK)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {artistData.epk_pdf.map((url, index) => (
                    <Button
                      key={index}
                      onClick={() => openInNewTab(url)}
                      variant="outline"
                      className="w-full justify-between border-cyan-500/30 text-white hover:bg-cyan-500/10"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-cyan-400" />
                        EPK {index + 1}
                      </span>
                      <ExternalLink className="h-4 w-4 text-cyan-400" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Foto Professionali */}
            {hasPhotos && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    Foto Professionali
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {artistData.foto_professionali.map((url, index) => (
                      <div 
                        key={index}
                        onClick={() => openInNewTab(url)}
                        className="relative group cursor-pointer overflow-hidden rounded-lg border border-cyan-500/30 hover:border-cyan-500 transition-all"
                      >
                        <img
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Accenni di Brani */}
            {hasAudio && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Music className="h-5 w-5 text-cyan-400" />
                    Accenni di Brani
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {artistData.accenni_brani.map((url, index) => (
                    <div key={index} className="p-3 bg-[#0a0f1e] rounded-lg border border-cyan-500/30">
                      <p className="text-sm text-gray-400 mb-2">Brano {index + 1}</p>
                      <audio controls className="w-full">
                        <source src={url} />
                        Il tuo browser non supporta l'elemento audio.
                      </audio>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Video */}
            {hasVideos && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Video className="h-5 w-5 text-cyan-400" />
                    Video
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {artistData.video_artistici.map((url, index) => (
                    <Button
                      key={index}
                      onClick={() => openInNewTab(url)}
                      variant="outline"
                      className="w-full justify-between border-cyan-500/30 text-white hover:bg-cyan-500/10"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Video className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                        <span className="truncate">{url}</span>
                      </span>
                      <ExternalLink className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Social Media Links */}
            {(links.instagram || links.spotify || links.youtube) && (
              <Card className="bg-[#1a1f2e] border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Social Media</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {links.instagram && (
                    <Button
                      onClick={() => openInNewTab(links.instagram!)}
                      variant="outline"
                      className="w-full justify-between border-cyan-500/30 text-white hover:bg-cyan-500/10"
                    >
                      <span className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-cyan-400" />
                        Instagram
                      </span>
                      <ExternalLink className="h-4 w-4 text-cyan-400" />
                    </Button>
                  )}
                  {links.spotify && (
                    <Button
                      onClick={() => openInNewTab(links.spotify!)}
                      variant="outline"
                      className="w-full justify-between border-cyan-500/30 text-white hover:bg-cyan-500/10"
                    >
                      <span className="flex items-center gap-2">
                        <Music className="h-4 w-4 text-cyan-400" />
                        Spotify
                      </span>
                      <ExternalLink className="h-4 w-4 text-cyan-400" />
                    </Button>
                  )}
                  {links.youtube && (
                    <Button
                      onClick={() => openInNewTab(links.youtube!)}
                      variant="outline"
                      className="w-full justify-between border-cyan-500/30 text-white hover:bg-cyan-500/10"
                    >
                      <span className="flex items-center gap-2">
                        <Youtube className="h-4 w-4 text-cyan-400" />
                        YouTube
                      </span>
                      <ExternalLink className="h-4 w-4 text-cyan-400" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
