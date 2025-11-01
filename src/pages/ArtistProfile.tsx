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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Music, Image as ImageIcon, Video, Users, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";

const formSchema = z.object({
  artistName: z.string().min(2, "Nome artista richiesto").max(100),
  genre: z.string().min(2, "Genere musicale richiesto"),
  bio: z.string().max(500, "Massimo 500 caratteri"),
  localFanbase: z.string().min(2, "Località richiesta"),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  spotify: z.string().optional(),
  youtube: z.string().optional(),
  tiktok: z.string().optional(),
});

const ArtistProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [epkFile, setEpkFile] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [audioSamples, setAudioSamples] = useState<File[]>([]);
  const [videoLink, setVideoLink] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artistName: "",
      genre: "",
      bio: "",
      localFanbase: "",
      instagram: "",
      facebook: "",
      spotify: "",
      youtube: "",
      tiktok: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    console.log("EPK:", epkFile);
    console.log("Photos:", photos);
    console.log("Audio Samples:", audioSamples);
    console.log("Video Link:", videoLink);
    
    toast({
      title: "Profilo Creato! 🎵",
      description: "Il tuo profilo artista è stato salvato con successo.",
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)]);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAudioSamples([...audioSamples, ...Array.from(e.target.files)]);
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
              Crea il Tuo Profilo Artista
            </h1>
            <p className="text-xl text-muted-foreground">
              Carica i tuoi contenuti e inizia a trovare venue perfetti per te
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Informazioni Base */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-primary" />
                    Informazioni Base
                  </CardTitle>
                  <CardDescription>Nome artista e dettagli musicali</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="artistName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Artista / Band</FormLabel>
                        <FormControl>
                          <Input placeholder="Es. The Midnight Stars" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genere Musicale</FormLabel>
                        <FormControl>
                          <Input placeholder="Es. Rock, Pop, Jazz, Electronic..." {...field} />
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
                        <FormLabel>Biografia Breve</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Racconta la tua storia musicale..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="localFanbase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fanbase Locale</FormLabel>
                        <FormControl>
                          <Input placeholder="Es. Milano, Roma, Torino..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* EPK Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Electronic Press Kit (EPK)
                  </CardTitle>
                  <CardDescription>Carica il tuo EPK in formato PDF</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setEpkFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="epk-upload"
                    />
                    <Label htmlFor="epk-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {epkFile ? epkFile.name : "Clicca per caricare EPK (PDF)"}
                      </p>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Foto */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Foto Professionali
                  </CardTitle>
                  <CardDescription>Carica foto promozionali e live (max 10)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {photos.length > 0 ? `${photos.length} foto caricate` : "Clicca per caricare foto"}
                      </p>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Audio Samples */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Music className="w-5 h-5 text-primary" />
                    Accenni di Brani
                  </CardTitle>
                  <CardDescription>Carica sample audio delle tue migliori canzoni (max 5)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <Input
                      type="file"
                      accept="audio/*"
                      multiple
                      onChange={handleAudioUpload}
                      className="hidden"
                      id="audio-upload"
                    />
                    <Label htmlFor="audio-upload" className="cursor-pointer">
                      <Music className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {audioSamples.length > 0 ? `${audioSamples.length} brani caricati` : "Clicca per caricare audio"}
                      </p>
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Video Live */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-primary" />
                    Video Live
                  </CardTitle>
                  <CardDescription>Inserisci link YouTube o Vimeo dei tuoi live</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="video-link">Link Video</Label>
                    <Input
                      id="video-link"
                      placeholder="https://youtube.com/watch?v=..."
                      value={videoLink}
                      onChange={(e) => setVideoLink(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Statistiche Social */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Statistiche Social
                  </CardTitle>
                  <CardDescription>Link ai tuoi profili social e piattaforme streaming</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input placeholder="https://instagram.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="spotify"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spotify</FormLabel>
                        <FormControl>
                          <Input placeholder="https://open.spotify.com/artist/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input placeholder="https://youtube.com/@..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input placeholder="https://facebook.com/..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktok"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TikTok</FormLabel>
                        <FormControl>
                          <Input placeholder="https://tiktok.com/@..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center pt-6">
                <Button type="submit" size="lg" className="w-full md:w-auto px-12">
                  Salva Profilo Artista
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
