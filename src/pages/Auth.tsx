import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Music2, Eye, EyeOff } from "lucide-react";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Email non valida" }),
  password: z
    .string()
    .min(6, { message: "La password deve essere di almeno 6 caratteri" }),
  fullName: z.string().trim().optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validationData = {
        email,
        password,
        ...(isLogin ? {} : { fullName }),
      };

      const result = authSchema.safeParse(validationData);

      if (!result.success) {
        toast({
          title: "Errore di validazione",
          description: result.error.errors[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Errore di accesso",
              description: "Email o password non corretti",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Errore di accesso",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Accesso effettuato",
            description: "Benvenuto!",
          });
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast({
              title: "Errore di registrazione",
              description: "Questo account esiste già. Prova ad accedere.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Errore di registrazione",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Registrazione completata",
            description: "Controlla la tua email per confermare l'account",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        toast({
          title: "Errore",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile connettersi con Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
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
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isLogin ? "Login" : "Registrati"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Torna subito al tuo account VivaEvent."
                : "Crea il tuo account VivaEvent."}
            </p>
          </div>

          {/* Google Auth */}
          <Button
            type="button"
            variant="outline"
            className="w-full mb-6"
            onClick={handleGoogleAuth}
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continua con Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">O</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Mario Rossi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Indirizzo e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Indirizzo e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Inserisci la password</Label>
                {isLogin && (
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={() => {
                      toast({
                        title: "Reset password",
                        description: "Funzionalità disponibile a breve",
                      });
                    }}
                  >
                    Spettacolo
                  </button>
                )}
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Caricamento..." : isLogin ? "Login" : "Registrati"}
            </Button>
          </form>

          {isLogin && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                toast({
                  title: "Password dimenticata",
                  description: "Funzionalità disponibile a breve",
                });
              }}
            >
              Ha Dimenticato La Password?
            </Button>
          )}

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? (
              <>
                Non hai un account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => setIsLogin(false)}
                >
                  Organizza una demo di 15 minuti
                </button>
              </>
            ) : (
              <>
                Hai già un account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => setIsLogin(true)}
                >
                  Accedi
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            Link al sito
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
