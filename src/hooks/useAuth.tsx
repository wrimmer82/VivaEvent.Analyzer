import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface UserData {
  user_type: string;
  profile_completed: boolean;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data } = await supabase
            .from("users")
            .select("user_type, profile_completed")
            .eq("id", session.user.id)
            .maybeSingle();

          setUserData(data);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data } = await supabase
            .from("users")
            .select("user_type, profile_completed")
            .eq("id", session.user.id)
            .maybeSingle();

          setUserData(data);
        } else {
          setUserData(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const redirectBasedOnProfile = () => {
    if (!user || !userData) return;

    if (!userData.profile_completed) {
      // Redirect to profile creation based on user type
      switch (userData.user_type) {
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
    } else {
      // Redirect to personal profile page
      navigate("/profile-dashboard");
    }
  };

  return {
    user,
    userData,
    loading,
    redirectBasedOnProfile,
  };
};
