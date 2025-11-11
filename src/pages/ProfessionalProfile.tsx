import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Briefcase, LogOut, Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  profession: z.string().min(2, "Inserisci la tua specializzazione"),
  bio: z.string().min(50, "La bio deve contenere almeno 50 caratteri"),
  experience: z.string().min(1, "Inserisci gli anni di esperienza"),
  hourlyRate: z.string().min(1, "Inserisci la tariffa oraria"),
  portfolio: z.string().url("Inserisci un URL valido").optional().or(z.literal("")),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),
  website: z.string().url("Inserisci un URL valido").optional().or(z.literal("")),
  skills: z.string().min(10, "Descrivi le tue competenze principali"),
  availability: z.string().min(1, "Indica la tua disponibilità"),
  location: z.string().min(2, "Inserisci la tua località"),
});

const ProfessionalProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [professionalId, setProfessionalId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      profession: "",
      bio: "",
      experience: "",
      hourlyRate: "",
      portfolio: "",
      instagram: "",
      linkedin: "",
      website: "",
      skills: "",
      availability: "",
      location: "",
    },
  });

  const professionalName = form.watch("fullName");

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate("/accedi");
        return;
      }

      setUserId(session.user.id);

      const { data: professionalData, error: professionalError } = await supabase
        .from("professionisti")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (professionalError) {
        console.error("Error loading professional profile:", professionalError);
      }

      if (professionalData) {
        setProfessionalId(professionalData.id);
        form.reset({
          fullName: professionalData.nome_completo || "",
          profession: professionalData.ruolo || "",
          bio: "",
          experience: "",
          hourlyRate: "",
          portfolio: "",
          instagram: "",
          linkedin: "",
          website: "",
          skills: "",
          availability: "",
          location: "",
        });
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il profilo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Logout effettuato",
        description: "A presto!",
      });
      navigate("/accedi");
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    toast({
      title: "Profilo Salvato!",
      description: "Il tuo profilo professionale è stato creato con successo.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground text-xl flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          Caricamento...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar logoLink="/profile-dashboard" />
      
      {/* Header with greeting and logout */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          {userId && professionalName && (
            <div className="flex items-center gap-4">
              <span className="text-foreground text-lg">
                Ciao, <Link to="/profile-dashboard" className="font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">{professionalName}</Link>!
              </span>
              <Button variant="destructive" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Crea il Tuo Profilo Professionale</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compila i dettagli per far conoscere la tua esperienza e trovare opportunità nel settore musicale
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Informazioni Base</CardTitle>
                  <CardDescription>Presentati e descrivi la tua professione</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Mario Rossi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specializzazione</FormLabel>
                        <FormControl>
                          <Input placeholder="es. Sound Engineer, Tour Manager, Lighting Designer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio Professionale</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Raccontaci la tua esperienza, i progetti principali e cosa ti distingue nel settore..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anni di Esperienza</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tariffa Oraria (€)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="50" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Località</FormLabel>
                        <FormControl>
                          <Input placeholder="Milano, Italia" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Skills & Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Competenze e Disponibilità</CardTitle>
                  <CardDescription>Dettagli sulle tue capacità e orari</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competenze Principali</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="es. Mixing analogico e digitale, Pro Tools, Ableton Live, gestione tour internazionali..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Disponibilità</FormLabel>
                        <FormControl>
                          <Input placeholder="es. Disponibile nei weekend, Full-time, Part-time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Links & Portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio e Social</CardTitle>
                  <CardDescription>Condividi i tuoi lavori e profili professionali</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="portfolio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Link Portfolio</FormLabel>
                        <FormControl>
                          <Input placeholder="https://tuoportfolio.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sito Web</FormLabel>
                        <FormControl>
                          <Input placeholder="https://tuositoweb.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="@nomeutente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="@nomeutente" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Torna alla Home
                </Button>
                <Button type="submit">Salva Profilo</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
