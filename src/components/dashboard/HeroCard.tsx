import { User } from "@supabase/supabase-js";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, DollarSign } from "lucide-react";

interface HeroCardProps {
  user: User;
}

const HeroCard = ({ user }: HeroCardProps) => {
  // Mock data - will be replaced with real data from Supabase
  const stats = {
    matches: 12,
    bookings: 5,
    revenue: 2450
  };

  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

  return (
    <Card className="bg-gradient-to-br from-card via-card to-secondary border-border shadow-[var(--shadow-elegant)]">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Greeting */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Hello, {userName}! 👋
            </h2>
            <p className="text-muted-foreground">
              Welcome back to your dashboard
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.matches}</p>
                  <p className="text-sm text-muted-foreground">Matches Received</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stats.bookings}</p>
                  <p className="text-sm text-muted-foreground">Bookings Accepted</p>
                </div>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">${stats.revenue}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Create Proposal
            </Button>
            <Button variant="outline">
              Browse Artists
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroCard;
