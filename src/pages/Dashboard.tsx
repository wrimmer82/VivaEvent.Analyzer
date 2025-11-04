import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MatchCard, { MatchCardProps } from "@/components/dashboard/MatchCard";
import FilterSidebar from "@/components/dashboard/FilterSidebar";
import StatsSidebar from "@/components/dashboard/StatsSidebar";
import { Badge } from "@/components/ui/badge";
import { User, X } from "lucide-react";

const mockMatches: MatchCardProps[] = [
  {
    id: '1',
    nome: 'Club Alcatraz',
    tipo: 'venue',
    genere: 'Rock, Metal',
    città: 'Milano',
    capacity: 2000,
    rating: 4.8,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=alcatraz',
    matchScore: 92
  },
  {
    id: '2',
    nome: 'Live Music Hall',
    tipo: 'venue',
    genere: 'Pop, Indie',
    città: 'Torino',
    capacity: 500,
    rating: 4.6,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=livehall',
    matchScore: 81
  },
  {
    id: '3',
    nome: 'Ritmo Latino Club',
    tipo: 'venue',
    genere: 'Reggaeton, Salsa',
    città: 'Napoli',
    capacity: 300,
    rating: 4.3,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ritmo',
    matchScore: 65
  },
  {
    id: '4',
    nome: 'Blue Note Milano',
    tipo: 'venue',
    genere: 'Jazz, Blues',
    città: 'Milano',
    capacity: 400,
    rating: 4.9,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=bluenote',
    matchScore: 88
  },
  {
    id: '5',
    nome: 'Teatro Ariston',
    tipo: 'venue',
    genere: 'Rock, Pop',
    città: 'Roma',
    capacity: 1500,
    rating: 4.7,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ariston',
    matchScore: 79
  },
  {
    id: '6',
    nome: 'Magazzini Generali',
    tipo: 'venue',
    genere: 'Electronic, Techno',
    città: 'Milano',
    capacity: 800,
    rating: 4.5,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=magazzini',
    matchScore: 75
  },
  {
    id: '7',
    nome: 'Auditorium Parco della Musica',
    tipo: 'venue',
    genere: 'Rock, Jazz, Pop',
    città: 'Roma',
    capacity: 2800,
    rating: 4.9,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=auditorium',
    matchScore: 85
  },
  {
    id: '8',
    nome: 'Fabrique',
    tipo: 'venue',
    genere: 'Rock, Metal, Indie',
    città: 'Milano',
    capacity: 1600,
    rating: 4.6,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=fabrique',
    matchScore: 82
  },
  {
    id: '9',
    nome: 'Atlantico Live',
    tipo: 'venue',
    genere: 'Pop, Rock',
    città: 'Roma',
    capacity: 1100,
    rating: 4.4,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=atlantico',
    matchScore: 71
  },
  {
    id: '10',
    nome: 'Locomotiv Club',
    tipo: 'venue',
    genere: 'Rock, Indie, Electronic',
    città: 'Bologna',
    capacity: 700,
    rating: 4.5,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=locomotiv',
    matchScore: 77
  }
];

export interface FilterState {
  genres: string[];          // array di generi selezionati
  city: string;              // città selezionata
  radius: number;            // raggio in km
  budgetMin: number;         // budget minimo
  budgetMax: number;         // budget massimo
  minRating: number;         // rating minimo
  dateStart: string | null;  // data inizio
  dateEnd: string | null;    // data fine
}

const Dashboard = () => {
  const [sortBy, setSortBy] = useState("match");
  const [filters, setFilters] = useState<FilterState>({
    genres: [],
    city: 'Tutte',
    radius: 50,
    budgetMin: 0,
    budgetMax: 5000,
    minRating: 0,
    dateStart: null,
    dateEnd: null
  });

  // Apply filters function
  const applyFilters = () => {
    return mockMatches.filter((match) => {
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
      
      return genreMatch && cityMatch && budgetMatch && ratingMatch && dateMatch;
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
        <div className="mb-6 flex items-center gap-2">
          <Badge className="bg-cyan-500/20 text-cyan-400 px-4 py-2 text-sm">
            <User className="h-4 w-4 mr-2" />
            Utente: Artist Test (Artista)
          </Badge>
          <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 px-3 py-2 text-xs">
            DEMO MODE
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filter Sidebar - Left */}
          <aside className="hidden lg:block lg:col-span-2">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Main Content - Center */}
          <main className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-white text-2xl font-bold">Match Suggeriti per Te</h1>
                <p className="text-gray-400 text-sm mt-1">{sortedMatches.length} venue trovate</p>
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
            {(filters.genres.length > 0 || filters.city !== 'Tutte' || filters.budgetMin > 0 || filters.budgetMax < 5000 || filters.minRating > 0) && (
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
              </div>
            )}

            {/* Match Grid or Empty State */}
            {sortedMatches.length === 0 ? (
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
                    dateEnd: null
                  })}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Reset Filtri
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedMatches.map((match) => (
                  <MatchCard key={match.id} {...match} />
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

export default Dashboard;
