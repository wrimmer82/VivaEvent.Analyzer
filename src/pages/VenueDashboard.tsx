import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { User, LogOut, Building2, Music, TrendingUp, Star, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Venue {
  id: string;
  nome_locale: string;
  citta: string;
  capacita: number;
  avatar_url?: string;
}

interface ArtistMatch {
  id: string;
  nome: string;
  genere: string;
  città: string;
  cachet: number;
  rating: number;
  avatarUrl: string;
  matchScore: number;
  fanbase: number;
}

const VenueDashboard = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("match");
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [artistMatches, setArtistMatches] = useState<ArtistMatch[]>([]);
  const [statsData, setStatsData] = useState({
    proposteRicevute: 0,
    proposteInviate: 0,
    tassoSuccesso: "0%",
    eventiConfermati: 0
  });

  useEffect(() => {
    fetchVenueData();
  }, []);

  const fetchVenueData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/accedi");
        return;
      }

      // Fetch venue profile
      const { data: venueData, error: venueError } = await supabase
        .from("venues")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (venueError) {
        console.error("Error fetching venue:", venueError);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati del venue",
          variant: "destructive",
        });
        return;
      }

      if (venueError && venueError.code !== 'PGRST116') {
        console.error("Error fetching venue:", venueError);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati del venue",
          variant: "destructive",
        });
        return;
      }

      if (!venueData) {
        // Only redirect if venue really doesn't exist after error check
        toast({
          title: "Profilo non trovato",
          description: "Completa prima il tuo profilo venue",
        });
        navigate("/profilo-venue");
        return;
      }

      setVenue(venueData);

      // Fetch booking requests received
      const { count: proposteRicevute } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", session.user.id);

      // Fetch booking requests sent
      const { count: proposteInviate } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", session.user.id);

      // Fetch confirmed bookings
      const { count: eventiConfermati } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", session.user.id)
        .eq("status", "accepted");

      // Calculate success rate
      const totale = (proposteInviate || 0) + (proposteRicevute || 0);
      const successo = eventiConfermati || 0;
      const tassoSuccesso = totale > 0 ? Math.round((successo / totale) * 100) : 0;

      setStatsData({
        proposteRicevute: proposteRicevute || 0,
        proposteInviate: proposteInviate || 0,
        tassoSuccesso: `${tassoSuccesso}%`,
        eventiConfermati: eventiConfermati || 0
      });

      // Fetch suggested artists (mock data for now - will be replaced with real matching algorithm)
      const { data: artistsData, error: artistsError } = await supabase
        .from("artisti")
        .select("*")
        .limit(4);

      if (artistsError) {
        console.error("Error fetching artists:", artistsError);
      } else if (artistsData) {
        const formattedArtists: ArtistMatch[] = artistsData.map((artist, index) => ({
          id: artist.id,
          nome: artist.nome_completo,
          genere: artist.genere_musicale,
          città: artist.citta,
          cachet: artist.cachet_desiderato || 2000,
          rating: 4.5 + (index * 0.1),
          avatarUrl: artist.avatar_url || `https://api.dicebear.com/7.x/identicon/svg?seed=${artist.id}`,
          matchScore: 90 - (index * 3),
          fanbase: 10000 + (index * 2000)
        }));
        setArtistMatches(formattedArtists);
      }

    } catch (error) {
      console.error("Error loading dashboard:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento",
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

  // Sort matches
  const sortedMatches = [...artistMatches].sort((a, b) => {
    if (sortBy === "match") return b.matchScore - a.matchScore;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "fanbase") return b.fanbase - a.fanbase;
    return 0;
  });

  // Stats data
  const stats = [
    { label: "Proposte Ricevute", value: statsData.proposteRicevute, icon: Mail },
    { label: "Proposte Inviate", value: statsData.proposteInviate, icon: Music },
    { label: "Tasso Successo", value: statsData.tassoSuccesso, icon: Star },
    { label: "Eventi Confermati", value: statsData.eventiConfermati, icon: Building2 }
  ];

  // Recent activity
  const recentActivity = [
    { text: "Nuova proposta da The Rockers", time: "2 ore fa", type: "proposal" },
    { text: "Evento confermato con Jazz Fusion Band", time: "1 giorno fa", type: "confirmed" },
    { text: "Nuovo artista suggerito: Electronic Dreams", time: "2 giorni fa", type: "match" },
    { text: "Proposta accettata da Pop Stars Collective", time: "3 giorni fa", type: "accepted" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419]">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Avatar & Logout */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-cyan-500 cursor-pointer" onClick={() => navigate("/profilo-venue")}>
              <AvatarImage src={venue?.avatar_url} />
              <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-2xl font-bold">
                {venue?.nome_locale?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-white text-2xl font-bold">{venue?.nome_locale}</h2>
              <Badge className="bg-green-600 text-white px-3 py-1 rounded-full mt-1">VENUE</Badge>
              <p className="text-gray-400 mt-1">{venue?.citta} · Capacità {venue?.capacita} pax</p>
            </div>
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
        <div className="mb-6">
          <h1 className="text-white text-3xl font-bold mb-2">🎛️ Venue Dashboard</h1>
          <p className="text-gray-400">Gestisci il tuo venue e trova gli artisti perfetti</p>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Button
            onClick={() => navigate("/profilo-venue")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white h-12 text-base font-semibold"
          >
            <User className="h-5 w-5 mr-2" />
            Il Tuo Profilo
          </Button>
          <Button
            onClick={() => navigate("/venue/discover")}
            className="bg-cyan-500 hover:bg-cyan-600 text-white h-12 text-base font-semibold"
          >
            <Music className="h-5 w-5 mr-2" />
            Vai alla Dashboard di Matching
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
