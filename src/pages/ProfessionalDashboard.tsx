import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsSidebar from "@/components/dashboard/StatsSidebar";
import { User, LogOut, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <div className="container mx-auto px-4 py-8">
        {/* User Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 px-4 py-2 text-sm">
              <User className="h-4 w-4 mr-2" />
              Utente: Professional (Professionista)
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
