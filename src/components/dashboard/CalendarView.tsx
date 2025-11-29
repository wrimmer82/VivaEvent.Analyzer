import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const localizer = momentLocalizer(moment);

interface BookingEvent extends Event {
  id: string;
  title?: string;
  start?: Date;
  end?: Date;
  status: string;
  venue_notes?: string;
}

export const CalendarView = () => {
  const queryClient = useQueryClient();
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [noteText, setNoteText] = useState('');

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['venue-bookings-calendar'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('booking_requests')
        .select(`
          *,
          artisti:sender_id (
            nome_completo
          )
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'accepted');

      if (error) throw error;
      return data;
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase
        .from('booking_requests')
        .update({ venue_notes: note })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-bookings-calendar'] });
      toast.success('Nota salvata con successo');
      setIsNoteDialogOpen(false);
      setSelectedEvent(null);
      setNoteText('');
    },
    onError: (error) => {
      console.error('Error saving note:', error);
      toast.error('Errore nel salvataggio della nota');
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, newDate }: { id: string; newDate: Date }) => {
      const { error } = await supabase
        .from('booking_requests')
        .update({ event_date: newDate.toISOString().split('T')[0] })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-bookings-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['venue-bookings'] });
      toast.success('Data evento aggiornata');
    },
    onError: (error) => {
      console.error('Error updating booking:', error);
      toast.error('Errore nell\'aggiornamento della data');
    },
  });

  const events: BookingEvent[] = bookings?.map((booking: any) => {
    const eventDate = new Date(booking.event_date);
    const [hours, minutes] = booking.event_time.split(':');
    eventDate.setHours(parseInt(hours), parseInt(minutes));

    return {
      id: booking.id,
      title: booking.artisti?.nome_completo || 'Artista',
      start: eventDate,
      end: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000), // 2 ore di durata di default
      status: booking.status,
      venue_notes: booking.venue_notes,
    };
  }) || [];

  const handleEventClick = (event: BookingEvent) => {
    setSelectedEvent(event);
    setNoteText(event.venue_notes || '');
    setIsNoteDialogOpen(true);
  };

  const handleSaveNote = () => {
    if (selectedEvent) {
      updateNoteMutation.mutate({ id: selectedEvent.id, note: noteText });
    }
  };

  const handleEventDrop = ({ event, start }: { event: BookingEvent; start: Date }) => {
    updateBookingMutation.mutate({ id: event.id, newDate: start });
  };

  const eventStyleGetter = (event: BookingEvent) => {
    const style = {
      backgroundColor: 'hsl(var(--primary))',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'hsl(var(--primary-foreground))',
      border: 'none',
      display: 'block',
      fontSize: '0.875rem',
      padding: '2px 4px',
    };
    return { style };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-[600px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="calendar-container" style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              onEventDrop={handleEventDrop}
              onSelectEvent={handleEventClick}
              draggableAccessor={() => true}
              eventPropGetter={eventStyleGetter}
              views={['month']}
              defaultView="month"
              messages={{
                next: 'Avanti',
                previous: 'Indietro',
                today: 'Oggi',
                month: 'Mese',
                week: 'Settimana',
                day: 'Giorno',
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent className="bg-[#1a1f2e] border-cyan-500/30 text-white">
          <DialogHeader>
            <DialogTitle>Note per {selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">
                Data: {selectedEvent?.start && moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
            <Textarea
              placeholder="Aggiungi note per questo evento..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[120px] bg-[#0f1419] border-cyan-500/30 text-white"
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNoteDialogOpen(false)}
              className="border-cyan-500/30"
            >
              Annulla
            </Button>
            <Button 
              onClick={handleSaveNote}
              disabled={updateNoteMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              {updateNoteMutation.isPending ? 'Salvataggio...' : 'Salva Nota'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
