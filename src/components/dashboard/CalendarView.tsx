import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const localizer = momentLocalizer(moment);

interface BookingEvent extends Event {
  id: string;
  status: string;
}

export const CalendarView = () => {
  const queryClient = useQueryClient();

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
    };
  }) || [];

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
    <Card>
      <CardContent className="p-6">
        <div className="calendar-container" style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onEventDrop={handleEventDrop}
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
  );
};
