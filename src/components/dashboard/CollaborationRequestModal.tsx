import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CollaborationRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  receiverName: string;
  receiverType: "artista" | "venue";
}

const CollaborationRequestModal = ({
  open,
  onOpenChange,
  receiverId,
  receiverName,
  receiverType,
}: CollaborationRequestModalProps) => {
  const [serviceDescription, setServiceDescription] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serviceDescription.trim()) {
      toast({
        title: "Campo obbligatorio",
        description: "Inserisci una descrizione dei servizi offerti",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per inviare richieste",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("collaboration_requests")
        .insert({
          sender_id: session.user.id,
          receiver_id: receiverId,
          receiver_type: receiverType,
          service_description: serviceDescription.trim(),
          personal_message: personalMessage.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Richiesta inviata!",
        description: `La tua richiesta di collaborazione è stata inviata a ${receiverName}`,
        className: "bg-green-500 text-white",
      });

      setServiceDescription("");
      setPersonalMessage("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error sending collaboration request:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio della richiesta",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Richiesta di Collaborazione
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Invia una richiesta di collaborazione a {receiverName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="service" className="text-foreground">
              Servizi Offerti *
            </Label>
            <Textarea
              id="service"
              placeholder="Descrivi i servizi che puoi offrire (es. fotografia, audio mixing, video production...)"
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              className="min-h-[100px] bg-background text-foreground border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-foreground">
              Messaggio Personale (opzionale)
            </Label>
            <Textarea
              id="message"
              placeholder="Aggiungi un messaggio personale per presentarti..."
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              className="min-h-[100px] bg-background text-foreground border-border"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                "Invia Richiesta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationRequestModal;
