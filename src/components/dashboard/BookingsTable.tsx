import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

// Mock data - will be replaced with real Supabase data
const mockBookings = [
  {
    id: 1,
    name: "The Blue Notes",
    date: "2025-11-15",
    status: "pending",
  },
  {
    id: 2,
    name: "Sunset Lounge",
    date: "2025-11-20",
    status: "accepted",
  },
  {
    id: 3,
    name: "Electric Dreams",
    date: "2025-11-25",
    status: "paid",
  },
  {
    id: 4,
    name: "Jazz Corner",
    date: "2025-12-01",
    status: "pending",
  },
];

const BookingsTable = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-muted text-muted-foreground";
      case "accepted":
        return "bg-accent/20 text-accent border-accent/30";
      case "paid":
        return "bg-primary/20 text-primary border-primary/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "accepted":
        return "Accepted";
      case "paid":
        return "Paid";
      default:
        return status;
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-xl">My Bookings</CardTitle>
        <p className="text-sm text-muted-foreground">Active bookings and proposals</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(booking.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {getStatusLabel(booking.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsTable;
