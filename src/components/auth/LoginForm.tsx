import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const loginSchema = z.object({
  email: z.string().trim().email({ message: "Email non valida" }),
  password: z.string().min(1, { message: "Password richiesta" }),
});

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onBackToHome: () => void;
}

const LoginForm = ({ onSwitchToSignup, onBackToHome }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { toast } = useToast();

  const validateEmail = (value: string) => {
    const result = z.string().email().safeParse(value);
    if (!result.success && value.length > 0) {
      setEmailError("Email non valida");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const result = loginSchema.safeParse({ email, password });

      if (!result.success) {
        setLoginError(result.error.errors[0].message);
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        // Handle specific error types
        if (error.message.includes("Email not confirmed")) {
          setLoginError(
            "📧 Devi confermare la tua email prima di accedere. Controlla la tua casella di posta per il link di conferma."
          );
        } else if (error.message.includes("Invalid login credentials")) {
          setLoginError("Email o password incorretta");
        } else {
          setLoginError(error.message || "Si è verificato un errore durante l'accesso");
        }
        setLoading(false);
      } else {
        toast({
          title: "Accesso riuscito!",
          description: "Benvenuto su VivaEvent",
          className: "bg-green-500 text-white",
        });
        // Keep loading true - redirect will happen via Auth.tsx onAuthStateChange
      }
    } catch (error) {
      setLoginError("Si è verificato un errore. Riprova.");
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);

    try {
      const emailValidation = z.string().email().safeParse(resetEmail);
      if (!emailValidation.success) {
        toast({
          title: "Email non valida",
          description: "Inserisci un indirizzo email valido",
          variant: "destructive",
        });
        setResetLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/accedi`,
      });

      if (error) {
        toast({
          title: "Errore",
          description: error.message || "Si è verificato un errore",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email inviata!",
          description: "Controlla la tua casella di posta per il link di reset password",
          className: "bg-green-500 text-white",
        });
        setResetPasswordOpen(false);
        setResetEmail("");
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/accedi`,
        },
      });

      if (error) {
        toast({
          title: "Errore",
          description: error.message || "Errore durante l'accesso con Google",
          variant: "destructive",
        });
        setGoogleLoading(false);
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova.",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Login</h1>
        <p className="text-muted-foreground">
          Accedi al tuo account VivaEvent
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="tue-email@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
              setLoginError("");
            }}
            disabled={loading}
            className={emailError ? "border-red-500" : ""}
          />
          {emailError && (
            <p className="text-sm text-red-500">{emailError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setLoginError("");
              }}
              disabled={loading}
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

        {loginError && (
          <div className="p-3 bg-red-500/10 border border-red-500 rounded-md">
            <p className="text-sm text-red-500">{loginError}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Ricordami
            </label>
          </div>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            onClick={() => setResetPasswordOpen(true)}
          >
            Password dimenticata?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loading || googleLoading}
        >
          {loading ? "Accesso in corso..." : "Accedi"}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">oppure</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          <GoogleIcon />
          {googleLoading ? "Connessione in corso..." : "Continua con Google"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Non hai un account?{" "}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={onSwitchToSignup}
          >
            Iscriviti
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Button
          variant="link"
          onClick={onBackToHome}
          className="text-muted-foreground"
        >
          Torna alla home
        </Button>
      </div>

      {/* Password Reset Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recupera Password</DialogTitle>
            <DialogDescription>
              Inserisci la tua email per ricevere un link di reset password
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="tue-email@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                disabled={resetLoading}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setResetPasswordOpen(false);
                  setResetEmail("");
                }}
                disabled={resetLoading}
                className="flex-1"
              >
                Annulla
              </Button>
              <Button
                type="submit"
                disabled={resetLoading}
                className="flex-1"
              >
                {resetLoading ? "Invio in corso..." : "Invia Link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginForm;
