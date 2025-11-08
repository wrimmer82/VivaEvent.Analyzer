import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Euro, Users, X, LogOut, Mail, Phone, ArrowRight } from "lucide-react";
import StatsSidebar from "@/components/dashboard/StatsSidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ProfessionalMatch {
  id: string;
  nome: string;
  tipo: 'artista' | 'venue';
  genere: string;
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

const mockMatches: ProfessionalMatch[] = [
  {
    id: '1',
    nome: 'Club Alcatraz',
    tipo: 'venue',
    genere: 'Rock, Metal',
    città: 'Milano',
    email: 'info@alcatraz.it',
    telefono: '+39 02 1234567',
    capacity: 2000,
    rating: 4.8,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=alcatraz',
    matchScore: 92,
    matchReason: 'Alta richiesta di organizzazione eventi rock. Budget disponibile €3000-5000.',
    lastUpdated: new Date('2025-01-15')
  },
  {
    id: '2',
    nome: 'The Rockers',
    tipo: 'artista',
    genere: 'Rock, Alternative',
    città: 'Roma',
    email: 'booking@therockers.it',
    cachet: 2500,
    rating: 4.7,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=rockers',
    matchScore: 88,
    matchReason: 'Cercano management per tour italiano. Esperienza comprovata necessaria.',
    lastUpdated: new Date('2025-01-14')
  },
  {
    id: '3',
    nome: 'Live Music Hall',
    tipo: 'venue',
    genere: 'Pop, Indie',
    città: 'Torino',
    email: 'eventi@livehall.it',
    capacity: 500,
    rating: 4.6,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=livehall',
    matchScore: 81,
    matchReason: 'Venue emergente cerca collaborazione stabile per booking artisti indie.',
    lastUpdated: new Date('2025-01-13')
  },
  {
    id: '4',
    nome: 'Jazz Fusion Band',
    tipo: 'artista',
    genere: 'Jazz, Fusion',
    città: 'Milano',
    email: 'contact@jazzfusion.it',
    telefono: '+39 335 9876543',
    cachet: 1800,
    rating: 4.9,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=jazzfusion',
    matchScore: 85,
    matchReason: 'Band jazz affermata cerca collaborazione per eventi corporate e privati.',
    lastUpdated: new Date('2025-01-12')
  },
  {
    id: '5',
    nome: 'Blue Note Milano',
    tipo: 'venue',
    genere: 'Jazz, Blues',
    città: 'Milano',
    email: 'booking@bluenote.it',
    capacity: 400,
    rating: 4.9,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=bluenote',
    matchScore: 90,
    matchReason: 'Locale prestigioso cerca professionista per gestione artisti internazionali.',
    lastUpdated: new Date('2025-01-11')
  },
  {
    id: '6',
    nome: 'Electronic Waves',
    tipo: 'artista',
    genere: 'Electronic, House',
    città: 'Bologna',
    email: 'info@electronicwaves.it',
    cachet: 3000,
    rating: 4.5,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=electronic',
    matchScore: 79,
    matchReason: 'DJ emergente con fanbase 50k+ cerca booking agent per festival estivi.',
    lastUpdated: new Date('2025-01-10')
  },
  {
    id: '7',
    nome: 'Teatro Ariston',
    tipo: 'venue',
    genere: 'Rock, Pop',
    città: 'Roma',
    email: 'direzione@ariston.it',
    telefono: '+39 06 7654321',
    capacity: 1500,
    rating: 4.7,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ariston',
    matchScore: 83,
    matchReason: 'Teatro storico cerca consulente per programmazione stagione 2025-2026.',
    lastUpdated: new Date('2025-01-09')
  },
  {
    id: '8',
    nome: 'Indie Stars',
    tipo: 'artista',
    genere: 'Indie, Alternative',
    città: 'Firenze',
    email: 'management@indiestars.it',
    cachet: 2200,
    rating: 4.6,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=indiestars',
    matchScore: 77,
    matchReason: 'Band indie cerca supporto per lancio nuovo album e tour promozionale.',
    lastUpdated: new Date('2025-01-08')
  }
];

