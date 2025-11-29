import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoginForm from "@/components/auth/LoginForm";
import SignupStepOne from "@/components/auth/SignupStepOne";
import SignupFormArtista from "@/components/auth/SignupFormArtista";
import SignupFormVenue from "@/components/auth/SignupFormVenue";
import SignupFormProfessionista from "@/components/auth/SignupFormProfessionista";
import MatrixRain from "@/components/MatrixRain";
import notaMusicale from "@/assets/nota-musicale.png";

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
      // Only check session if user is in login mode
      // Don't redirect if user is actively trying to sign up
      if (!isLogin) {
        return;
      }

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
      (event, session) => {
        if (session && event === "SIGNED_IN") {
          // Defer Supabase calls with setTimeout to prevent deadlock
          setTimeout(async () => {
            try {
              const { data: userData, error } = await supabase
                .from("users")
                .select("user_type, profile_completed")
                .eq("id", session.user.id)
                .maybeSingle();

              if (error) {
                console.error("Error fetching user data:", error);
                return;
              }

              if (userData) {
                redirectBasedOnProfile(userData.user_type, userData.profile_completed);
              } else {
                // If no userData found, redirect to home
                navigate("/");
              }
            } catch (error) {
              console.error("Error in auth state change:", error);
              navigate("/");
            }
          }, 0);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, isLogin]);

  const redirectBasedOnProfile = (userType: string, profileCompleted: boolean) => {
    // Professionisti vanno sempre alla loro dashboard
    if (userType === "professionista") {
      navigate("/professional/dashboard");
      return;
    }

    if (!profileCompleted) {
      // Redirect to profile creation
      switch (userType) {
        case "artista":
          navigate("/crea-profilo");
          break;
        case "venue":
          navigate("/profilo-venue");
          break;
      }
    } else {
      // Redirect based on user type
      switch (userType) {
        case "venue":
          navigate("/venue-dashboard");
          break;
        case "artista":
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 overflow-hidden">
      <MatrixRain />
      
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center gap-4">
            <img 
              src={notaMusicale} 
              alt="VivaEvent Logo" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
              style={{
                filter: 'drop-shadow(0 0 30px hsl(180, 100%, 50%)) drop-shadow(0 0 50px hsl(180, 100%, 50%))',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, gentle-rotate 4s ease-in-out infinite',
                mixBlendMode: 'screen'
              }}
            />
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
