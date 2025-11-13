import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import BookingsTable from "@/components/dashboard/BookingsTable";
import {
  Building2,
  Music,
  Star,
  Mail,
  Camera,
  UserCircle,
  LogOut,
  ArrowRight,
  Calendar,
  TrendingUp,
  CheckCircle
} from "lucide-react";

interface Venue {
  id: string;
  nome_locale: string;
  citta: string;
  capacita: number;
  avatar_url?: string;
}

const VenueDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      // Check if profile is actually completed first
      const { data: userData } = await supabase
        .from("users")
        .select("profile_completed")
        .eq("id", session.user.id)
        .maybeSingle();

      // Fetch venue profile
      const { data: venueData, error: venueError } = await supabase
        .from("venues")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (venueError && venueError.code !== 'PGRST116') {
        console.error("Error fetching venue:", venueError);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati del venue",
          variant: "destructive",
        });
        return;
      }

      // Only redirect if profile is not completed AND no venue data
      if (!venueData && !userData?.profile_completed) {
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

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !venue?.id) return;

    try {
      setAvatarUploading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('venues')
        .update({ avatar_url: publicUrl })
        .eq('id', venue.id);

      if (updateError) throw updateError;

      setVenue({ ...venue, avatar_url: publicUrl });
      toast({
        title: "Avatar aggiornato",
        description: "La tua immagine del profilo è stata aggiornata con successo",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare l'avatar",
        variant: "destructive",
      });
    } finally {
      setAvatarUploading(false);
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

  // Recent activity
  const recentActivity = [
    { 
      text: "Nuova proposta da The Rockers", 
      subtext: "Rock Band - Milano",
      type: "proposal",
      icon: Music
    },
    { 
      text: "Evento confermato con Jazz Fusion Band", 
      subtext: "15 Dicembre 2025",
      type: "confirmed",
      icon: Calendar
    },
    { 
      text: "Nuovo match trovato", 
      subtext: "Electronic Dreams - compatibilità 89%",
      type: "match",
      icon: Star
    },
    { 
      text: "Proposta accettata da Pop Stars Collective", 
      subtext: "Evento del 20 Gennaio",
      type: "accepted",
      icon: CheckCircle
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Profile and Logout */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/profilo-venue")}
            className="gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 hover:from-cyan-500/20 hover:to-blue-500/20"
          >
            <UserCircle className="h-5 w-5" />
            Il Tuo Profilo
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Profile Hero Card */}
        <Card className="bg-gradient-to-br from-[#1a1f2e] to-[#0f1419] border-cyan-500/30 mb-8">
          <CardContent className="pt-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-4 border-cyan-500/30">
                  <AvatarImage src={venue?.avatar_url || ""} />
                  <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-3xl">
                    {venue?.nome_locale?.[0] || "V"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Cambia avatar"
                >
                  <Camera className="h-8 w-8 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={avatarUploading}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-white text-3xl font-bold mb-2">
                  {venue?.nome_locale || "Venue"}
                </h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge className="bg-green-600 text-white gap-2">
                    <Building2 className="h-4 w-4" />
                    Venue
                  </Badge>
                  {venue?.citta && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 gap-2">
                      {venue.citta}
                    </Badge>
                  )}
                  {venue?.capacita && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 gap-2">
                      Capacità: {venue.capacita} pax
                    </Badge>
                  )}
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2"
                onClick={() => navigate("/venue/discover")}
              >
                Vai alla Dashboard di Matching
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-[#1a1f2e] border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Proposte Ricevute
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-cyan-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{statsData.proposteRicevute}</div>
              <p className="text-xs text-gray-500 mt-1">+12% dal mese scorso</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2e] border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Proposte Inviate
              </CardTitle>
              <Mail className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{statsData.proposteInviate}</div>
              <p className="text-xs text-gray-500 mt-1">Negli ultimi 30 giorni</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2e] border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Tasso di Successo
              </CardTitle>
              <Star className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{statsData.tassoSuccesso}</div>
              <p className="text-xs text-gray-500 mt-1">Media industria: 42%</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2e] border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Eventi Confermati
              </CardTitle>
              <Building2 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{statsData.eventiConfermati}</div>
              <p className="text-xs text-gray-500 mt-1">Quest'anno</p>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <BookingsTable />

        {/* Recent Activity */}
        <Card className="bg-[#1a1f2e] border-cyan-500/30 mt-8">
          <CardHeader>
            <CardTitle className="text-white">Attività Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg border border-cyan-500/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Music className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Nuova richiesta ricevuta</p>
                    <p className="text-gray-400 text-sm">The Zen Circus - 15 Gennaio 2025</p>
                  </div>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400">Nuovo</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Collaborazione confermata</p>
                    <p className="text-gray-400 text-sm">Negrita - 22 Dicembre 2025</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Confermato</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#0f1419] rounded-lg border border-amber-500/20">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Match suggerito</p>
                    <p className="text-gray-400 text-sm">Subsonica cerca venue Milano</p>
                  </div>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400">Suggerito</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VenueDashboard;
