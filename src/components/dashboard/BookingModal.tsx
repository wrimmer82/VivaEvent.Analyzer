import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiverId: string;
  receiverName: string;
  receiverType: string;
}

const bookingSchema = z.object({
  eventDate: z.date({ required_error: "La data evento è richiesta" }),
  eventTime: z.string().min(1, "L'orario è richiesto"),
  compensation: z.number().min(0, "Il compenso deve essere positivo").max(10000, "Compenso massimo: €10,000"),
  message: z.string().max(500, "Messaggio troppo lungo (max 500 caratteri)"),
});

export const BookingModal = ({ open, onOpenChange, receiverId, receiverName, receiverType }: BookingModalProps) => {
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventTime, setEventTime] = useState("");
  const [compensation, setCompensation] = useState("");
  const [message, setMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast({
        title: "Errore",
        description: "Devi accettare i termini di servizio",
        variant: "destructive",
      });
      return;
    }

    try {
      // Validate form data
      const validatedData = bookingSchema.parse({
        eventDate,
        eventTime,
        compensation: parseFloat(compensation),
        message,
      });

      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utente non autenticato");

      // Insert booking request
      const { error } = await supabase
        .from("booking_requests")
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          event_date: format(validatedData.eventDate, "yyyy-MM-dd"),
          event_time: validatedData.eventTime,
          proposed_compensation: validatedData.compensation,
          personal_message: validatedData.message || null,
          status: "pending",
        });

      if (error) throw error;

      toast({
        title: "✅ Richiesta Inviata!",
        description: `La tua richiesta è stata inviata a ${receiverName}`,
      });

      // Reset form
      setEventDate(undefined);
      setEventTime("");
      setCompensation("");
      setMessage("");
      setAcceptTerms(false);
      onOpenChange(false);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Errore Validazione",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Errore",
          description: error.message || "Impossibile inviare la richiesta",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Invia Richiesta di Booking</DialogTitle>
          <DialogDescription>
            Compila il form per inviare una proposta a <span className="font-semibold text-foreground">{receiverName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Event Date */}
          <div className="space-y-2">
            <Label htmlFor="event-date">Data Evento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !eventDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {eventDate ? format(eventDate, "PPP") : "Seleziona data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={eventDate}
                  onSelect={setEventDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Event Time */}
          <div className="space-y-2">
            <Label htmlFor="event-time">Orario Inizio *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="event-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Compensation */}
          <div className="space-y-2">
            <Label htmlFor="compensation">Compenso Proposto (€) *</Label>
            <Input
              id="compensation"
              type="number"
              min="0"
              max="10000"
              step="50"
              placeholder="es. 500"
              value={compensation}
              onChange={(e) => setCompensation(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">Massimo: €10,000</p>
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Messaggio Personale (opzionale)</Label>
            <Textarea
              id="message"
              placeholder="Scrivi un messaggio per presentare la tua proposta..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/500 caratteri
            </p>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-2 pt-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accetto i{" "}
              <a href="#" className="text-primary underline">
                termini di servizio
              </a>{" "}
              e confermo che le informazioni fornite sono corrette
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={loading}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!acceptTerms || loading}
            >
              {loading ? "Invio..." : "Invia Richiesta 🎯"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
