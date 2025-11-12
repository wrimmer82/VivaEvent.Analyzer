import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  MapPin,
  Music,
  Building2,
  Briefcase,
  Star,
  Calendar,
  TrendingUp,
  LogOut,
  ArrowRight,
  Camera,
  UserCircle,
} from "lucide-react";

interface UserProfile {
  email: string;
  user_type: string;
  profile_completed: boolean;
}

interface ProfileDetails {
  nome_completo?: string;
  nome_locale?: string;
  citta?: string;
  genere_musicale?: string;
  generi_preferiti?: string[];
  ruolo?: string;
  capacita?: number;
  avatar_url?: string;
}

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statsData, setStatsData] = useState({
    proposteRicevute: 0,
    proposteInviate: 0,
    tassoSuccesso: "0%",
    eventiConfermati: 0
  });

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/accedi");
        return;
      }

      // Get user profile
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("email, user_type, profile_completed")
        .eq("id", session.user.id)
        .maybeSingle();

      if (userError) throw userError;

      if (!userData) {
        navigate("/accedi");
        return;
      }

      setUserProfile(userData);
      setUserId(session.user.id);

      // Redirect if profile not completed
      if (!userData.profile_completed) {
        redirectToProfileCreation(userData.user_type);
        return;
      }

      // Load specific profile details based on user type
      await loadProfileDetails(session.user.id, userData.user_type);
      
      // Load statistics
      await loadStatistics(session.user.id);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il profilo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadProfileDetails = async (userId: string, userType: string) => {
    try {
      switch (userType) {
        case "artista": {
          const { data } = await supabase
            .from("artisti")
            .select("nome_completo, citta, genere_musicale, avatar_url")
            .eq("user_id", userId)
            .maybeSingle();
          if (data) setProfileDetails(data);
          break;
        }
        case "venue": {
          const { data } = await supabase
            .from("venues")
            .select("nome_locale, citta, generi_preferiti, capacita, avatar_url")
            .eq("user_id", userId)
            .maybeSingle();
          if (data) setProfileDetails(data);
          break;
        }
        case "professionista": {
          const { data } = await supabase
            .from("professionisti")
            .select("nome_completo, ruolo, avatar_url")
            .eq("user_id", userId)
            .maybeSingle();
          if (data) setProfileDetails(data);
          break;
        }
      }
    } catch (error) {
      console.error("Error loading profile details:", error);
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

  const redirectToProfileCreation = (userType: string) => {
    switch (userType) {
      case "artista":
        navigate("/crea-profilo");
        break;
      case "venue":
        navigate("/profilo-venue");
        break;
      case "professionista":
        navigate("/profilo-professionista");
        break;
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

  const getUserTypeIcon = () => {
    switch (userProfile?.user_type) {
      case "artista":
        return <Music className="h-5 w-5" />;
      case "venue":
        return <Building2 className="h-5 w-5" />;
      case "professionista":
        return <Briefcase className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getUserTypeLabel = () => {
    switch (userProfile?.user_type) {
      case "artista":
        return "Artista";
      case "venue":
        return "Venue";
      case "professionista":
        return "Professionista";
      default:
        return "Utente";
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        return;
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile in database
      const tableName = userProfile?.user_type === 'artista' ? 'artisti' 
        : userProfile?.user_type === 'venue' ? 'venues' 
        : 'professionisti';

      const { error: updateError } = await supabase
        .from(tableName)
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Update local state
      setProfileDetails(prev => prev ? { ...prev, avatar_url: publicUrl } : null);

      toast({
        title: "Avatar aggiornato",
        description: "La tua immagine profilo è stata aggiornata con successo",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare l'immagine",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const goToProfile = () => {
    redirectToProfileCreation(userProfile?.user_type || '');
  };

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
            onClick={goToProfile} 
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
                  <AvatarImage src={profileDetails?.avatar_url || ""} />
                  <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-3xl">
                    {profileDetails?.nome_completo?.[0] || 
                     profileDetails?.nome_locale?.[0] || 
                     userProfile?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={handleAvatarClick}
                  disabled={uploading}
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
                  disabled={uploading}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-white text-3xl font-bold mb-2">
                  {profileDetails?.nome_completo || profileDetails?.nome_locale || "Profilo Utente"}
                </h1>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge className="bg-cyan-500/20 text-cyan-400 gap-2">
                    {getUserTypeIcon()}
                    {getUserTypeLabel()}
                  </Badge>
                  {profileDetails?.citta && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 gap-2">
                      <MapPin className="h-4 w-4" />
                      {profileDetails.citta}
                    </Badge>
                  )}
                  {(profileDetails?.genere_musicale || profileDetails?.generi_preferiti) && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 gap-2">
                      <Music className="h-4 w-4" />
                      {profileDetails?.genere_musicale || profileDetails?.generi_preferiti?.join(", ")}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-400 justify-center md:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{userProfile?.email}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white gap-2"
                onClick={() => navigate("/dashboard")}
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
              <Calendar className="h-4 w-4 text-purple-400" />
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
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{statsData.eventiConfermati}</div>
              <p className="text-xs text-gray-500 mt-1">Quest'anno</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-[#1a1f2e] border-cyan-500/30">
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
                    <p className="text-gray-400 text-sm">Club Alcatraz - Milano</p>
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
                    <p className="text-white font-medium">Booking confermato</p>
                    <p className="text-gray-400 text-sm">Blue Note - 15 Dicembre 2025</p>
                  </div>
                </div>
                <Badge className="bg-green-500/20 text-green-400">Confermato</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileDashboard;
