import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MatchCard, { MatchCardProps } from "@/components/dashboard/MatchCard";
import FilterSidebar, { FilterState } from "@/components/dashboard/FilterSidebar";
import StatsSidebar from "@/components/dashboard/StatsSidebar";
import { BookingModal } from "@/components/dashboard/BookingModal";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, X, LogOut, Calendar, Clock, Euro, Users, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import MatrixRain from "@/components/MatrixRain";
import VenueMediaModal from "@/components/dashboard/VenueMediaModal";
import CollaborationRequestsTable from "@/components/dashboard/CollaborationRequestsTable";
import { CalendarView } from "@/components/dashboard/CalendarView";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  const [venueModal, setVenueModal] = useState<{
    open: boolean;
    venueId: string;
    venueName: string;
  }>({
    open: false,
    venueId: "",
    venueName: "",
  });

  const [sentBookings, setSentBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  useEffect(() => {
    loadUserData();
    loadMatches();
    loadSentBookings();
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

  const loadSentBookings = async () => {
    try {
      setLoadingBookings(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: bookings, error } = await supabase
        .from('booking_requests')
        .select('*')
        .eq('sender_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Carica i nomi dei receiver
      const bookingsWithNames = await Promise.all(
        (bookings || []).map(async (booking) => {
          const receiverName = await getReceiverName(booking.receiver_id);
          return { ...booking, receiver_name: receiverName };
        })
      );

      setSentBookings(bookingsWithNames);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le proposte inviate",
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const getReceiverName = async (userId: string): Promise<string> => {
    // Cerca in venues
    const { data: venue } = await supabase
      .from('venues')
      .select('nome_locale')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (venue) return venue.nome_locale;

    // Cerca in professionisti
    const { data: prof } = await supabase
      .from('professionisti')
      .select('nome_completo')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (prof) return prof.nome_completo;

    return 'Sconosciuto';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accettata';
      case 'rejected':
        return 'Rifiutata';
      default:
        return 'In Attesa';
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

      // 6. Filtro tipo entità (venue/professionista)
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
    <div className="relative min-h-screen bg-[#0f1419] overflow-hidden">
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
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
          {/* Filter Sidebar - Left (Desktop) */}
          <aside className="hidden lg:block lg:col-span-2">
            <FilterSidebar 
              filters={filters} 
              onFilterChange={setFilters}
              entityOptions={[
                { value: 'tutti', label: 'Tutti' },
                { value: 'venue', label: 'Venue' },
                { value: 'professionista', label: 'Professionista' }
              ]}
            />
          </aside>

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
                <div className="mt-4">
                  <FilterSidebar 
                    filters={filters} 
                    onFilterChange={setFilters}
                    entityOptions={[
                      { value: 'tutti', label: 'Tutti' },
                      { value: 'venue', label: 'Venue' },
                      { value: 'professionista', label: 'Professionista' }
                    ]}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content - Center */}
          <main className="lg:col-span-7">
            <Tabs defaultValue="matches" className="w-full">
              <TabsList className="w-full mb-6">
                <TabsTrigger value="matches" className="flex-1">Match Suggeriti</TabsTrigger>
                <TabsTrigger value="bookings" className="flex-1">Proposte Inviate</TabsTrigger>
              </TabsList>

              <TabsContent value="matches">
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
                        {filters.entityType === 'venue' ? 'Solo Venue' : 'Solo Professionisti'}
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
                        onViewProfile={match.tipo === 'venue' ? () =>
                          setVenueModal({
                            open: true,
                            venueId: match.id,
                            venueName: match.nome,
                          })
                        : undefined}
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
              </TabsContent>

              <TabsContent value="bookings">
                <Card className="bg-[#1a1f2e] border-cyan-500/30">
                  <CardHeader>
                    <CardTitle className="text-white">Le Tue Proposte Inviate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loadingBookings ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Caricamento...</p>
                      </div>
                    ) : sentBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">
                          Non hai ancora inviato nessuna proposta
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-cyan-500/30">
                              <TableHead className="text-cyan-400">Destinatario</TableHead>
                              <TableHead className="text-cyan-400">Data Evento</TableHead>
                              <TableHead className="text-cyan-400">Orario</TableHead>
                              <TableHead className="text-cyan-400">Compenso</TableHead>
                              <TableHead className="text-cyan-400">Stato</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sentBookings.map((booking) => (
                              <TableRow key={booking.id} className="border-cyan-500/30">
                                <TableCell className="font-medium text-white">
                                  {booking.receiver_name}
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-cyan-400" />
                                    {format(new Date(booking.event_date), "dd MMM yyyy", { locale: it })}
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-cyan-400" />
                                    {booking.event_time}
                                  </div>
                                </TableCell>
                                <TableCell className="text-gray-300">
                                  <div className="flex items-center gap-2">
                                    <Euro className="h-4 w-4 text-cyan-400" />
                                    {booking.proposed_compensation}€
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {getStatusLabel(booking.status)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>

          {/* Stats Sidebar - Right */}
          <aside className="hidden xl:block lg:col-span-3">
            <StatsSidebar />
          </aside>
        </div>

        {/* Collaboration Requests Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-[#1a1f2e] border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                Richieste di Collaborazione Ricevute
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CollaborationRequestsTable />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingModal.open}
        onOpenChange={(open) => {
          setBookingModal({ ...bookingModal, open });
          if (!open) {
            loadSentBookings();
          }
        }}
        receiverId={bookingModal.receiverId}
        receiverName={bookingModal.receiverName}
        receiverType={bookingModal.receiverType}
      />

      {/* Venue Profile Modal */}
      <VenueMediaModal
        open={venueModal.open}
        onOpenChange={(open) =>
          setVenueModal({ ...venueModal, open })
        }
        venueId={venueModal.venueId}
        venueName={venueModal.venueName}
        onBookingClick={() => {
          setVenueModal({ open: false, venueId: "", venueName: "" });
          setBookingModal({
            open: true,
            receiverId: venueModal.venueId,
            receiverName: venueModal.venueName,
            receiverType: "venue",
          });
        }}
      />
    </div>
  );
};

export default Dashboard;
