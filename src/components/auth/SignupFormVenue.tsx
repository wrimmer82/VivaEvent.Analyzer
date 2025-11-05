import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";
import { z } from "zod";

const venueSchema = z.object({
  nomeLocale: z.string().trim().min(1, { message: "Nome locale richiesto" }).max(100),
  email: z.string()
    .trim()
    .min(1, { message: "Email richiesta" })
    .max(255, { message: "Email troppo lunga" }),
  password: z
    .string()
    .min(8, { message: "Minimo 8 caratteri" })
    .regex(/[A-Z]/, { message: "Almeno una maiuscola" })
    .regex(/[0-9]/, { message: "Almeno un numero" }),
  indirizzo: z.string().trim().min(1, { message: "Indirizzo richiesto" }),
  citta: z.string().trim().min(1, { message: "Città richiesta" }),
  capacita: z.number().min(50, { message: "Capacità minima 50" }).max(5000),
});

interface SignupFormVenueProps {
  onBack: () => void;
  onSwitchToLogin: () => void;
}

const generi = [
  "Rock", "Pop", "Jazz", "Reggae", "Hip Hop", "Electronic",
  "Classical", "Metal", "Funk", "Blues", "Soul", "Altro"
];

const SignupFormVenue = ({ onBack, onSwitchToLogin }: SignupFormVenueProps) => {
  const [formData, setFormData] = useState({
    nomeLocale: "",
    email: "",
    password: "",
    confirmPassword: "",
    indirizzo: "",
    citta: "",
    capacita: "100",
  });
  const [budget, setBudget] = useState([1000]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
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

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      toast({
        title: "Limite raggiunto",
        description: "Puoi selezionare massimo 3 generi",
        variant: "destructive",
      });
    }
  };

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

    if (selectedGenres.length === 0) {
      toast({
        title: "Errore",
        description: "Seleziona almeno un genere musicale",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Le password non corrispondono" });
      return;
    }

    const result = venueSchema.safeParse({
      ...formData,
      capacita: parseInt(formData.capacita),
    });

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
            full_name: formData.nomeLocale,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Errore nella creazione utente");

      const { error: userError } = await supabase.from("users").insert({
        id: authData.user.id,
        email: formData.email.trim(),
        user_type: "venue",
      });

      if (userError) throw userError;

      const { error: venueError } = await supabase.from("venues").insert({
        user_id: authData.user.id,
        nome_locale: formData.nomeLocale,
        email: formData.email.trim(),
        indirizzo: formData.indirizzo,
        citta: formData.citta,
        capacita: parseInt(formData.capacita),
        generi_preferiti: selectedGenres,
        budget_medio: budget[0],
      });

      if (venueError) throw venueError;

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
          Registrati come Venue
        </h1>
        <p className="text-muted-foreground">
          Completa il profilo del tuo locale
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nomeLocale">Nome Locale *</Label>
          <Input
            id="nomeLocale"
            value={formData.nomeLocale}
            onChange={(e) => setFormData({ ...formData, nomeLocale: e.target.value })}
            disabled={loading}
            className={errors.nomeLocale ? "border-red-500" : ""}
          />
          {errors.nomeLocale && <p className="text-sm text-red-500">{errors.nomeLocale}</p>}
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
          <Label htmlFor="indirizzo">Indirizzo *</Label>
          <Input
            id="indirizzo"
            value={formData.indirizzo}
            onChange={(e) => setFormData({ ...formData, indirizzo: e.target.value })}
            disabled={loading}
            className={errors.indirizzo ? "border-red-500" : ""}
          />
          {errors.indirizzo && <p className="text-sm text-red-500">{errors.indirizzo}</p>}
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
          <Label htmlFor="capacita">Capacità (persone) *</Label>
          <Input
            id="capacita"
            type="number"
            min="50"
            max="5000"
            value={formData.capacita}
            onChange={(e) => setFormData({ ...formData, capacita: e.target.value })}
            disabled={loading}
            className={errors.capacita ? "border-red-500" : ""}
          />
          {errors.capacita && <p className="text-sm text-red-500">{errors.capacita}</p>}
        </div>

        <div className="space-y-2">
          <Label>Generi Preferiti (max 3) *</Label>
          <div className="grid grid-cols-2 gap-2">
            {generi.map((genere) => (
              <div
                key={genere}
                className={`flex items-center space-x-2 p-2 border rounded cursor-pointer transition-colors ${
                  selectedGenres.includes(genere.toLowerCase())
                    ? "bg-primary/10 border-primary"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleGenre(genere.toLowerCase())}
              >
                <Checkbox
                  checked={selectedGenres.includes(genere.toLowerCase())}
                  onCheckedChange={() => toggleGenre(genere.toLowerCase())}
                  onClick={(e) => e.stopPropagation()}
                />
                <label className="text-sm cursor-pointer select-none">{genere}</label>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Selezionati: {selectedGenres.length}/3
          </p>
        </div>

        <div className="space-y-2">
          <Label>Budget Medio per Evento: €{budget[0] || 1000}</Label>
          <Slider
            value={budget}
            onValueChange={setBudget}
            min={100}
            max={5000}
            step={100}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">€100 - €5000</p>
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

export default SignupFormVenue;
