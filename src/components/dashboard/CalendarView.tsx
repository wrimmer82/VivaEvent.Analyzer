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

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
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

  const { data: calendarNotes, isLoading: notesLoading } = useQuery({
    queryKey: ['venue-calendar-notes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('venue_calendar_notes')
        .select('*')
        .eq('venue_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  const isLoading = bookingsLoading || notesLoading;

  const updateBookingNoteMutation = useMutation({
    mutationFn: async ({ id, note }: { id: string; note: string }) => {
      const { error } = await supabase
        .from('booking_requests')
        .update({ venue_notes: note })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-bookings-calendar'] });
      toast.success('Nota evento salvata con successo');
      setIsNoteDialogOpen(false);
      setSelectedEvent(null);
      setNoteText('');
    },
    onError: (error) => {
      console.error('Error saving booking note:', error);
      toast.error('Errore nel salvataggio della nota evento');
    },
  });

  const saveCalendarNoteMutation = useMutation({
    mutationFn: async ({ date, note }: { date: string; note: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if note already exists for this date
      const { data: existing } = await supabase
        .from('venue_calendar_notes')
        .select('id')
        .eq('venue_id', user.id)
        .eq('note_date', date)
        .maybeSingle();

      if (existing) {
        // Update existing note
        const { error } = await supabase
          .from('venue_calendar_notes')
          .update({ note_text: note })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Insert new note
        const { error } = await supabase
          .from('venue_calendar_notes')
          .insert({ venue_id: user.id, note_date: date, note_text: note });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venue-calendar-notes'] });
      toast.success('Nota giornaliera salvata con successo');
      setIsNoteDialogOpen(false);
      setSelectedEvent(null);
      setNoteText('');
    },
    onError: (error) => {
      console.error('Error saving calendar note:', error);
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

  const handleDayClick = (date: Date) => {
    // Check if this day has a booking
    const bookingOnDay = events.find(event => {
      const eventDate = event.start ? moment(event.start).format('YYYY-MM-DD') : '';
      const clickedDate = moment(date).format('YYYY-MM-DD');
      return eventDate === clickedDate;
    });

    if (bookingOnDay) {
      handleEventClick(bookingOnDay);
    } else {
      // Check if this day has a calendar note
      const noteForDay = calendarNotes?.find(note => 
        moment(note.note_date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')
      );
      
      setSelectedEvent({
        id: '',
        title: moment(date).format('DD/MM/YYYY'),
        start: date,
        end: date,
        status: 'note',
        venue_notes: noteForDay?.note_text || '',
      });
      setNoteText(noteForDay?.note_text || '');
      setIsNoteDialogOpen(true);
    }
  };

  const handleSaveNote = () => {
    if (!selectedEvent) return;

    if (selectedEvent.status === 'note') {
      // Save as calendar note
      const dateStr = selectedEvent.start ? moment(selectedEvent.start).format('YYYY-MM-DD') : '';
      saveCalendarNoteMutation.mutate({ date: dateStr, note: noteText });
    } else {
      // Save as booking note
      updateBookingNoteMutation.mutate({ id: selectedEvent.id, note: noteText });
    }
  };

  const handleEventDrop = ({ event, start }: { event: BookingEvent; start: Date }) => {
    updateBookingMutation.mutate({ id: event.id, newDate: start });
  };

  const eventStyleGetter = (event: BookingEvent) => {
    const style = {
      backgroundColor: event.status === 'accepted' ? 'hsl(189, 80%, 50%)' : 'hsl(var(--primary))',
      borderRadius: '4px',
      opacity: 0.9,
      color: 'white',
      border: 'none',
      display: 'block',
      fontSize: '0.875rem',
      padding: '2px 4px',
      fontWeight: 'bold',
    };
    return { style };
  };

  const dayStyleGetter = (date: Date) => {
    const dateStr = moment(date).format('YYYY-MM-DD');
    const hasNote = calendarNotes?.some(note => 
      moment(note.note_date).format('YYYY-MM-DD') === dateStr
    );

    if (hasNote) {
      return {
        style: {
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }
      };
    }
    return {};
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
              onSelectSlot={(slotInfo) => handleDayClick(slotInfo.start)}
              selectable
              draggableAccessor={() => true}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={dayStyleGetter}
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
            <DialogTitle>
              {selectedEvent?.status === 'accepted' ? (
                <>Note per evento: {selectedEvent?.title}</>
              ) : (
                <>Note per {selectedEvent?.title}</>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-2">
                {selectedEvent?.status === 'accepted' ? (
                  <>Data evento: {selectedEvent?.start && moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}</>
                ) : (
                  <>Data: {selectedEvent?.start && moment(selectedEvent.start).format('DD/MM/YYYY')}</>
                )}
              </p>
              {selectedEvent?.status === 'accepted' && (
                <p className="text-xs text-cyan-400 mb-2">
                  💡 Questa è una nota per un evento confermato
                </p>
              )}
            </div>
            <Textarea
              placeholder={selectedEvent?.status === 'accepted' 
                ? "Aggiungi note per questo evento (es. rider tecnico, note logistiche)..." 
                : "Aggiungi note per questa data (es. promemoria, appunti)..."}
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
              disabled={updateBookingNoteMutation.isPending || saveCalendarNoteMutation.isPending}
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              {(updateBookingNoteMutation.isPending || saveCalendarNoteMutation.isPending) ? 'Salvataggio...' : 'Salva Nota'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
