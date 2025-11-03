import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, TrendingUp, CheckCircle } from "lucide-react";

interface NotificationsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data - will be replaced with real Supabase data
const mockNotifications = [
  {
    id: 1,
    type: "match",
    title: "New Match Received!",
    message: "The Blue Notes matched with your venue",
    time: "5 minutes ago",
    icon: TrendingUp,
  },
  {
    id: 2,
    type: "proposal",
    title: "Proposal Accepted!",
    message: "Sunset Lounge accepted your booking proposal",
    time: "1 hour ago",
    icon: CheckCircle,
  },
  {
    id: 3,
    type: "booking",
    title: "Upcoming Event",
    message: "You have a show scheduled for Nov 15th",
    time: "2 hours ago",
    icon: Calendar,
  },
  {
    id: 4,
    type: "match",
    title: "New Match Available",
    message: "3 new matches based on your preferences",
    time: "Yesterday",
    icon: TrendingUp,
  },
];

const NotificationsDrawer = ({ open, onOpenChange }: NotificationsDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notifications
          </SheetTitle>
          <SheetDescription>
            Stay updated with your matches and bookings
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {mockNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className="p-4 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg h-fit">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-foreground">
                        {notification.title}
                      </h4>
                      <Badge variant="secondary" className="text-xs whitespace-nowrap">
                        New
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsDrawer;
