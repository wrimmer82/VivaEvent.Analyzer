import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MatchCard, { MatchCardProps } from "@/components/dashboard/MatchCard";
import FilterSidebar, { FilterState, EntityOption } from "@/components/dashboard/FilterSidebar";
import StatsSidebar from "@/components/dashboard/StatsSidebar";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { Badge } from "@/components/ui/badge";
import { User, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("match");
  const [matches, setMatches] = useState<MatchCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("Artista");
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    city: 'Tutte',
    radius: 50,
    budgetMin: 0,
    budgetMax: 5000,
    minRating: 0,
    dateStart: null,
    dateEnd: null,
    entityType: 'tutti'
  });

  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    receiverId: string;
    receiverName: string;
    receiverType: string;
  }>({
    open: false,
    receiverId: "",
    receiverName: "",
    receiverType: "",
  });

  useEffect(() => {
    loadUserData();
    loadMatches();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: artistData } = await supabase
        .from('artisti')
        .select('nome_completo')
        .eq('user_id', session.user.id)
        .single();

      if (artistData) {
        setUserName(artistData.nome_completo || "Artista");
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadMatches = async () => {
    try {
      setLoading(true);

      // Carica venues dal database
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select('*');

      if (venuesError) throw venuesError;

      // Carica professionisti dal database
      const { data: professionisti, error: profError } = await supabase
        .from('professionisti')
        .select('*');

      if (profError) throw profError;

      // Trasforma venues in MatchCardProps
      const venueMatches: MatchCardProps[] = (venues || []).map((venue) => ({
        id: venue.id,
        userId: venue.user_id,
        nome: venue.nome_locale,
        tipo: 'venue',
        genere: Array.isArray(venue.generi_preferiti) ? venue.generi_preferiti.join(', ') : '',
        città: venue.citta,
        capacity: venue.capacita,
        rating: 4.0 + Math.random() * 1, // Random rating tra 4.0 e 5.0
        avatarUrl: venue.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${venue.id}`,
        matchScore: Math.floor(60 + Math.random() * 40) // Random match score tra 60 e 100
      }));

      // Trasforma professionisti in MatchCardProps
      const profMatches: MatchCardProps[] = (professionisti || []).map((prof) => ({
        id: prof.id,
        userId: prof.user_id,
        nome: `${prof.nome_completo} (${prof.ruolo})`,
        tipo: 'professionista',
        genere: prof.ruolo,
        città: 'N/A',
        rating: 4.0 + Math.random() * 1,
        avatarUrl: prof.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${prof.id}`,
        matchScore: Math.floor(60 + Math.random() * 40)
      }));

      // Combina venues e professionisti
      setMatches([...venueMatches, ...profMatches]);

    } catch (error) {
      console.error('Error loading matches:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i match",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  // Custom entity options for artist dashboard
  const artistEntityOptions: EntityOption[] = [
    { value: 'tutti', label: 'Tutti' },
    { value: 'venue', label: 'Venue' },
    { value: 'professionista', label: 'Professionista' }
  ];

  // Apply filters function
  const applyFilters = () => {
    return matches.filter((match) => {
      // 1. Filtro genere
      const genreMatch = filters.genres.length === 0 || 
                         filters.genres.some(g => match.genere.toLowerCase().includes(g.toLowerCase()));
      
      // 2. Filtro città
      const cityMatch = filters.city === 'Tutte' || match.città === filters.city;
      
      // 3. Filtro budget (capacity * 10 = budget stimato)
      const matchValue = match.capacity ? match.capacity * 10 : 0;
      const budgetMatch = matchValue >= filters.budgetMin && matchValue <= filters.budgetMax;
      
      // 4. Filtro rating
      const ratingMatch = match.rating >= filters.minRating;
      
      // 5. Date: per ora sempre true (TODO)
      const dateMatch = true;

      // 6. Filtro tipo entità (venue/professionista) - updated for artist dashboard
      const entityTypeMatch = filters.entityType === 'tutti' || match.tipo === filters.entityType;
      
      return genreMatch && cityMatch && budgetMatch && ratingMatch && dateMatch && entityTypeMatch;
    });
  };

  // Filter matches based on filters
  const filteredMatches = applyFilters();

  // Sort filtered matches
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        {/* User Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 px-4 py-2 text-sm">
              <User className="h-4 w-4 mr-2" />
              Utente: {userName}
            </Badge>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate("/profile-dashboard")}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              Il Mio Profilo
            </Button>
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
          {/* Filter Sidebar - Left */}
          <aside className="hidden lg:block lg:col-span-2">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={setFilters} 
              entityOptions={artistEntityOptions}
            />
          </aside>

          {/* Main Content - Center */}
          <main className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">Match Suggeriti per Te</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {loading ? 'Caricamento...' : `${sortedMatches.length} match trovati`}
                </p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-[#1a1f2e] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1f2e] border-cyan-500/30 text-white">
                  <SelectItem value="match">Per Match Score</SelectItem>
                  <SelectItem value="rating">Per Rating</SelectItem>
                  <SelectItem value="recent">Più Recenti</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Tags */}
            {(filters.genres.length > 0 || filters.city !== 'Tutte' || filters.budgetMin > 0 || filters.budgetMax < 5000 || filters.minRating > 0 || filters.entityType !== 'tutti') && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.genres.map(genre => (
                  <Badge key={genre} className="bg-cyan-500/20 text-cyan-400 px-3 py-1 cursor-pointer hover:bg-cyan-500/30">
                    {genre}
                    <X 
                      className="h-3 w-3 ml-1 inline" 
                      onClick={() => setFilters({...filters, genres: filters.genres.filter(g => g !== genre)})}
                    />
                  </Badge>
                ))}
                {filters.city !== 'Tutte' && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1 cursor-pointer hover:bg-cyan-500/30">
                    {filters.city}
                    <X 
                      className="h-3 w-3 ml-1 inline" 
                      onClick={() => setFilters({...filters, city: 'Tutte'})}
                    />
                  </Badge>
                )}
                {(filters.budgetMin > 0 || filters.budgetMax < 5000) && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1 cursor-pointer hover:bg-cyan-500/30">
                    €{filters.budgetMin} - €{filters.budgetMax}
                    <X 
                      className="h-3 w-3 ml-1 inline" 
                      onClick={() => setFilters({...filters, budgetMin: 0, budgetMax: 5000})}
                    />
                  </Badge>
                )}
                {filters.minRating > 0 && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1 cursor-pointer hover:bg-cyan-500/30">
                    Rating {filters.minRating}+
                    <X 
                      className="h-3 w-3 ml-1 inline" 
                      onClick={() => setFilters({...filters, minRating: 0})}
                    />
                  </Badge>
                )}
                {filters.entityType !== 'tutti' && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1 cursor-pointer hover:bg-cyan-500/30">
                    {filters.entityType === 'venue' ? 'Solo Venue' : filters.entityType === 'professionista' ? 'Solo Professionista' : 'Filtro Attivo'}
                    <X 
                      className="h-3 w-3 ml-1 inline" 
                      onClick={() => setFilters({...filters, entityType: 'tutti'})}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Match Grid or Empty State */}
            {loading ? (
              <div className="bg-[#1a1f2e] border border-cyan-500/30 rounded-lg p-12 text-center">
                <div className="text-white text-xl">Caricamento match...</div>
              </div>
            ) : sortedMatches.length === 0 ? (
              <div className="bg-[#1a1f2e] border border-cyan-500/30 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-white text-xl font-bold mb-2">Nessun match trovato</h3>
                <p className="text-gray-400 mb-4">
                  Nessun venue corrisponde ai criteri di ricerca selezionati
                </p>
                <button
                  onClick={() => setFilters({
                    genres: [],
                    city: 'Tutte',
                    radius: 50,
                    budgetMin: 0,
                    budgetMax: 5000,
                    minRating: 0,
                    dateStart: null,
                    dateEnd: null,
                    entityType: 'tutti'
                  })}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Reset Filtri
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedMatches.map((match) => (
                  <MatchCard 
                    key={match.id} 
                    {...match}
                    onBookingClick={() =>
                      setBookingModal({
                        open: true,
                        receiverId: match.userId || match.id,
                        receiverName: match.nome,
                        receiverType: match.tipo,
                      })
                    }
                  />
                ))}
              </div>
            )}
          </main>

          {/* Stats Sidebar - Right */}
          <aside className="hidden xl:block lg:col-span-3">
            <StatsSidebar />
          </aside>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModal.open}
        onOpenChange={(open) => setBookingModal({ ...bookingModal, open })}
        receiverId={bookingModal.receiverId}
        receiverName={bookingModal.receiverName}
        receiverType={bookingModal.receiverType}
      />
    </div>
  );
};

export default Dashboard;