interface FilterState {
  genres: string[];
  city: string;
  tipo: string; // 'tutti', 'venue', 'artista'
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

  // Apply filters
  const applyFilters = () => {
    return mockMatches.filter((match) => {
      const genreMatch = filters.genres.length === 0 || 
                         filters.genres.some(g => match.genere.toLowerCase().includes(g.toLowerCase()));
      const cityMatch = filters.city === 'Tutte' || match.città === filters.city;
      const tipoMatch = filters.tipo === 'tutti' || match.tipo === filters.tipo;
      const ratingMatch = match.rating >= filters.minRating;
      
      // New match = last 7 days
      const newMatchFilter = !filters.newMatch || 
        (new Date().getTime() - match.lastUpdated.getTime()) < 7 * 24 * 60 * 60 * 1000;
      
      return genreMatch && cityMatch && tipoMatch && ratingMatch && newMatchFilter;
    });
  };

  const filteredMatches = applyFilters();

  // Sort matches
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

  const genres = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Indie', 'Metal', 'House', 'Alternative'];
  const cities = ['Tutte', 'Milano', 'Roma', 'Torino', 'Bologna', 'Napoli', 'Firenze'];

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        {/* Header with User Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 px-4 py-2 text-sm">
              <Users className="h-4 w-4 mr-2" />
              Dashboard Matching Professionista
            </Badge>
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 px-3 py-2 text-xs">
              DEMO MODE
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
          {/* Filter Sidebar - Left */}
          <aside className="hidden lg:block lg:col-span-2">
            <Card className="bg-[#1a1f2e] border-cyan-500/30 sticky top-4 p-6">
              <h3 className="text-white text-xl font-bold mb-6">🔍 Filtra</h3>
              
