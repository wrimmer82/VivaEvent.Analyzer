import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, X, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingRequest {
  id: string;
  event_date: string;
  event_time: string;
  status: string;
  proposed_compensation: number;
  sender_name: string;
  receiver_name: string;
  type: 'received' | 'sent';
  personal_message?: string;
}

const BookingsTable = () => {
  const [loading, setLoading] = useState(true);
  const [receivedBookings, setReceivedBookings] = useState<BookingRequest[]>([]);
  const [sentBookings, setSentBookings] = useState<BookingRequest[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [counterOfferOpen, setCounterOfferOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [counterOfferData, setCounterOfferData] = useState({
    event_date: '',
    event_time: '',
    proposed_compensation: 0,
    personal_message: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Fetch received bookings
      const { data: receivedData } = await supabase
        .from("booking_requests")
        .select(`
          id,
          event_date,
          event_time,
          status,
          proposed_compensation,
          sender_id,
          personal_message
        `)
        .eq("receiver_id", session.user.id)
        .order("created_at", { ascending: false });

      // Fetch sent bookings
      const { data: sentData } = await supabase
        .from("booking_requests")
        .select(`
          id,
          event_date,
          event_time,
          status,
          proposed_compensation,
          receiver_id
        `)
        .eq("sender_id", session.user.id)
        .order("created_at", { ascending: false });

      // Get sender names for received bookings
      if (receivedData) {
        const processedReceived = await Promise.all(
          receivedData.map(async (booking) => {
            const name = await getUserName(booking.sender_id);
            return {
              ...booking,
              sender_name: name,
              receiver_name: '',
              type: 'received' as const
            };
          })
        );
        setReceivedBookings(processedReceived);
      }

      // Get receiver names for sent bookings
      if (sentData) {
        const processedSent = await Promise.all(
          sentData.map(async (booking) => {
            const name = await getUserName(booking.receiver_id);
            return {
              ...booking,
              sender_name: '',
              receiver_name: name,
              type: 'sent' as const
            };
          })
        );
        setSentBookings(processedSent);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUserName = async (userId: string): Promise<string> => {
    // Try artists first
    const { data: artistData } = await supabase
      .from("artisti")
      .select("nome_completo")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (artistData) return artistData.nome_completo;

    // Try venues
    const { data: venueData } = await supabase
      .from("venues")
      .select("nome_locale")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (venueData) return venueData.nome_locale;

    // Try professionals
    const { data: professionalData } = await supabase
      .from("professionisti")
      .select("nome_completo")
      .eq("user_id", userId)
      .maybeSingle();
    
    if (professionalData) return professionalData.nome_completo;

    return "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "accepted":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "In Attesa";
      case "accepted":
        return "Accettato";
      case "rejected":
        return "Rifiutato";
      default:
        return status;
    }
  };

  const formatDate = (date: string, time: string) => {
    const eventDate = new Date(date);
    return `${eventDate.toLocaleDateString('it-IT')} - ${time.slice(0, 5)}`;
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      setUpdatingId(bookingId);
      
      const { error } = await supabase
        .from("booking_requests")
        .update({ status: newStatus })
        .eq("id", bookingId);

      if (error) throw error;

      toast({
        title: newStatus === 'accepted' ? "Proposta accettata" : "Proposta rifiutata",
        description: `La proposta è stata ${newStatus === 'accepted' ? 'accettata' : 'rifiutata'} con successo.`,
      });

      // Reload bookings to reflect the change
      await loadBookings();
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'aggiornamento della proposta.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCounterOffer = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setCounterOfferData({
      event_date: booking.event_date,
      event_time: booking.event_time,
      proposed_compensation: booking.proposed_compensation,
      personal_message: booking.personal_message || ''
    });
    setCounterOfferOpen(true);
  };

  const handleSubmitCounterOffer = async () => {
    if (!selectedBooking) return;

    try {
      setUpdatingId(selectedBooking.id);

      const { error } = await supabase
        .from("booking_requests")
        .update({
          event_date: counterOfferData.event_date,
          event_time: counterOfferData.event_time,
          proposed_compensation: counterOfferData.proposed_compensation,
          personal_message: counterOfferData.personal_message,
          status: 'pending'
        })
        .eq("id", selectedBooking.id);

      if (error) throw error;

      toast({
        title: "Controproposta inviata",
        description: "La tua controproposta è stata inviata con successo.",
      });

      setCounterOfferOpen(false);
      setSelectedBooking(null);
      await loadBookings();
    } catch (error) {
      console.error("Error submitting counter offer:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nell'invio della controproposta.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <Card className="bg-[#1a1f2e] border-cyan-500/30">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1a1f2e] border-cyan-500/30">
      <CardHeader>
        <CardTitle className="text-white">Proposte di Collaborazione</CardTitle>
        <p className="text-sm text-gray-400">Gestisci le tue richieste ricevute e inviate</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="received" className="w-full">
          <TabsList className="bg-[#0f1419] border border-cyan-500/20">
            <TabsTrigger value="received" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Ricevute ({receivedBookings.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Inviate ({sentBookings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received" className="mt-4">
            {receivedBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nessuna proposta ricevuta
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cyan-500/20 hover:bg-transparent">
                      <TableHead className="text-cyan-400">Da</TableHead>
                      <TableHead className="text-cyan-400">Data Evento</TableHead>
                      <TableHead className="text-cyan-400">Compenso</TableHead>
                      <TableHead className="text-cyan-400">Stato</TableHead>
                      <TableHead className="text-cyan-400 text-right">Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receivedBookings.map((booking) => (
                      <TableRow key={booking.id} className="border-cyan-500/10 hover:bg-cyan-500/5">
                        <TableCell className="font-medium text-white">
                          {booking.sender_name}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {formatDate(booking.event_date, booking.event_time)}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          €{booking.proposed_compensation}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {booking.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="default"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleUpdateStatus(booking.id, 'accepted')}
                                disabled={updatingId === booking.id}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-cyan-500/30 hover:bg-cyan-500/20"
                                onClick={() => handleCounterOffer(booking)}
                                disabled={updatingId === booking.id}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                                disabled={updatingId === booking.id}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            {sentBookings.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                Nessuna proposta inviata
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-cyan-500/20 hover:bg-transparent">
                      <TableHead className="text-cyan-400">A</TableHead>
                      <TableHead className="text-cyan-400">Data Evento</TableHead>
                      <TableHead className="text-cyan-400">Compenso</TableHead>
                      <TableHead className="text-cyan-400">Stato</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sentBookings.map((booking) => (
                      <TableRow key={booking.id} className="border-cyan-500/10 hover:bg-cyan-500/5">
                        <TableCell className="font-medium text-white">
                          {booking.receiver_name}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {formatDate(booking.event_date, booking.event_time)}
                        </TableCell>
                        <TableCell className="text-gray-400">
                          €{booking.proposed_compensation}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Counter Offer Dialog */}
      <Dialog open={counterOfferOpen} onOpenChange={setCounterOfferOpen}>
        <DialogContent className="bg-[#1a1f2e] border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-cyan-400">Invia Controproposta</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modifica i dettagli della richiesta di booking e invia una controproposta
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="event_date" className="text-gray-300">Data Evento</Label>
              <Input
                id="event_date"
                type="date"
                value={counterOfferData.event_date}
                onChange={(e) => setCounterOfferData({ ...counterOfferData, event_date: e.target.value })}
                className="bg-[#0f1419] border-cyan-500/30 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event_time" className="text-gray-300">Orario</Label>
              <Input
                id="event_time"
                type="time"
                value={counterOfferData.event_time}
                onChange={(e) => setCounterOfferData({ ...counterOfferData, event_time: e.target.value })}
                className="bg-[#0f1419] border-cyan-500/30 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="compensation" className="text-gray-300">Compenso Proposto (€)</Label>
              <Input
                id="compensation"
                type="number"
                value={counterOfferData.proposed_compensation}
                onChange={(e) => setCounterOfferData({ ...counterOfferData, proposed_compensation: parseInt(e.target.value) || 0 })}
                className="bg-[#0f1419] border-cyan-500/30 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">Messaggio (opzionale)</Label>
              <Input
                id="message"
                type="text"
                placeholder="Aggiungi un messaggio alla tua controproposta..."
                value={counterOfferData.personal_message}
                onChange={(e) => setCounterOfferData({ ...counterOfferData, personal_message: e.target.value })}
                className="bg-[#0f1419] border-cyan-500/30 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCounterOfferOpen(false)}
              className="border-cyan-500/30 hover:bg-cyan-500/10"
            >
              Annulla
            </Button>
            <Button
              onClick={handleSubmitCounterOffer}
              disabled={updatingId === selectedBooking?.id}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Invia Controproposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default BookingsTable;
