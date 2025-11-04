import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MatchCard, { MatchCardProps } from "@/components/dashboard/MatchCard";
import FilterSidebar from "@/components/dashboard/FilterSidebar";
import StatsSidebar from "@/components/dashboard/StatsSidebar";

const mockMatches: MatchCardProps[] = [
  {
    id: '1',
    nome: 'The Midnight Stars',
    tipo: 'artista',
    genere: 'Rock Alternativo',
    città: 'Milano',
    cachet: 1500,
    rating: 4.5,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=midnight',
    matchScore: 87
  },
  {
    id: '2',
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
    id: '3',
    nome: 'Luna Jazz Quartet',
    tipo: 'artista',
    genere: 'Jazz Fusion',
    città: 'Bologna',
    cachet: 800,
    rating: 4.2,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luna',
    matchScore: 78
  },
  {
    id: '4',
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
    id: '5',
    nome: 'Electric Dreams',
    tipo: 'artista',
    genere: 'Electronic, House',
    città: 'Roma',
    cachet: 2000,
    rating: 4.7,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=electric',
    matchScore: 73
  },
  {
    id: '6',
    nome: 'Ritmo Latino Club',
    tipo: 'venue',
    genere: 'Reggaeton, Salsa',
    città: 'Napoli',
    capacity: 300,
    rating: 4.3,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=ritmo',
    matchScore: 65
  }
];

const Dashboard = () => {
  const [sortBy, setSortBy] = useState("match");

  const sortedMatches = [...mockMatches].sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0; // "recent" - keep original order
  });

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filter Sidebar - Left */}
          <aside className="hidden lg:block lg:col-span-2">
            <FilterSidebar />
          </aside>

          {/* Main Content - Center */}
          <main className="lg:col-span-7">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h1 className="text-white text-2xl font-bold">Match Suggeriti per Te</h1>
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

            {/* Match Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sortedMatches.map((match) => (
                <MatchCard key={match.id} {...match} />
              ))}
            </div>
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
