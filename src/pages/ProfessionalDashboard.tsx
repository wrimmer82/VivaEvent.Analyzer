import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import BookingsTable from "@/components/dashboard/BookingsTable";
import { 
  LogOut,
  ArrowRight, 
  Camera, 
  Briefcase, 
  Mail,
  TrendingUp,
  Calendar,
  Star,
  CheckCircle,
  UserCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import MatrixRain from "@/components/MatrixRain";
import { CalendarView } from "@/components/dashboard/CalendarView";

interface Professional {
  id: string;
  nome_completo: string;
  ruolo: string;
  avatar_url?: string;
  email?: string;
}

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statsData, setStatsData] = useState({
    proposteRicevute: 0,
    proposteInviate: 0,
    tassoSuccesso: "0%",
    eventiConfermati: 0
  });

  useEffect(() => {
    fetchProfessionalData();
  }, []);

  const fetchProfessionalData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/accedi");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("profile_completed")
        .eq("id", session.user.id)
        .maybeSingle();

      const { data: professionalData, error: professionalError } = await supabase
        .from("professionisti")
        .select("id, nome_completo, ruolo, avatar_url, email")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (professionalError && professionalError.code !== 'PGRST116') {
        console.error("Error fetching professional:", professionalError);
        toast({
          title: "Errore",
          description: "Impossibile caricare i dati del professionista",
          variant: "destructive",
        });
        return;
      }

      if (!professionalData && !userData?.profile_completed) {
        toast({
          title: "Profilo non trovato",
          description: "Completa prima il tuo profilo professionista",
        });
        navigate("/profilo-professionista");
        return;
      }

      setProfessional(professionalData);

      // Load statistics
      await loadStatistics(session.user.id);

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

  const loadStatistics = async (userId: string) => {
    try {
      // Fetch booking requests received
      const { count: proposteRicevute } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", userId);

      // Fetch booking requests sent
      const { count: proposteInviate } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", userId);

      // Fetch confirmed bookings (both sent and received)
      const { count: eventiConfermatiRicevuti } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", userId)
        .eq("status", "accepted");

      const { count: eventiConfermatiInviati } = await supabase
        .from("booking_requests")
        .select("*", { count: "exact", head: true })
        .eq("sender_id", userId)
        .eq("status", "accepted");

      const eventiConfermati = (eventiConfermatiRicevuti || 0) + (eventiConfermatiInviati || 0);

      // Calculate success rate
      const totale = (proposteInviate || 0) + (proposteRicevute || 0);
      const tassoSuccesso = totale > 0 ? Math.round((eventiConfermati / totale) * 100) : 0;

      setStatsData({
        proposteRicevute: proposteRicevute || 0,
        proposteInviate: proposteInviate || 0,
        tassoSuccesso: `${tassoSuccesso}%`,
        eventiConfermati: eventiConfermati
      });
    } catch (error) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !professional?.id) return;

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
        .from('professionisti')
        .update({ avatar_url: publicUrl })
        .eq('id', professional.id);

      if (updateError) throw updateError;

      setProfessional({ ...professional, avatar_url: publicUrl });
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

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0f1419] overflow-hidden">
        <MatrixRain />
        <div className="relative z-10 container mx-auto px-4 py-8">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-32 w-full mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#0f1419] overflow-hidden">
      {/* Matrix Rain Effect */}
      <MatrixRain />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Profile and Logout */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => navigate("/profilo-professionista")} 
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
                  <AvatarImage src={professional?.avatar_url || ""} />
                  <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-3xl">
                    {professional?.nome_completo?.[0]?.toUpperCase() || "P"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  disabled={avatarUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                  aria-label="Cambia avatar"
                >
                  {avatarUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
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
                  {professional?.nome_completo || "Professionista"}
                </h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge className="bg-cyan-500/20 text-cyan-400 gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professionista
                  </Badge>
                  {professional?.ruolo && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 gap-2">
                      <Star className="h-4 w-4" />
                      {professional.ruolo}
                    </Badge>
                  )}
                </div>
                {professional?.email && (
                  <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{professional.email}</span>
                  </div>
                )}
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2"
                onClick={() => navigate("/professional/dashboard/matching")}
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
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2e] border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Proposte Inviate
              </CardTitle>
              <Calendar className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{statsData.proposteInviate}</div>
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
            </CardContent>
          </Card>

          <Card className="bg-[#1a1f2e] border-cyan-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Eventi Confermati
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{statsData.eventiConfermati}</div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Table */}
        <BookingsTable />

        {/* Calendario Eventi */}
        <div className="mt-8">
          <CalendarView userType="professionista" />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
