import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Building2, Users, Music, Euro, Calendar, MapPin, ExternalLink, LogOut, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";

const musicGenres = [
  "Rock",
  "Pop",
  "Jazz",
  "Electronic",
  "Hip Hop",
  "Metal",
  "Indie",
  "Folk",
  "Classical",
  "Blues",
  "Reggae",
  "Country",
];

const formSchema = z.object({
  venueName: z.string().min(2, "Nome venue richiesto").max(100),
  description: z.string().max(500, "Massimo 500 caratteri"),
  capacity: z.string().min(1, "Capacità richiesta"),
  address: z.string().min(5, "Indirizzo completo richiesto"),
  city: z.string().min(2, "Città richiesta"),
  budgetMin: z.string().min(1, "Budget minimo richiesto"),
  budgetMax: z.string().min(1, "Budget massimo richiesto"),
  genres: z.array(z.string()).min(1, "Seleziona almeno un genere").max(3, "Seleziona massimo 3 generi"),
  availableDates: z.string().optional(),
  email: z.string().email("Email non valida"),
  phone: z.string(),
  website: z.string().optional(),
});

const VenueProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [googleMapsLink, setGoogleMapsLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [venueId, setVenueId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      venueName: "",
      description: "",
      capacity: "",
      address: "",
      city: "",
      budgetMin: "",
      budgetMax: "",
      genres: [],
      availableDates: "",
      email: "",
      phone: "",
      website: "",
    },
  });

  const venueName = form.watch("venueName");

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

      const { data: venueData, error: venueError } = await supabase
        .from("venues")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (venueError) {
        console.error("Error loading venue profile:", venueError);
      }

      if (venueData) {
        setVenueId(venueData.id);
        form.reset({
          venueName: venueData.nome_locale || "",
          description: "",
          capacity: venueData.capacita?.toString() || "",
          address: venueData.indirizzo || "",
          city: venueData.citta || "",
          budgetMin: "",
          budgetMax: venueData.budget_medio?.toString() || "",
          genres: venueData.generi_preferiti || [],
          availableDates: "",
          email: venueData.email || "",
          phone: "",
          website: "",
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!userId) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per salvare il profilo",
          variant: "destructive",
        });
        return;
      }

      const venueData = {
        user_id: userId,
        nome_locale: values.venueName,
        email: values.email,
        indirizzo: values.address,
        citta: values.city,
        capacita: parseInt(values.capacity),
        budget_medio: parseInt(values.budgetMax),
        generi_preferiti: values.genres,
      };

      if (venueId) {
        // Update existing venue
        const { error } = await supabase
          .from("venues")
          .update(venueData)
          .eq("id", venueId);

        if (error) throw error;
      } else {
        // Insert new venue
        const { error } = await supabase
          .from("venues")
          .insert([venueData]);

        if (error) throw error;
      }

      toast({
        title: "Profilo venue salvato con successo! 🎉",
        description: "Reindirizzamento alla dashboard...",
      });

      // Redirect to venue dashboard after 1 second
      setTimeout(() => {
        navigate("/venue-dashboard");
      }, 1000);
    } catch (error) {
      console.error("Error saving venue profile:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del profilo",
        variant: "destructive",
      });
    }
  };

  // Generate Google Maps link from address
  const generateGoogleMapsLink = () => {
    const address = form.getValues("address");
    const city = form.getValues("city");
    if (address && city) {
      const fullAddress = `${address}, ${city}`;
      const encodedAddress = encodeURIComponent(fullAddress);
      const link = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
      setGoogleMapsLink(link);
    }
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
      <Navbar />
      
      {/* Header with greeting and logout */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex-1"></div>
          {userId && venueName && (
            <div className="flex items-center gap-4">
              <span className="text-foreground text-lg">
                Ciao, <Link to="/profile-dashboard" className="font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">{venueName}</Link>!
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
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Torna alla Home
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Crea il Tuo Profilo Venue
            </h1>
            <p className="text-xl text-muted-foreground">
              Imposta le tue preferenze e inizia a trovare artisti perfetti per il tuo locale
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Informazioni Base */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-accent" />
                    Informazioni Venue
                  </CardTitle>
                  <CardDescription>Dettagli generali del locale</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="venueName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Venue</FormLabel>
                        <FormControl>
                          <Input placeholder="Es. Live Music Club" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrizione</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descrivi il tuo venue, l'atmosfera, i servizi..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="venue@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefono</FormLabel>
                          <FormControl>
                            <Input placeholder="+39 123 456 7890" {...field} />
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
                          <FormLabel>Sito Web (opzionale)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Capacità */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Capacità Venue
                  </CardTitle>
                  <CardDescription>Numero massimo di persone ospitabili</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacità Massima</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Es. 200" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Inserisci il numero massimo di persone che può contenere il venue
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Generi Musicali */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-accent" />
                    Generi Musicali Preferiti
                  </CardTitle>
                  <CardDescription>Seleziona i generi che ospiti più frequentemente</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="genres"
                    render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {musicGenres.map((genre) => (
                            <FormField
                              key={genre}
                              control={form.control}
                              name="genres"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={genre}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(genre)}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            // Check if already at max (3)
                                            if (field.value.length >= 3) {
                                              toast({
                                                title: "Limite raggiunto",
                                                description: "Puoi selezionare massimo 3 generi musicali",
                                                variant: "destructive",
                                              });
                                              return;
                                            }
                                            field.onChange([...field.value, genre]);
                                          } else {
                                            field.onChange(
                                              field.value?.filter(
                                                (value) => value !== genre
                                              )
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal cursor-pointer">
                                      {genre}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Budget Show */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-accent" />
                    Budget per Show
                  </CardTitle>
                  <CardDescription>Range di budget disponibile per gli artisti</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budgetMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Minimo (€)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="500" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="budgetMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Massimo (€)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="3000" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Posizione e Google Maps */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    Posizione Venue
                  </CardTitle>
                  <CardDescription>Indirizzo completo del locale</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Indirizzo</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Via Roma, 123" 
                            {...field}
                            onBlur={() => {
                              field.onBlur();
                              generateGoogleMapsLink();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Città</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Milano" 
                            {...field}
                            onBlur={() => {
                              field.onBlur();
                              generateGoogleMapsLink();
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {googleMapsLink && (
                    <div className="pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => window.open(googleMapsLink, "_blank")}
                        className="w-full"
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Visualizza su Google Maps
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Calendario Eventi */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-accent" />
                    Disponibilità Eventi
                  </CardTitle>
                  <CardDescription>Indica le date in cui sei disponibile per ospitare eventi</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="availableDates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date Disponibili</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Es. Venerdì e Sabato sera, Tutti i giorni dal 15/01 al 31/01..."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Descrivi quando il tuo venue è disponibile per ospitare concerti
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center pt-6">
                <Button type="submit" size="lg" className="w-full md:w-auto px-12">
                  Salva Profilo Venue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VenueProfile;
