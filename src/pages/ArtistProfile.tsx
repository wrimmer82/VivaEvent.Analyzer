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
import { Upload, Music, Image as ImageIcon, Video, LogOut, ArrowRight, Loader2, X, FileText } from "lucide-react";
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
  
  // State for existing files
  const [existingEpk, setExistingEpk] = useState<string[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [existingAudio, setExistingAudio] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);
  
  // State for new files to upload
  const [newEpkFiles, setNewEpkFiles] = useState<File[]>([]);
  const [newPhotoFiles, setNewPhotoFiles] = useState<File[]>([]);
  const [newAudioFiles, setNewAudioFiles] = useState<File[]>([]);
  const [videoLinks, setVideoLinks] = useState<string>("");

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
        
        // Load existing media files
        setExistingEpk((artistData as any).epk_pdf || []);
        setExistingPhotos((artistData as any).foto_professionali || []);
        setExistingAudio((artistData as any).accenni_brani || []);
        setExistingVideos((artistData as any).video_artistici || []);
        
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
        
        // Join existing video links
        if ((artistData as any).video_artistici && (artistData as any).video_artistici.length > 0) {
          setVideoLinks((artistData as any).video_artistici.join("\n"));
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
      const fileName = `${userId}/${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
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

  const deleteFile = async (url: string, type: 'epk' | 'photo' | 'audio') => {
    try {
      // Extract file path from URL
      const urlParts = url.split('/artist-media/');
      if (urlParts.length < 2) return;
      
      const filePath = urlParts[1];
      
      const { error } = await supabase.storage
        .from('artist-media')
        .remove([filePath]);

      if (error) throw error;

      // Update state based on type
      if (type === 'epk') {
        setExistingEpk(existingEpk.filter(u => u !== url));
      } else if (type === 'photo') {
        setExistingPhotos(existingPhotos.filter(u => u !== url));
      } else if (type === 'audio') {
        setExistingAudio(existingAudio.filter(u => u !== url));
      }

      toast({
        title: "File eliminato",
        description: "Il file è stato rimosso con successo",
      });
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il file",
        variant: "destructive",
      });
    }
  };

  const deleteVideoLink = (index: number) => {
    const links = videoLinks.split("\n").filter(l => l.trim());
    links.splice(index, 1);
    setVideoLinks(links.join("\n"));
    
    const updatedVideos = [...existingVideos];
    updatedVideos.splice(index, 1);
    setExistingVideos(updatedVideos);
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

      // Upload new EPK files
      const newEpkUrls: string[] = [];
      for (const file of newEpkFiles) {
        const url = await uploadFile(file, 'epk');
        if (url) newEpkUrls.push(url);
      }

      // Upload new photos
      const newPhotoUrls: string[] = [];
      for (const file of newPhotoFiles) {
        const url = await uploadFile(file, 'photos');
        if (url) newPhotoUrls.push(url);
      }

      // Upload new audio
      const newAudioUrls: string[] = [];
      for (const file of newAudioFiles) {
        const url = await uploadFile(file, 'audio');
        if (url) newAudioUrls.push(url);
      }

      // Process video links
      const videoLinkArray = videoLinks
        .split("\n")
        .map(link => link.trim())
        .filter(link => link.length > 0);

      // Prepare links object for social media
      const links = {
        instagram: values.instagram || "",
        facebook: values.facebook || "",
        spotify: values.spotify || "",
        youtube: values.youtube || "",
        tiktok: values.tiktok || "",
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
        epk_pdf: [...existingEpk, ...newEpkUrls],
        foto_professionali: [...existingPhotos, ...newPhotoUrls],
        accenni_brani: [...existingAudio, ...newAudioUrls],
        video_artistici: videoLinkArray,
      };

      if (artistId) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("artisti")
          .update(artistPayload)
          .eq("id", artistId);

        if (updateError) throw updateError;

        toast({
          title: "Profilo aggiornato",
          description: "Le modifiche sono state salvate con successo",
        });
      } else {
        // Insert new profile
        const { data: newArtist, error: insertError } = await supabase
          .from("artisti")
          .insert([artistPayload])
          .select()
          .single();

        if (insertError) throw insertError;

        setArtistId(newArtist.id);

        toast({
          title: "Profilo creato",
          description: "Il tuo profilo artista è stato creato con successo",
        });
      }

      // Mark profile as completed
      await supabase
        .from("users")
        .update({ profile_completed: true })
        .eq("id", userId);

      // Clear new files state
      setNewEpkFiles([]);
      setNewPhotoFiles([]);
      setNewAudioFiles([]);

      // Reload profile to update existing files
      await checkAuthAndLoadProfile();

    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const isProfileComplete = () => {
    const values = form.getValues();
    return values.artistName && values.genre && values.localFanbase;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#1a1f2e] to-[#0a0f1e] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#1a1f2e] to-[#0a0f1e]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Ciao, {artistName || "Artista"}! 👋
            </h1>
            <p className="text-gray-400">Completa il tuo profilo per iniziare a ricevere proposte</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white">Informazioni Base</CardTitle>
                <CardDescription className="text-gray-400">
                  Compila le informazioni principali del tuo profilo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="artistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Nome Artista *</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-[#0a0f1e] border-cyan-500/30 text-white" />
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
                      <FormLabel className="text-white">Genere Musicale *</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-[#0a0f1e] border-cyan-500/30 text-white" />
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
                      <FormLabel className="text-white">Biografia</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="bg-[#0a0f1e] border-cyan-500/30 text-white" rows={4} />
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
                      <FormLabel className="text-white">Città *</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-[#0a0f1e] border-cyan-500/30 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* EPK Section */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-400" />
                  Electronic Press Kit (EPK)
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Carica il tuo EPK in formato PDF
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingEpk.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">File esistenti:</Label>
                    <div className="space-y-2">
                      {existingEpk.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-[#0a0f1e] rounded border border-cyan-500/30">
                          <FileText className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm text-gray-300 flex-1 truncate">EPK {index + 1}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(url, '_blank')}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            Apri
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteFile(url, 'epk')}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-white">Carica nuovo EPK:</Label>
                  <Input
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={(e) => setNewEpkFiles(Array.from(e.target.files || []))}
                    className="bg-[#0a0f1e] border-cyan-500/30 text-white"
                  />
                  {newEpkFiles.length > 0 && (
                    <p className="text-sm text-cyan-400 mt-2">{newEpkFiles.length} file selezionato/i</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Photos Section */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-cyan-400" />
                  Foto Professionali
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Carica le tue foto professionali
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingPhotos.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Foto esistenti:</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {existingPhotos.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-32 object-cover rounded border border-cyan-500/30"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={() => window.open(url, '_blank')}
                              className="bg-cyan-500 hover:bg-cyan-600"
                            >
                              Apri
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteFile(url, 'photo')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-white">Carica nuove foto:</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => setNewPhotoFiles(Array.from(e.target.files || []))}
                    className="bg-[#0a0f1e] border-cyan-500/30 text-white"
                  />
                  {newPhotoFiles.length > 0 && (
                    <p className="text-sm text-cyan-400 mt-2">{newPhotoFiles.length} file selezionato/i</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Audio Section */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Music className="h-5 w-5 text-cyan-400" />
                  Accenni di Brani
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Carica estratti audio dei tuoi brani
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingAudio.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Audio esistenti:</Label>
                    <div className="space-y-2">
                      {existingAudio.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-[#0a0f1e] rounded border border-cyan-500/30">
                          <Music className="h-4 w-4 text-cyan-400" />
                          <audio controls className="flex-1 h-8">
                            <source src={url} />
                          </audio>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteFile(url, 'audio')}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-white">Carica nuovi audio:</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    multiple
                    onChange={(e) => setNewAudioFiles(Array.from(e.target.files || []))}
                    className="bg-[#0a0f1e] border-cyan-500/30 text-white"
                  />
                  {newAudioFiles.length > 0 && (
                    <p className="text-sm text-cyan-400 mt-2">{newAudioFiles.length} file selezionato/i</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Video Section */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="h-5 w-5 text-cyan-400" />
                  Video
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Aggiungi link ai tuoi video (uno per riga)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingVideos.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Video esistenti:</Label>
                    <div className="space-y-2">
                      {existingVideos.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-[#0a0f1e] rounded border border-cyan-500/30">
                          <Video className="h-4 w-4 text-cyan-400" />
                          <span className="text-sm text-gray-300 flex-1 truncate">{url}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => window.open(url, '_blank')}
                            className="text-cyan-400 hover:text-cyan-300"
                          >
                            Apri
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteVideoLink(index)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label className="text-white">Aggiungi nuovi link video:</Label>
                  <Textarea
                    value={videoLinks}
                    onChange={(e) => setVideoLinks(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="bg-[#0a0f1e] border-cyan-500/30 text-white"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="bg-[#1a1f2e] border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-white">Social Media</CardTitle>
                <CardDescription className="text-gray-400">
                  Collega i tuoi profili social
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Instagram</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://instagram.com/..." className="bg-[#0a0f1e] border-cyan-500/30 text-white" />
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
                      <FormLabel className="text-white">Spotify</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://open.spotify.com/..." className="bg-[#0a0f1e] border-cyan-500/30 text-white" />
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
                      <FormLabel className="text-white">YouTube</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://youtube.com/..." className="bg-[#0a0f1e] border-cyan-500/30 text-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  "Salva Profilo"
                )}
              </Button>

              {isProfileComplete() && artistId && (
                <Button
                  type="button"
                  onClick={() => navigate("/profile-dashboard")}
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                >
                  Vai alla Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ArtistProfile;
