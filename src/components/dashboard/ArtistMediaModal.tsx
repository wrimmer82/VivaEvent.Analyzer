import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Users, Euro, Share2, Mail, Loader2, Star, Music2, Image as ImageIcon, Play, ExternalLink, X, Instagram, Facebook } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ArtistMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artistId: string;
  artistName: string;
  onBookingClick?: () => void;
}

interface ArtistData {
  nome_completo: string;
  genere_musicale: string;
  generi?: string[];
  citta: string;
  email: string;
  biografia: string;
  avatar_url: string;
  fanbase_size: number;
  avg_attendance_last_3_gigs: number;
  cachet_desiderato: number;
  links: {
    spotify?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
  };
  foto_professionali?: string[];
  accenni_brani?: string[];
  video_artistici?: string[];
  epk_pdf?: string[];
}

export const ArtistMediaModal = ({ 
  open, 
  onOpenChange, 
  artistId, 
  artistName,
  onBookingClick 
}: ArtistMediaModalProps) => {
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

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/artist/${artistId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copiato!",
      description: "Il link del profilo è stato copiato negli appunti",
    });
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  // Calculate average rating (mock data)
  const rating = 4.0 + Math.random() * 1;

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] bg-[#0a0f1e] border-cyan-500/30 p-0">
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!artistData) return null;

  const links = artistData.links || {};
  const biografia = artistData.biografia || "";
  const biografiaTruncated = biografia.length > 200 
    ? biografia.substring(0, 200) + "..." 
    : biografia;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] bg-[#0a0f1e] border-cyan-500/30 p-0 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 rounded-full p-2 bg-[#1a1f2e] hover:bg-[#252a3e] border border-cyan-500/30 transition-colors"
        >
          <X className="h-5 w-5 text-cyan-400" />
        </button>

        <ScrollArea className="h-[90vh]">
          <div className="p-8">
            {/* Hero Section */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Profile Image */}
              <div className="md:col-span-1">
                <Avatar className="w-full h-auto aspect-square rounded-2xl shadow-xl border-2 border-cyan-500/30">
                  <AvatarImage 
                    src={artistData.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${artistId}`} 
                    alt={artistData.nome_completo}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20">
                    {artistData.nome_completo.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  {/* Name & Share Button */}
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-4xl font-bold text-white">
                      {artistData.nome_completo}
                    </h2>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                      className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Condividi
                    </Button>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 px-3 py-1">
                      <Music2 className="h-3 w-3 mr-1" />
                      {artistData.genere_musicale}
                    </Badge>
                    {artistData.generi && artistData.generi.slice(0, 3).map((genre, idx) => (
                      <Badge key={idx} className="bg-cyan-500/10 text-cyan-300 border-cyan-500/20 px-3 py-1">
                        {genre}
                      </Badge>
                    ))}
                  </div>

                  {/* Location & Email */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4 text-cyan-400" />
                      <span>{artistData.citta}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4 text-cyan-400" />
                      <a href={`mailto:${artistData.email}`} className="hover:text-cyan-400 transition-colors">
                        {artistData.email}
                      </a>
                    </div>
                  </div>

                  {/* Biography */}
                  {biografia && (
                    <div className="mb-4">
                      <p className="text-gray-400 italic text-sm leading-relaxed line-clamp-3">
                        {biografiaTruncated}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <Card className="bg-[#1a1f2e] border-cyan-500/20 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs text-gray-400">Fanbase</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {artistData.fanbase_size 
                        ? (artistData.fanbase_size >= 1000 
                          ? `${(artistData.fanbase_size / 1000).toFixed(1)}K` 
                          : artistData.fanbase_size)
                        : 'N/A'}
                    </p>
                  </Card>

                  <Card className="bg-[#1a1f2e] border-cyan-500/20 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs text-gray-400">Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <p className="text-xl font-bold text-white">{rating.toFixed(1)}</p>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(rating) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-[#1a1f2e] border-cyan-500/20 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Euro className="h-4 w-4 text-cyan-400" />
                      <span className="text-xs text-gray-400">Cachet</span>
                    </div>
                    <p className="text-xl font-bold text-white">
                      €{artistData.cachet_desiderato || 'N/A'}
                    </p>
                  </Card>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(links.spotify || links.instagram || links.youtube || links.tiktok || links.facebook) && (
              <Card className="bg-[#1a1f2e] border-cyan-500/20 p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-cyan-400" />
                  Links Verificati
                </h3>
                <div className="flex flex-wrap gap-3">
                  {links.spotify && (
                    <Button
                      onClick={() => openLink(links.spotify!)}
                      variant="outline"
                      size="sm"
                      className="bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/30 hover:bg-[#1DB954]/20"
                    >
                      <Music2 className="h-4 w-4 mr-2" />
                      Spotify
                    </Button>
                  )}
                  {links.instagram && (
                    <Button
                      onClick={() => openLink(links.instagram!)}
                      variant="outline"
                      size="sm"
                      className="bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/30 hover:bg-[#E4405F]/20"
                    >
                      <Instagram className="h-4 w-4 mr-2" />
                      Instagram
                    </Button>
                  )}
                  {links.youtube && (
                    <Button
                      onClick={() => openLink(links.youtube!)}
                      variant="outline"
                      size="sm"
                      className="bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/30 hover:bg-[#FF0000]/20"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      YouTube
                    </Button>
                  )}
                  {links.tiktok && (
                    <Button
                      onClick={() => openLink(links.tiktok!)}
                      variant="outline"
                      size="sm"
                      className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/20"
                    >
                      <Music2 className="h-4 w-4 mr-2" />
                      TikTok
                    </Button>
                  )}
                  {links.facebook && (
                    <Button
                      onClick={() => openLink(links.facebook!)}
                      variant="outline"
                      size="sm"
                      className="bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/30 hover:bg-[#1877F2]/20"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Statistics Card */}
            <Card className="bg-[#1a1f2e] border-cyan-500/20 p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statistiche</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Media Affluenza (ultimi 3 concerti)</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {artistData.avg_attendance_last_3_gigs || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Città Base</p>
                  <p className="text-2xl font-bold text-cyan-400">{artistData.citta}</p>
                </div>
              </div>
            </Card>

            {/* EPK Sections */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Professional Photos */}
              {artistData.foto_professionali && artistData.foto_professionali.length > 0 && (
                <Card className="bg-[#1a1f2e] border-cyan-500/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-cyan-400" />
                    Foto Professionali
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {artistData.foto_professionali.slice(0, 4).map((photo, idx) => (
                      <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-cyan-500/20">
                        <img 
                          src={photo} 
                          alt={`Foto ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                          onClick={() => openLink(photo)}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Audio Samples */}
              {artistData.accenni_brani && artistData.accenni_brani.length > 0 && (
                <Card className="bg-[#1a1f2e] border-cyan-500/20 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Music2 className="h-5 w-5 text-cyan-400" />
                    Accenni Brani
                  </h3>
                  <div className="space-y-3">
                    {artistData.accenni_brani.slice(0, 3).map((audio, idx) => (
                      <Button
                        key={idx}
                        onClick={() => openLink(audio)}
                        variant="outline"
                        className="w-full bg-[#252a3e] border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/10 justify-start"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Brano {idx + 1}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Full Biography */}
            {biografia && biografia.length > 200 && (
              <Card className="bg-[#1a1f2e] border-cyan-500/20 p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Biografia Completa</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {biografia}
                </p>
              </Card>
            )}

            {/* CTA Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={onBookingClick}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-6 text-lg shadow-lg shadow-cyan-500/50"
              >
                Proponi Booking
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};