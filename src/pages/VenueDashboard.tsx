import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, X, LogOut, Building2, Music, TrendingUp, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Mock data per artisti suggeriti
const mockArtistMatches = [
  {
    id: '1',
    nome: 'The Rockers',
    genere: 'Rock, Alternative',
    città: 'Milano',
    cachet: 2500,
    rating: 4.8,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=rockers',
    matchScore: 92,
    fanbase: 15000
  },
  {
    id: '2',
    nome: 'Jazz Fusion Band',
    genere: 'Jazz, Fusion',
    città: 'Roma',
    cachet: 1800,
    rating: 4.6,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=jazzfusion',
    matchScore: 88,
    fanbase: 8000
  },
  {
    id: '3',
    nome: 'Electronic Dreams',
    genere: 'Electronic, House',
    città: 'Milano',
    cachet: 3000,
    rating: 4.7,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=electronic',
    matchScore: 85,
    fanbase: 22000
  },
  {
    id: '4',
    nome: 'Pop Stars Collective',
    genere: 'Pop, Indie',
    città: 'Torino',
    cachet: 2200,
    rating: 4.5,
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=popstars',
    matchScore: 81,
    fanbase: 12000
  }
];

const VenueDashboard = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("match");

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

  // Sort matches
  const sortedMatches = [...mockArtistMatches].sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "fanbase") return b.fanbase - a.fanbase;
    return 0;
  });

  // Stats data
  const stats = [
    { label: "Proposte Ricevute", value: 18, icon: Music },
    { label: "Proposte Inviate", value: 5, icon: TrendingUp },
    { label: "Tasso Successo", value: "72%", icon: Star },
    { label: "Eventi Confermati", value: 12, icon: Building2 }
  ];

  // Recent activity
  const recentActivity = [
    { text: "Nuova proposta da The Rockers", time: "2 ore fa", type: "proposal" },
    { text: "Evento confermato con Jazz Fusion Band", time: "1 giorno fa", type: "confirmed" },
    { text: "Nuovo artista suggerito: Electronic Dreams", time: "2 giorni fa", type: "match" },
    { text: "Proposta accettata da Pop Stars Collective", time: "3 giorni fa", type: "accepted" }
  ];

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        {/* User Badge & Logout */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 px-4 py-2 text-sm">
              <Building2 className="h-4 w-4 mr-2" />
              Utente: Venue Test (Venue)
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

        {/* Main Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-2">🎛️ Venue Dashboard</h1>
          <p className="text-gray-400">Gestisci il tuo venue e trova gli artisti perfetti</p>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => navigate("/profilo-venue")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white h-14 text-base font-semibold"
            size="lg"
          >
            <User className="h-5 w-5 mr-2" />
            Vai al Profilo
          </Button>
          <Button
            onClick={() => navigate("/venue/dashboard/discover")}
            className="bg-purple-500 hover:bg-purple-600 text-white h-14 text-base font-semibold"
            size="lg"
          >
            <Music className="h-5 w-5 mr-2" />
            Vai alla Dashboard Matching
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="bg-[#1a1f2e] border-cyan-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="h-5 w-5 text-cyan-400" />
                  </div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-white text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Artisti Suggeriti */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-white text-2xl font-bold">Artisti Suggeriti per Te</h2>
                <p className="text-gray-400 text-sm mt-1">{sortedMatches.length} artisti trovati</p>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px] bg-[#1a1f2e] border-cyan-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1f2e] border-cyan-500/30 text-white">
                  <SelectItem value="match">Per Match Score</SelectItem>
                  <SelectItem value="rating">Per Rating</SelectItem>
                  <SelectItem value="fanbase">Per Fanbase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Artist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedMatches.map((artist) => (
                <Card key={artist.id} className="bg-[#1a1f2e] border-cyan-500/30 hover:border-cyan-500/60 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={artist.avatarUrl}
                        alt={artist.nome}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg mb-1 truncate">{artist.nome}</h3>
                        <p className="text-gray-400 text-sm mb-2">{artist.genere}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>📍 {artist.città}</span>
                          <span>⭐ {artist.rating}</span>
                        </div>
                      </div>
                      <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                        {artist.matchScore}% Match
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-400">Cachet: €{artist.cachet}</span>
                      <span className="text-gray-400">Fanbase: {artist.fanbase.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-cyan-500/30 hover:bg-cyan-500/10"
                        onClick={() => navigate(`/artist/${artist.id}`)}
                      >
                        Visualizza Profilo
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                      >
                        Invia Proposta 🎯
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar - Attività Recente */}
          <div className="lg:col-span-1">
            <Card className="bg-[#1a1f2e] border-cyan-500/30 sticky top-4">
              <CardContent className="pt-6">
                <h3 className="text-white text-lg font-bold mb-4">Attività Recente</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        activity.type === 'confirmed' ? 'bg-green-500' :
                        activity.type === 'accepted' ? 'bg-cyan-500' :
                        activity.type === 'proposal' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`} />
                      <div>
                        <p className="text-white text-sm">{activity.text}</p>
                        <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-6 border-cyan-500/30 hover:bg-cyan-500/10"
                >
                  Vedi Tutte le Attività
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDashboard;