              {/* Tipo */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Tipo ▼</label>
                <select
                  value={filters.tipo}
                  onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
                           focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                >
                  <option value="tutti">Tutti</option>
                  <option value="venue">Solo Venue</option>
                  <option value="artista">Solo Artisti</option>
                </select>
              </div>

              {/* Genere */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Genere ▼</label>
                <div className="space-y-2">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center space-x-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.genres.includes(genre)}
                        onChange={(e) => {
                          const newGenres = e.target.checked
                            ? [...filters.genres, genre]
                            : filters.genres.filter(g => g !== genre);
                          setFilters({ ...filters, genres: newGenres });
                        }}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 
                                 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span className="text-gray-300 text-sm group-hover:text-cyan-400 transition-colors">
                        {genre}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Città */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Città ▼</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
                           focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Nuovi Match Toggle */}
              <div className="mb-6">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.newMatch}
                    onChange={(e) => setFilters({ ...filters, newMatch: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 
                             focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-gray-300 text-sm group-hover:text-cyan-400 transition-colors">
                    Solo nuovi match (7gg)
                  </span>
                </label>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="text-gray-300 text-sm font-semibold mb-3 block">Rating Minimo ▼</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                  className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
                           focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
                >
                  <option value="0">Tutti</option>
                  <option value="4.0">4.0+ stelle</option>
                  <option value="4.5">4.5+ stelle</option>
                  <option value="4.8">4.8+ stelle</option>
                </select>
              </div>

              {/* Reset */}
              <button
                onClick={() => setFilters({
                  genres: [],
                  city: 'Tutte',
                  tipo: 'tutti',
                  newMatch: false,
                  minRating: 0
                })}
                className="w-full text-cyan-400 hover:text-cyan-300 font-medium py-2 px-4 
                         transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
              >
                Reset Filtri
              </button>
            </Card>
          </aside>

          {/* Main Content - Center */}
          <main className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">Match Suggeriti per Te</h1>
                <p className="text-gray-400 text-sm mt-1">
                  {sortedMatches.length} opportunità trovate
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
            {(filters.genres.length > 0 || filters.city !== 'Tutte' || filters.tipo !== 'tutti' || filters.newMatch || filters.minRating > 0) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.tipo !== 'tutti' && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1 cursor-pointer hover:bg-cyan-500/30">
                    {filters.tipo === 'venue' ? 'Solo Venue' : 'Solo Artisti'}
                    <X 
                      className="h-3 w-3 ml-1 inline" 
                      onClick={() => setFilters({...filters, tipo: 'tutti'})}
                    />
                  </Badge>
                )}
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
                {filters.newMatch && (
                  <Badge className="bg-cyan-500/20 text-cyan-400 px-3 py-1 cursor-pointer hover:bg-cyan-500/30">
                    Nuovi Match
                    <X 
                      className="h-3 w-3 ml-1 inline" 
                      onClick={() => setFilters({...filters, newMatch: false})}
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
              </div>
            )}

            {/* Match Grid */}
            {sortedMatches.length === 0 ? (
              <div className="bg-[#1a1f2e] border border-cyan-500/30 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-white text-xl font-bold mb-2">Nessun match trovato</h3>
                <p className="text-gray-400 mb-4">
                  Nessuna opportunità corrisponde ai criteri di ricerca selezionati
                </p>
                <button
                  onClick={() => setFilters({
                    genres: [],
                    city: 'Tutte',
                    tipo: 'tutti',
                    newMatch: false,
                    minRating: 0
                  })}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Reset Filtri
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedMatches.map((match) => (
                  <div 
                    key={match.id}
                    className="relative bg-[#1a1f2e] border border-cyan-500/30 rounded-xl p-5 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all duration-300"
                  >
                    {/* Match Score Badge */}
                    <Badge 
                      className={`absolute top-4 right-4 ${getMatchScoreColor(match.matchScore)} text-white font-bold text-sm`}
                    >
                      {match.matchScore}%
                    </Badge>

                    {/* Tipo Badge */}
                    <Badge 
                      className={`absolute top-4 left-4 ${match.tipo === 'venue' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'} text-xs font-semibold`}
                    >
                      {match.tipo === 'venue' ? '🏛️ VENUE' : '🎸 ARTISTA'}
                    </Badge>

                    {/* Avatar and Name */}
                    <div className="flex items-start gap-4 mb-4 mt-6">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={match.avatarUrl} alt={match.nome} />
                        <AvatarFallback>{match.nome.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white mb-1">{match.nome}</h3>
                        <p className="text-sm text-gray-400">{match.genere}</p>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span>{match.rating} Rating</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="h-4 w-4 text-cyan-500" />
                        <span>{match.città}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <Mail className="h-4 w-4 text-cyan-500" />
                        <span className="truncate">{match.email}</span>
                      </div>
                      {match.telefono && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Phone className="h-4 w-4 text-cyan-500" />
                          <span>{match.telefono}</span>
                        </div>
                      )}
                      {match.tipo === 'artista' && match.cachet && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Euro className="h-4 w-4 text-cyan-500" />
                          <span>€{match.cachet.toLocaleString()} cachet</span>
                        </div>
                      )}
                      {match.tipo === 'venue' && match.capacity && (
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <Users className="h-4 w-4 text-cyan-500" />
                          <span>{match.capacity} cap</span>
                        </div>
                      )}
                    </div>

                    {/* Match Reason */}
                    <div className="bg-slate-800/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-300 leading-relaxed">
                        <span className="text-cyan-400 font-semibold">Motivo match: </span>
                        {match.matchReason}
                      </p>
                    </div>

                    {/* Match Score Bar */}
                    <div className="mb-4">
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getMatchScoreColor(match.matchScore)}`}
                          style={{ width: `${match.matchScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-cyan-500 text-cyan-500 hover:bg-cyan-900/30"
                        onClick={() => console.log('View profile:', match.id)}
                      >
                        Visualizza Profilo
                      </Button>
                      <Button 
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
                        onClick={() => console.log('Contact:', match.id)}
                      >
                        {match.tipo === 'venue' ? 'Richiedi Collaborazione' : 'Proponi Collaborazione'}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
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
    </div>
  );
};

export default ProfessionalMatchingDashboard;
