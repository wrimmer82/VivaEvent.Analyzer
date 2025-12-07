import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Euro, Users, X, LogOut, Mail, Phone, ArrowRight, Filter } from "lucide-react";
import StatsSidebar from "@/components/dashboard/StatsSidebar";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { ArtistMediaModal } from "@/components/dashboard/ArtistMediaModal";
import CollaborationRequestModal from "@/components/dashboard/CollaborationRequestModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import MatrixRain from "@/components/MatrixRain";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface ProfessionalMatch {
  id: string;
  nome: string;
  tipo: 'artista' | 'venue';
  genere: string;
  generi?: string[]; // Array di generi multipli per artisti
  città: string;
  email: string;
  telefono?: string;
  cachet?: number;
  capacity?: number;
  rating: number;
  avatarUrl: string;
  matchScore: number;
  matchReason: string;
  lastUpdated: Date;
}


interface FilterState {
  genres: string[];
  city: string;
  tipo: string;
  newMatch: boolean;
  minRating: number;
}

const ProfessionalMatchingDashboard = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("match");
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    city: 'Tutte',
    tipo: 'tutti',
    newMatch: false,
    minRating: 0
  });
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<ProfessionalMatch | null>(null);
  const [matches, setMatches] = useState<ProfessionalMatch[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [artistMediaModal, setArtistMediaModal] = useState<{
    open: boolean;
    artistId: string;
    artistName: string;
  }>({
    open: false,
    artistId: "",
    artistName: "",
  });

  const [collaborationModal, setCollaborationModal] = useState<{
    open: boolean;
    receiverId: string;
    receiverName: string;
    receiverType: "artista" | "venue";
  }>({
    open: false,
    receiverId: "",
    receiverName: "",
    receiverType: "artista",
  });

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        
        const { data: artisti, error: artistiError } = await supabase
          .from('artisti')
          .select('*');
        
        if (artistiError) throw artistiError;
        
        const { data: venues, error: venuesError } = await supabase
          .from('venues')
          .select('*');
        
        if (venuesError) throw venuesError;
        
        const artistiMatches: ProfessionalMatch[] = (artisti || []).map(artista => ({
          id: artista.id,
          nome: artista.nome_completo,
          tipo: 'artista' as const,
          genere: artista.genere_musicale,
          generi: artista.generi || [artista.genere_musicale], // Array di generi multipli
          città: artista.citta,
          email: artista.email,
          cachet: artista.cachet_desiderato,
          rating: 4.5 + Math.random() * 0.5,
          avatarUrl: artista.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${artista.id}`,
          matchScore: Math.floor(75 + Math.random() * 20),
          matchReason: `Artista ${artista.genere_musicale} da ${artista.citta}. Cerca opportunità di collaborazione professionale.`,
          lastUpdated: new Date(artista.created_at)
        }));
        
        const venuesMatches: ProfessionalMatch[] = (venues || []).map(venue => ({
          id: venue.id,
          nome: venue.nome_locale,
          tipo: 'venue' as const,
          genere: venue.generi_preferiti.join(', '),
          città: venue.citta,
          email: venue.email,
          capacity: venue.capacita,
          rating: 4.3 + Math.random() * 0.6,
          avatarUrl: venue.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${venue.id}`,
          matchScore: Math.floor(70 + Math.random() * 25),
          matchReason: `Venue con capacità ${venue.capacita} persone, budget medio €${venue.budget_medio}. Cerca artisti per eventi.`,
          lastUpdated: new Date(venue.created_at)
        }));
        
        setMatches([...artistiMatches, ...venuesMatches]);
      } catch (error) {
        console.error('Errore nel caricamento dei match:', error);
        toast({
          variant: "destructive",
          title: "Errore",
          description: "Impossibile caricare i match"
        });
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMatches();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout effettuato",
        description: "A presto!",
      });
      navigate("/accedi");
    }
  };

  const applyFilters = () => {
    return matches.filter((match) => {
      // Filtro genere - controlla sia genere singolo che array generi
      const genreMatch = filters.genres.length === 0 || 
                         filters.genres.some(filterGenre => {
                           // Se il match ha l'array generi (artisti), controlla nell'array
                           if (match.generi && match.generi.length > 0) {
                             return match.generi.some(matchGenre => 
                               matchGenre.toLowerCase().includes(filterGenre.toLowerCase())
                             );
                           }
                           // Altrimenti controlla nel campo genere singolo
                           return match.genere.toLowerCase().includes(filterGenre.toLowerCase());
                         });
      const cityMatch = filters.city === 'Tutte' || match.città === filters.city;
      const tipoMatch = filters.tipo === 'tutti' || match.tipo === filters.tipo;
      const ratingMatch = match.rating >= filters.minRating;
      
      const newMatchFilter = !filters.newMatch || 
        (new Date().getTime() - match.lastUpdated.getTime()) < 7 * 24 * 60 * 60 * 1000;
      
      return genreMatch && cityMatch && tipoMatch && ratingMatch && newMatchFilter;
    });
  };

  const filteredMatches = applyFilters();

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "recent") return b.lastUpdated.getTime() - a.lastUpdated.getTime();
    return 0;
  });

  const getMatchScoreColor = (score: number) => {
    if (score > 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const genres = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Indie', 'Metal', 'House', 'Ambient', 'Techno', 'Alternative'];
  const cities = ['Tutte', 'Milano', 'Roma', 'Torino', 'Bologna', 'Napoli', 'Firenze'];

  const handleOpenBookingModal = (match: ProfessionalMatch) => {
    setSelectedMatch(match);
    setBookingModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#0f1419] overflow-hidden">
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 px-4 py-2 text-sm">
              <Users className="h-4 w-4 mr-2" />
              Dashboard Matching Professionista
            </Badge>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden col-span-1 mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full gap-2 bg-[#1a1f2e] border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20">
                  <Filter className="h-4 w-4" />
                  Filtri
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#0f1419] border-cyan-500/30 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-cyan-400">Filtri</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-6">
                  <div>
                    <label className="text-cyan-400 text-sm font-semibold mb-2 block">Tipo</label>
                    <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                      <SelectTrigger className="bg-[#0f1419] border-cyan-500/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-cyan-500/50">
                        <SelectItem value="tutti">Tutti</SelectItem>
                        <SelectItem value="artista">Artisti</SelectItem>
                        <SelectItem value="venue">Venues</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-cyan-400 text-sm font-semibold mb-2 block">Genere</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {genres.map(genre => (
                        <label key={genre} className="flex items-center gap-2 cursor-pointer text-white hover:text-cyan-400">
                          <input 
                            type="checkbox" 
                            checked={filters.genres.includes(genre)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters({...filters, genres: [...filters.genres, genre]});
                              } else {
                                setFilters({...filters, genres: filters.genres.filter(g => g !== genre)});
                              }
                            }}
                            className="accent-cyan-500"
                          />
                          <span className="text-sm">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-cyan-400 text-sm font-semibold mb-2 block">Città</label>
                    <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
                      <SelectTrigger className="bg-[#0f1419] border-cyan-500/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-cyan-500/50">
                        {cities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer text-white hover:text-cyan-400">
                      <input 
                        type="checkbox"
                        checked={filters.newMatch}
                        onChange={(e) => setFilters({...filters, newMatch: e.target.checked})}
                        className="accent-cyan-500"
                      />
                      <span className="text-sm">Solo nuovi match</span>
                    </label>
                  </div>

                  <div>
                    <label className="text-cyan-400 text-sm font-semibold mb-2 block">Rating minimo</label>
                    <Select value={filters.minRating.toString()} onValueChange={(value) => setFilters({...filters, minRating: parseFloat(value)})}>
                      <SelectTrigger className="bg-[#0f1419] border-cyan-500/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-cyan-500/50">
                        <SelectItem value="0">Tutti</SelectItem>
                        <SelectItem value="4.0">4.0+</SelectItem>
                        <SelectItem value="4.5">4.5+</SelectItem>
                        <SelectItem value="4.8">4.8+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(filters.genres.length > 0 || filters.city !== 'Tutte' || filters.tipo !== 'tutti' || filters.newMatch || filters.minRating > 0) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => setFilters({genres: [], city: 'Tutte', tipo: 'tutti', newMatch: false, minRating: 0})}
                    >
                      Reset Filtri
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-2">
            <Card className="bg-[#1a1f2e] border-cyan-500/30 sticky top-4 p-6">
              <h3 className="text-white text-xl font-bold mb-6">🔍 Filtra</h3>
              
              <div className="mb-6">
                <label className="text-cyan-400 text-sm font-semibold mb-2 block">Tipo</label>
                <Select value={filters.tipo} onValueChange={(value) => setFilters({...filters, tipo: value})}>
                  <SelectTrigger className="bg-[#0f1419] border-cyan-500/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1f2e] border-cyan-500/50">
                    <SelectItem value="tutti">Tutti</SelectItem>
                    <SelectItem value="artista">Artisti</SelectItem>
                    <SelectItem value="venue">Venues</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label className="text-cyan-400 text-sm font-semibold mb-2 block">Genere</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center gap-2 cursor-pointer text-white hover:text-cyan-400">
                      <input 
                        type="checkbox" 
                        checked={filters.genres.includes(genre)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({...filters, genres: [...filters.genres, genre]});
                          } else {
                            setFilters({...filters, genres: filters.genres.filter(g => g !== genre)});
                          }
                        }}
                        className="accent-cyan-500"
                      />
                      <span className="text-sm">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-cyan-400 text-sm font-semibold mb-2 block">Città</label>
                <Select value={filters.city} onValueChange={(value) => setFilters({...filters, city: value})}>
                  <SelectTrigger className="bg-[#0f1419] border-cyan-500/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1f2e] border-cyan-500/50">
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer text-white hover:text-cyan-400">
                  <input 
                    type="checkbox"
                    checked={filters.newMatch}
                    onChange={(e) => setFilters({...filters, newMatch: e.target.checked})}
                    className="accent-cyan-500"
                  />
                  <span className="text-sm">Solo nuovi match</span>
                </label>
              </div>

              <div className="mb-4">
                <label className="text-cyan-400 text-sm font-semibold mb-2 block">Rating minimo</label>
                <Select value={filters.minRating.toString()} onValueChange={(value) => setFilters({...filters, minRating: parseFloat(value)})}>
                  <SelectTrigger className="bg-[#0f1419] border-cyan-500/50 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1f2e] border-cyan-500/50">
                    <SelectItem value="0">Tutti</SelectItem>
                    <SelectItem value="4.0">4.0+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                    <SelectItem value="4.8">4.8+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(filters.genres.length > 0 || filters.city !== 'Tutte' || filters.tipo !== 'tutti' || filters.newMatch || filters.minRating > 0) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  onClick={() => setFilters({genres: [], city: 'Tutte', tipo: 'tutti', newMatch: false, minRating: 0})}
                >
                  Reset Filtri
                </Button>
              )}
            </Card>
          </aside>

          <div className="lg:col-span-7 space-y-6">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6 bg-[#1a1f2e] border-cyan-500/30">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Match Suggeriti</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {sortedMatches.length} opportunità trovate
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Ordina per:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px] bg-[#1a1f2e] border-cyan-500/50 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1a1f2e] border-cyan-500/50">
                        <SelectItem value="match">Match Score</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="recent">Più recenti</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(filters.genres.length > 0 || filters.city !== 'Tutte' || filters.tipo !== 'tutti' || filters.newMatch || filters.minRating > 0) && (
                  <div className="flex flex-wrap gap-2">
                    {filters.genres.map(genre => (
                      <Badge key={genre} variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        {genre}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({...filters, genres: filters.genres.filter(g => g !== genre)})}
                        />
                      </Badge>
                    ))}
                    {filters.city !== 'Tutte' && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        {filters.city}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({...filters, city: 'Tutte'})}
                        />
                      </Badge>
                    )}
                    {filters.tipo !== 'tutti' && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        {filters.tipo === 'artista' ? 'Artisti' : 'Venues'}
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({...filters, tipo: 'tutti'})}
                        />
                      </Badge>
                    )}
                    {filters.newMatch && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        Nuovi match
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({...filters, newMatch: false})}
                        />
                      </Badge>
                    )}
                    {filters.minRating > 0 && (
                      <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                        Rating {filters.minRating}+
                        <X 
                          className="h-3 w-3 ml-1 cursor-pointer" 
                          onClick={() => setFilters({...filters, minRating: 0})}
                        />
                      </Badge>
                    )}
                  </div>
                )}

                <div className="grid gap-6">
                  {sortedMatches.map((match) => (
                    <Card key={match.id} className="bg-[#1a1f2e] border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300">
                      <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="h-16 w-16 border-2 border-cyan-500/50">
                              <AvatarImage src={match.avatarUrl} alt={match.nome} />
                              <AvatarFallback className="bg-cyan-500/20 text-cyan-400">
                                {match.nome.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-lg font-bold text-white">{match.nome}</h3>
                                <Badge className={match.tipo === 'artista' ? 'bg-purple-500/20 text-purple-400' : 'bg-amber-500/20 text-amber-400'}>
                                  {match.tipo === 'artista' ? '🎤 Artista' : '🏛️ Venue'}
                                </Badge>
                              </div>
                              
                              <p className="text-cyan-400 text-sm mb-2">{match.genere}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {match.città}
                                </div>
                                {match.tipo === 'artista' && match.cachet && (
                                  <div className="flex items-center gap-1">
                                    <Euro className="h-4 w-4" />
                                    Cachet: €{match.cachet}
                                  </div>
                                )}
                                {match.tipo === 'venue' && match.capacity && (
                                  <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    Capacità: {match.capacity}
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  {match.rating.toFixed(1)}
                                </div>
                              </div>

                              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {match.email}
                                </div>
                                {match.telefono && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {match.telefono}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between md:w-64">
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-cyan-400 font-semibold">MATCH SCORE</span>
                                <Badge className={`${getMatchScoreColor(match.matchScore)} text-white`}>
                                  {match.matchScore}%
                                </Badge>
                              </div>
                              
                              <div className="bg-[#0f1419] p-3 rounded-lg border border-cyan-500/20">
                                <p className="text-xs text-muted-foreground italic">
                                  "{match.matchReason}"
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Button 
                                onClick={() => {
                                  if (match.tipo === 'artista') {
                                    setArtistMediaModal({
                                      open: true,
                                      artistId: match.id,
                                      artistName: match.nome,
                                    });
                                  } else {
                                    navigate(`/venue-profile/${match.id}`);
                                  }
                                }}
                                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                              >
                                Visualizza Profilo
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => {
                                  setCollaborationModal({
                                    open: true,
                                    receiverId: match.id,
                                    receiverName: match.nome,
                                    receiverType: match.tipo,
                                  });
                                }}
                                className="w-full border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                              >
                                Richiedi Collaborazione
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  {sortedMatches.length === 0 && (
                    <Card className="bg-[#1a1f2e] border-cyan-500/30 p-12 text-center">
                      <p className="text-muted-foreground">Nessun match trovato con i filtri selezionati</p>
                    </Card>
                  )}
                </div>
              </>
            )}
          </div>

          <aside className="hidden lg:block lg:col-span-3">
            <StatsSidebar />
          </aside>
        </div>
      </div>

      {selectedMatch && (
        <BookingModal
          open={bookingModalOpen}
          onOpenChange={setBookingModalOpen}
          receiverId={selectedMatch.id}
          receiverName={selectedMatch.nome}
          receiverType={selectedMatch.tipo}
        />
      )}

      {/* Artist Media Modal */}
      <ArtistMediaModal
        open={artistMediaModal.open}
        onOpenChange={(open) => setArtistMediaModal({ ...artistMediaModal, open })}
        artistId={artistMediaModal.artistId}
        artistName={artistMediaModal.artistName}
        onBookingClick={() => {
          const match = sortedMatches.find(m => m.id === artistMediaModal.artistId);
          if (match) {
            setArtistMediaModal({ ...artistMediaModal, open: false });
            setCollaborationModal({
              open: true,
              receiverId: match.id,
              receiverName: match.nome,
              receiverType: "artista",
            });
          }
        }}
      />

      {/* Collaboration Request Modal */}
      <CollaborationRequestModal
        open={collaborationModal.open}
        onOpenChange={(open) => setCollaborationModal({ ...collaborationModal, open })}
        receiverId={collaborationModal.receiverId}
        receiverName={collaborationModal.receiverName}
        receiverType={collaborationModal.receiverType}
      />
    </div>
  );
};

export default ProfessionalMatchingDashboard;
