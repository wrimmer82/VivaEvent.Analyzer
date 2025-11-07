import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Music2 } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import SignupStepOne from "@/components/auth/SignupStepOne";
import SignupFormArtista from "@/components/auth/SignupFormArtista";
import SignupFormVenue from "@/components/auth/SignupFormVenue";
import SignupFormProfessionista from "@/components/auth/SignupFormProfessionista";

type UserType = "artista" | "venue" | "professionista" | null;

const Auth = () => {
  const [searchParams] = useSearchParams();
  const tipoFromUrl = searchParams.get("tipo") as UserType;
  
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState<1 | 2>(tipoFromUrl ? 2 : 1);
  const [selectedUserType, setSelectedUserType] = useState<UserType>(tipoFromUrl);
  const navigate = useNavigate();

  // Auto-switch to signup if tipo param is present
  useEffect(() => {
    if (tipoFromUrl) {
      setIsLogin(false);
      setSignupStep(2);
      setSelectedUserType(tipoFromUrl);
    }
  }, [tipoFromUrl]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Check profile completion status
        const { data: userData } = await supabase
          .from("users")
          .select("user_type, profile_completed")
          .eq("id", session.user.id)
          .maybeSingle();

        if (userData) {
          redirectBasedOnProfile(userData.user_type, userData.profile_completed);
        }
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session && event === "SIGNED_IN") {
          const { data: userData } = await supabase
            .from("users")
            .select("user_type, profile_completed")
            .eq("id", session.user.id)
            .maybeSingle();

          if (userData) {
            redirectBasedOnProfile(userData.user_type, userData.profile_completed);
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const redirectBasedOnProfile = (userType: string, profileCompleted: boolean) => {
    if (!profileCompleted) {
      // Redirect to profile creation
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
    } else {
      // Redirect based on user type
      switch (userType) {
        case "venue":
          navigate("/venue-dashboard");
          break;
        case "artista":
        case "professionista":
        default:
          navigate("/profile-dashboard");
          break;
      }
    }
  };

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    setSignupStep(2);
  };

  const handleBackToStepOne = () => {
    setSignupStep(1);
    setSelectedUserType(null);
  };

  const handleSwitchToSignup = () => {
    setIsLogin(false);
    setSignupStep(1);
    setSelectedUserType(null);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setSignupStep(1);
    setSelectedUserType(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent">
              <Music2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">VivaEvent</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          {isLogin ? (
            <LoginForm
              onSwitchToSignup={handleSwitchToSignup}
              onBackToHome={() => navigate("/")}
            />
          ) : (
            <>
              {signupStep === 1 ? (
                <SignupStepOne
                  onUserTypeSelect={handleUserTypeSelect}
                  onSwitchToLogin={handleSwitchToLogin}
                />
              ) : (
                <>
                  {selectedUserType === "artista" && (
                    <SignupFormArtista
                      onBack={handleBackToStepOne}
                      onSwitchToLogin={handleSwitchToLogin}
                    />
                  )}
                  {selectedUserType === "venue" && (
                    <SignupFormVenue
                      onBack={handleBackToStepOne}
                      onSwitchToLogin={handleSwitchToLogin}
                    />
                  )}
                  {selectedUserType === "professionista" && (
                    <SignupFormProfessionista
                      onBack={handleBackToStepOne}
                      onSwitchToLogin={handleSwitchToLogin}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
