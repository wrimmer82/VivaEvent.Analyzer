import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";
import { z } from "zod";

const professionistaSchema = z.object({
  nomeCompleto: z.string().trim().min(1, { message: "Nome completo richiesto" }).max(100),
  email: z.string()
    .trim()
    .min(1, { message: "Email richiesta" })
    .max(255, { message: "Email troppo lunga" }),
  password: z
    .string()
    .min(8, { message: "Minimo 8 caratteri" })
    .regex(/[A-Z]/, { message: "Almeno una maiuscola" })
    .regex(/[0-9]/, { message: "Almeno un numero" }),
  ruolo: z.string().min(1, { message: "Seleziona un ruolo" }),
});

interface SignupFormProfessionistaProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const ruoli = [
  "Booking Agent",
  "Music Manager",
  "Promoter",
  "Event Organizer",
  "Sound Engineer",
  "Photographer",
  "Tour Manager",
  "Altro",
];

const SignupFormProfessionista = ({ onBack, onSwitchToLogin }: SignupFormProfessionistaProps) => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    password: "",
    confirmPassword: "",
    ruolo: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const validatePassword = (password: string) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    };
  };

  const passwordValidation = validatePassword(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!acceptTerms) {
      toast({
        title: "Errore",
        description: "Devi accettare i termini di servizio",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Le password non corrispondono" });
      return;
    }

    const result = professionistaSchema.safeParse(formData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.nomeCompleto,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Errore nella creazione utente");

      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: formData.email.trim(),
        user_type: "professionista",
      });

      if (userError) throw userError;

      const { error: profError } = await supabase.from("professionisti").insert({
        user_id: authData.user.id,
        nome_completo: formData.nomeCompleto,
        email: formData.email.trim(),
        ruolo: formData.ruolo,
      });

      if (profError) throw profError;

      toast({
        title: "Registrazione completata!",
        description: "Benvenuto su VivaEvent",
        className: "bg-green-500 text-white",
      });
    } catch (error: any) {
      toast({
        title: "Errore di registrazione",
        description: error.message || "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Indietro
      </Button>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Registrati come Professionista
        </h1>
        <p className="text-muted-foreground">
          Completa il tuo profilo professionale
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nomeCompleto">Nome Completo *</Label>
          <Input
            id="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={(e) => setFormData({ ...formData, nomeCompleto: e.target.value })}
            disabled={loading}
            className={errors.nomeCompleto ? "border-red-500" : ""}
          />
          {errors.nomeCompleto && <p className="text-sm text-red-500">{errors.nomeCompleto}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={loading}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.password.length > 0 && (
            <div className="space-y-1 text-sm">
              <div className={passwordValidation.length ? "text-green-500" : "text-red-500"}>
                {passwordValidation.length ? <Check className="w-3 h-3 inline mr-1" /> : <X className="w-3 h-3 inline mr-1" />}
                Minimo 8 caratteri
              </div>
              <div className={passwordValidation.uppercase ? "text-green-500" : "text-red-500"}>
                {passwordValidation.uppercase ? <Check className="w-3 h-3 inline mr-1" /> : <X className="w-3 h-3 inline mr-1" />}
                Almeno una maiuscola
              </div>
              <div className={passwordValidation.number ? "text-green-500" : "text-red-500"}>
                {passwordValidation.number ? <Check className="w-3 h-3 inline mr-1" /> : <X className="w-3 h-3 inline mr-1" />}
                Almeno un numero
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Conferma Password *</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              disabled={loading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {formData.confirmPassword.length > 0 && (
            <p className={passwordsMatch ? "text-sm text-green-500" : "text-sm text-red-500"}>
              {passwordsMatch ? "✓ Le password corrispondono" : "✗ Le password non corrispondono"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ruolo">Ruolo *</Label>
          <Select value={formData.ruolo} onValueChange={(value) => setFormData({ ...formData, ruolo: value })}>
            <SelectTrigger className={errors.ruolo ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleziona il tuo ruolo" />
            </SelectTrigger>
            <SelectContent>
              {ruoli.map((ruolo) => (
                <SelectItem key={ruolo} value={ruolo.toLowerCase()}>
                  {ruolo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ruolo && <p className="text-sm text-red-500">{errors.ruolo}</p>}
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm leading-tight">
            Ho letto e accetto i <span className="text-primary underline cursor-pointer">Termini di Servizio</span> *
          </label>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loading || !acceptTerms}
        >
          {loading ? "Registrazione in corso..." : "Registrati"}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          Hai già un account?{" "}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={onSwitchToLogin}
          >
            Accedi
          </button>
        </div>
      </form>
    </>
  );
};

export default SignupFormProfessionista;
