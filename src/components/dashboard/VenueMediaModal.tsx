import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Mail, MapPin, Users, Phone, Globe, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Instagram, Facebook, Youtube, Music } from "lucide-react";

interface VenueMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venueId: string;
  venueName: string;
  onBookingClick?: () => void;
}

interface VenueData {
  nome_locale: string;
  generi_preferiti: string[];
  citta: string;
  indirizzo: string;
  email: string;
  telefono?: string;
  sito_web?: string;
  biografia?: string;
  capacita: number;
  budget_medio: number;
  links?: {
    website?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
  avatar_url?: string;
}

const VenueMediaModal = ({ 
  open, 
  onOpenChange, 
  venueId, 
  venueName,
  onBookingClick 
}: VenueMediaModalProps) => {
  const [loading, setLoading] = useState(true);
  const [venueData, setVenueData] = useState<VenueData | null>(null);

  useEffect(() => {
    if (open && venueId) {
      loadVenueData();
    }
  }, [open, venueId]);

  const loadVenueData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', venueId)
        .single();

      if (error) throw error;
      setVenueData(data as unknown as VenueData);
    } catch (error) {
      console.error('Error loading venue data:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dati del venue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/venue/${venueId}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copiato!",
      description: "Il link al profilo è stato copiato negli appunti",
    });
  };

  const openLink = (url?: string) => {
    if (!url) return;
    
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = 'https://' + url;
    }
    
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#1a1f2e] border-cyan-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">
            Profilo Venue
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-32 rounded-full mx-auto" />
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : venueData ? (
          <div className="space-y-6">
            {/* Header con Avatar e Info Base */}
            <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b border-cyan-500/20">
              <Avatar className="h-32 w-32 border-4 border-cyan-500/30">
                <AvatarImage src={venueData.avatar_url} alt={venueData.nome_locale} />
                <AvatarFallback className="text-4xl bg-cyan-900/30">
                  {venueData.nome_locale.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {venueData.nome_locale}
                </h2>
                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {venueData.generi_preferiti?.map((genere, index) => (
                    <Badge key={index} variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      {genere}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 text-gray-300">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm">{venueData.citta}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm">{venueData.capacita} persone</span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Condividi Profilo
              </Button>
            </div>

            {/* Sezione Descrizione */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Descrizione</h3>
                
                {/* Biografia */}
                {venueData.biografia && (
                  <div className="mb-4">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {venueData.biografia}
                    </p>
                  </div>
                )}

                {/* Informazioni di contatto */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0f1419]/50 p-4 rounded-lg border border-cyan-500/20">
                  {/* Email */}
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm text-gray-300">{venueData.email}</span>
                  </div>

                  {/* Telefono */}
                  {venueData.telefono && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-cyan-500" />
                      <span className="text-sm text-gray-300">{venueData.telefono}</span>
                    </div>
                  )}

                  {/* Indirizzo */}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-cyan-500" />
                    <span className="text-sm text-gray-300">{venueData.indirizzo}</span>
                  </div>

                  {/* Sito Web */}
                  {venueData.sito_web && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-cyan-500" />
                      <button
                        onClick={() => openLink(venueData.sito_web)}
                        className="text-sm text-cyan-400 hover:underline"
                      >
                        {venueData.sito_web}
                      </button>
                    </div>
                  )}
                </div>

                {/* Social Links */}
                {venueData.links && Object.keys(venueData.links).length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-cyan-400 mb-3">Social Media</h4>
                    <div className="flex flex-wrap gap-2">
                      {venueData.links.instagram && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openLink(venueData.links?.instagram)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Instagram className="h-4 w-4 mr-2" />
                          Instagram
                        </Button>
                      )}
                      {venueData.links.facebook && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openLink(venueData.links?.facebook)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Facebook className="h-4 w-4 mr-2" />
                          Facebook
                        </Button>
                      )}
                      {venueData.links.youtube && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openLink(venueData.links?.youtube)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Youtube className="h-4 w-4 mr-2" />
                          YouTube
                        </Button>
                      )}
                      {venueData.links.tiktok && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openLink(venueData.links?.tiktok)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Music className="h-4 w-4 mr-2" />
                          TikTok
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Statistiche */}
              <div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-4">Informazioni Venue</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#0f1419]/50 p-4 rounded-lg border border-cyan-500/20">
                    <div className="text-sm text-gray-400 mb-1">Capacità</div>
                    <div className="text-2xl font-bold text-cyan-400">{venueData.capacita}</div>
                    <div className="text-xs text-gray-500">persone</div>
                  </div>
                  <div className="bg-[#0f1419]/50 p-4 rounded-lg border border-cyan-500/20">
                    <div className="text-sm text-gray-400 mb-1">Budget Medio</div>
                    <div className="text-2xl font-bold text-cyan-400">€{venueData.budget_medio}</div>
                    <div className="text-xs text-gray-500">per evento</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {onBookingClick && (
              <div className="pt-4 border-t border-cyan-500/20">
                <Button
                  onClick={onBookingClick}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  size="lg"
                >
                  Proponi Booking
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Impossibile caricare i dati del venue</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VenueMediaModal;
