import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Music, Image as ImageIcon, Video, Users, TrendingUp, LogOut, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [artistId, setArtistId] = useState<string | null>(null);
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

  const artistName = form.watch("artistName");

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

      // Load existing artist profile
      const { data: artistData, error: artistError } = await supabase
        .from("artisti")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (artistError) {
        console.error("Error loading artist profile:", artistError);
      }

      if (artistData) {
        setArtistId(artistData.id);
        const existingLinks = (artistData as any).links || {};
        form.reset({
          artistName: artistData.nome_completo || "",
          genre: artistData.genere_musicale || "",
          bio: artistData.biografia || "",
          localFanbase: artistData.citta || "",
          instagram: existingLinks.instagram || "",
          facebook: existingLinks.facebook || "",
          spotify: existingLinks.spotify || "",
          youtube: existingLinks.youtube || "",
          tiktok: existingLinks.tiktok || "",
        });
        if (existingLinks.video) {
          setVideoLink(existingLinks.video);
        }
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

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('artist-media')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('artist-media')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error(`Error uploading ${folder}:`, error);
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!userId) {
      toast({
        title: "Errore",
        description: "Utente non autenticato",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/accedi");
        return;
      }

      // Get existing links data
      let existingLinks: any = {};
      if (artistId) {
        const { data: existingArtist } = await supabase
          .from("artisti")
          .select("links")
          .eq("id", artistId)
          .single();
        
        if (existingArtist) {
          existingLinks = (existingArtist as any).links || {};
        }
      }

      // Upload files
      let epkUrl: string | null = null;
      const photoUrls: string[] = [...(existingLinks.photos || [])];
      const audioUrls: string[] = [...(existingLinks.audio || [])];

      // Upload EPK (replace if new file provided)
      if (epkFile) {
        epkUrl = await uploadFile(epkFile, 'epk');
      }

      // Upload photos (append to existing)
      for (const photo of photos) {
        const url = await uploadFile(photo, 'photos');
        if (url) photoUrls.push(url);
      }

      // Upload audio samples (append to existing)
      for (const audio of audioSamples) {
        const url = await uploadFile(audio, 'audio');
        if (url) audioUrls.push(url);
      }

      // Prepare links object with social media and media files
      const links = {
        instagram: values.instagram || "",
        facebook: values.facebook || "",
        spotify: values.spotify || "",
        youtube: values.youtube || "",
        tiktok: values.tiktok || "",
        video: videoLink || existingLinks.video || "",
        epk: epkUrl || existingLinks.epk || "",
        photos: photoUrls,
        audio: audioUrls,
      };

      const artistPayload = {
        user_id: userId,
        nome_completo: values.artistName,
        genere_musicale: values.genre,
        biografia: values.bio,
        citta: values.localFanbase,
        email: session.user.email || "",
        cachet_desiderato: 0,
        links: links,
      };

      if (artistId) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("artisti")
          .update(artistPayload)
          .eq("id", artistId);

        if (updateError) throw updateError;
      } else {
        // Insert new profile
        const { data: newArtist, error: insertError } = await supabase
          .from("artisti")
          .insert(artistPayload)
          .select()
          .single();

        if (insertError) throw insertError;
        if (newArtist) setArtistId(newArtist.id);
      }

      // Update profile_completed flag in users table
      const { error: userError } = await supabase
        .from("users")
        .update({ profile_completed: true })
        .eq("id", userId);

      if (userError) throw userError;

      toast({
        title: "Profilo Salvato! 🎵",
        description: "Il tuo profilo artista è stato salvato con successo. Media caricati: " + 
          (epkUrl ? "EPK, " : "") + 
          (photoUrls.length > 0 ? `${photoUrls.length} foto, ` : "") + 
          (audioUrls.length > 0 ? `${audioUrls.length} audio` : ""),
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Errore",
        description: "Impossibile salvare il profilo",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
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

  const isProfileComplete = () => {
    const values = form.getValues();
    return values.artistName && values.genre && values.bio && values.localFanbase;
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
          {userId && artistName && (
            <div className="flex items-center gap-4">
              <span className="text-foreground text-lg">
                Ciao, <Link to="/profile-dashboard" className="font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer">{artistName}</Link>!
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
              {artistId ? "Il Tuo Profilo Artista" : "Crea il Tuo Profilo Artista"}
            </h1>
            <p className="text-xl text-muted-foreground">
              {artistId ? "Modifica i tuoi contenuti e le tue informazioni" : "Carica i tuoi contenuti e inizia a trovare venue perfetti per te"}
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

              <div className="flex flex-col gap-4 pt-6">
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto px-12"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Salvataggio...
                      </>
                    ) : (
                      "Salva Profilo Artista"
                    )}
                  </Button>
                </div>

                {/* Button to Dashboard - Gold/Warning color */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="warning"
                    size="lg"
                    className="w-full md:w-auto px-12 text-lg font-bold"
                    onClick={() => navigate("/dashboard")}
                    disabled={!isProfileComplete()}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Vai alla Dashboard di Matching
                  </Button>
                </div>
                
                {!isProfileComplete() && (
                  <p className="text-center text-sm text-muted-foreground">
                    Completa il profilo per accedere al matching
                  </p>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
