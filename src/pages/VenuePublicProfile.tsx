import { useState } from "react";
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
import { BookingModal } from "@/components/dashboard/BookingModal";
import { toast } from "@/hooks/use-toast";

// Mock data - In futuro verrà recuperato dal database
const mockVenueData: Record<string, any> = {
  '4': {
    id: '4',
    nome: 'Blue Note Milano',
    categoria: 'Jazz Club',
    città: 'Milano',
    indirizzo: 'Via Pietro Borsieri, 37, 20159 Milano MI',
    capacita: 400,
    rating: 4.9,
    totalReviews: 127,
    generi: ['Jazz', 'Blues', 'Soul', 'Funk'],
    budgetMedio: 3500,
    descrizione: 'Il Blue Note Milano è uno dei locali jazz più prestigiosi d\'Europa. Situato nel cuore di Milano, offre un\'esperienza musicale unica in un ambiente intimo e sofisticato. Dal 2003, il locale ospita artisti internazionali di fama mondiale e talenti emergenti della scena jazz italiana e internazionale. La venue dispone di un impianto audio di ultima generazione e di una cucina gourmet che completa l\'esperienza.',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=bluenote',
    galleryImages: [
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'
    ]
  }
};

const VenuePublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);

  // Get venue data (usando mock data per ora)
  const venue = mockVenueData[id || '4'] || mockVenueData['4'];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copiato!",
      description: "Il link del profilo è stato copiato negli appunti",
    });
  };

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
                {venue.galleryImages && venue.galleryImages[selectedImage] ? (
                  <img
                    src={venue.galleryImages[selectedImage]}
                    alt={venue.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-24 w-24 text-muted-foreground" />
                  </div>
                )}
              </div>
              {/* Gallery Thumbnails */}
              {venue.galleryImages && venue.galleryImages.length > 1 && (
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  {venue.galleryImages.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-1 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-primary shadow-lg'
                          : 'border-white/20 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Venue Info */}
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {venue.nome}
                  </h1>
                  <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                    {venue.categoria}
                  </Badge>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-warning text-warning" />
                  <span className="text-2xl font-bold text-foreground">{venue.rating}</span>
                </div>
                <span className="text-muted-foreground">({venue.totalReviews} recensioni)</span>
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
                    <p className="text-muted-foreground text-sm">€{venue.budgetMedio}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <Button
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                  onClick={() => setBookingModalOpen(true)}
                >
                  Prenota
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/10"
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
              {venue.descrizione}
            </p>
          </Card>

          {/* Musical Genres */}
          <Card className="p-6 bg-card border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Generi Musicali Preferiti
            </h2>
            <div className="flex flex-wrap gap-2">
              {venue.generi.map((genere: string) => (
                <Badge
                  key={genere}
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/30"
                >
                  {genere}
                </Badge>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Budget Medio</span>
                <span className="font-bold text-foreground">€{venue.budgetMedio}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Capacità</span>
                <span className="font-bold text-foreground">{venue.capacita} posti</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Città</span>
                <span className="font-bold text-foreground">{venue.città}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        receiverId={venue.id}
        receiverName={venue.nome}
        receiverType="venue"
      />
    </div>
  );
};

export default VenuePublicProfile;
