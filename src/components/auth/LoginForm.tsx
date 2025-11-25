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
          disabled={loading}
        >
          {loading ? "Accesso in corso..." : "Accedi"}
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
