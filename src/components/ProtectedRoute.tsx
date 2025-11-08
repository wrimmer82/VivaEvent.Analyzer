import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Check if profile is completed
      const { data: userData } = await supabase
        .from("users")
        .select("profile_completed, user_type")
        .eq("id", session.user.id)
        .maybeSingle();

      if (userData) {
        setProfileCompleted(userData.profile_completed);
        setUserType(userData.user_type);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/accedi" replace />;
  }

  // Professionisti possono accedere alla dashboard anche senza profilo completato
  if (!profileCompleted && userType !== "professionista") {
    return <Navigate to="/profile-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
