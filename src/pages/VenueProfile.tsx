import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { ArrowLeft, Building2, Users, Music, Euro, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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
  genres: z.array(z.string()).min(1, "Seleziona almeno un genere"),
  availableDates: z.string().optional(),
  email: z.string().email("Email non valida"),
  phone: z.string().min(10, "Numero di telefono richiesto"),
  website: z.string().optional(),
});

const VenueProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [googleMapsLink, setGoogleMapsLink] = useState("");

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    
    toast({
      title: "Profilo Venue Creato! 🎪",
      description: "Il tuo profilo venue è stato salvato con successo.",
    });
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
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
                                          return checked
                                            ? field.onChange([...field.value, genre])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== genre
                                                )
                                              );
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
