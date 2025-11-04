import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";
import { z } from "zod";

const artistSchema = z.object({
  nomeCompleto: z.string().trim().min(1, { message: "Nome completo richiesto" }).max(100),
  email: z.string()
    .trim()
    .min(1, { message: "Email richiesta" })
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Email non valida" })
    .max(255, { message: "Email troppo lunga" }),
  password: z
    .string()
    .min(8, { message: "Minimo 8 caratteri" })
    .regex(/[A-Z]/, { message: "Almeno una maiuscola" })
    .regex(/[0-9]/, { message: "Almeno un numero" }),
  genere: z.string().min(1, { message: "Seleziona un genere" }),
  citta: z.string().trim().min(1, { message: "Città richiesta" }),
});

interface SignupFormArtistaProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const generi = [
  "Rock", "Pop", "Jazz", "Reggae", "Hip Hop", "Electronic",
  "Classical", "Metal", "Funk", "Blues", "Soul", "Altro"
];

const SignupFormArtista = ({ onBack, onSwitchToLogin }: SignupFormArtistaProps) => {
  const [formData, setFormData] = useState({
    nomeCompleto: "",
    email: "",
    password: "",
    confirmPassword: "",
    genere: "",
    citta: "",
  });
  const [cachet, setCachet] = useState([500]);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptCommunications, setAcceptCommunications] = useState(true);
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

    const result = artistSchema.safeParse(formData);
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
      // Sign up with Supabase Auth
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

      // Insert into users table
      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: formData.email.trim(),
        user_type: "artista",
      });

      if (userError) throw userError;

      // Insert into artisti table
      const { error: artistaError } = await supabase.from("artisti").insert({
        user_id: authData.user.id,
        nome_completo: formData.nomeCompleto,
        email: formData.email.trim(),
        genere_musicale: formData.genere,
        citta: formData.citta,
        cachet_desiderato: cachet[0],
      });

      if (artistaError) throw artistaError;

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
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Indietro
      </Button>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Registrati come Artista
        </h1>
        <p className="text-muted-foreground">
          Completa il tuo profilo per iniziare
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
              className={errors.confirmPassword ? "border-red-500" : ""}
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
          {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="genere">Genere Musicale Principale *</Label>
          <Select value={formData.genere} onValueChange={(value) => setFormData({ ...formData, genere: value })}>
            <SelectTrigger className={errors.genere ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleziona un genere" />
            </SelectTrigger>
            <SelectContent>
              {generi.map((genere) => (
                <SelectItem key={genere} value={genere.toLowerCase()}>
                  {genere}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.genere && <p className="text-sm text-red-500">{errors.genere}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="citta">Città *</Label>
          <Input
            id="citta"
            value={formData.citta}
            onChange={(e) => setFormData({ ...formData, citta: e.target.value })}
            disabled={loading}
            placeholder="Es. Milano, Roma, Napoli..."
            className={errors.citta ? "border-red-500" : ""}
          />
          {errors.citta && <p className="text-sm text-red-500">{errors.citta}</p>}
        </div>

        <div className="space-y-2">
          <Label>Cachet Desiderato: €{cachet[0]}</Label>
          <Slider
            value={cachet}
            onValueChange={setCachet}
            min={100}
            max={2000}
            step={50}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">€100 - €2000</p>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <label htmlFor="terms" className="text-sm leading-tight">
              Ho letto e accetto i <span className="text-primary underline cursor-pointer">Termini di Servizio</span> *
            </label>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="communications"
              checked={acceptCommunications}
              onCheckedChange={(checked) => setAcceptCommunications(checked as boolean)}
            />
            <label htmlFor="communications" className="text-sm leading-tight text-muted-foreground">
              Accetto di ricevere comunicazioni su proposte di booking
            </label>
          </div>
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

export default SignupFormArtista;
