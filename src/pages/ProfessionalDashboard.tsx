import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import StatsSidebar from "@/components/dashboard/StatsSidebar";
import { User, LogOut, ArrowRight, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Professional {
  id: string;
  nome_completo: string;
  ruolo: string;
  avatar_url?: string;
}

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        .select("*")
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
      <div className="min-h-screen bg-[#0f1419]">
        <div className="container mx-auto px-4 py-8">
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
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Avatar & Logout */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-cyan-500 cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={professional?.avatar_url} />
                <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-2xl font-bold">
                  {professional?.nome_completo?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Camera className="h-6 w-6 text-white" />
              </div>
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
            <div>
              <h2 className="text-white text-2xl font-bold">{professional?.nome_completo}</h2>
              <Badge className="bg-purple-600 text-white px-3 py-1 rounded-full mt-1">PROFESSIONISTA</Badge>
              <p className="text-gray-400 mt-1">{professional?.ruolo}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content - Center */}
          <main className="lg:col-span-9">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-white text-2xl font-bold">🎛️ Professional Dashboard</h1>
              <p className="text-gray-400 text-sm mt-1">Gestisci il tuo profilo e scopri nuove opportunità</p>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Card */}
              <Card className="bg-[#1a1f2e] border-cyan-500/30 hover:border-cyan-500/50 transition-all">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mx-auto">
                      <User className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-white text-lg font-semibold">Profilo Professionista</h3>
                      <p className="text-gray-400 text-sm">
                        Visualizza e modifica le tue informazioni professionali
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/10"
                      onClick={() => navigate("/profilo-professionista")}
                    >
                      Vai al profilo professionista
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Matching Dashboard Card */}
              <Card className="bg-[#1a1f2e] border-cyan-500/30 hover:border-cyan-500/50 transition-all">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/20 mx-auto">
                      <ArrowRight className="h-8 w-8 text-cyan-400" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-white text-lg font-semibold">Dashboard di Matching</h3>
                      <p className="text-gray-400 text-sm">
                        Scopri opportunità e connettiti con artisti e venue
                      </p>
                    </div>
                    <Button
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                      onClick={() => navigate("/professional/dashboard/matching")}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Vai alla Dashboard di Matching
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Section */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30 mt-6">
              <CardContent className="pt-6">
                <h3 className="text-white text-lg font-semibold mb-3">Benvenuto nella tua Dashboard</h3>
                <div className="text-gray-400 text-sm space-y-2">
                  <p>
                    Da qui puoi gestire il tuo profilo professionale e accedere alla dashboard di matching 
                    per trovare nuove opportunità nel mondo della musica live.
                  </p>
                  <p>
                    Come professionista, hai accesso a strumenti avanzati per connetterti con artisti 
                    e venue, gestire prenotazioni e ampliare la tua rete di contatti.
                  </p>
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Stats Sidebar - Right */}
          <aside className="hidden lg:block lg:col-span-3">
            <StatsSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;
