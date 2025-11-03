import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Send } from "lucide-react";

interface SuggestedMatchesProps {
  searchQuery: string;
}

// Mock data - will be replaced with real Supabase data
const mockMatches = [
  {
    id: 1,
    name: "The Blue Notes",
    type: "Artist",
    genre: "Jazz",
    avatar: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop",
    distance: 5,
    rating: 4.8,
    matchScore: 95,
  },
  {
    id: 2,
    name: "Sunset Lounge",
    type: "Venue",
    genre: "Live Music",
    avatar: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&h=100&fit=crop",
    distance: 12,
    rating: 4.6,
    matchScore: 92,
  },
  {
    id: 3,
    name: "Electric Dreams",
    type: "Artist",
    genre: "Electronic",
    avatar: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    distance: 8,
    rating: 4.9,
    matchScore: 88,
  },
  {
    id: 4,
    name: "The Jazz Corner",
    type: "Venue",
    genre: "Jazz Club",
    avatar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&h=100&fit=crop",
    distance: 3,
    rating: 4.7,
    matchScore: 90,
  },
  {
    id: 5,
    name: "Soul Speakers",
    type: "Artist",
    genre: "Soul/R&B",
    avatar: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=100&h=100&fit=crop",
    distance: 15,
    rating: 4.5,
    matchScore: 85,
  },
  {
    id: 6,
    name: "Rock Arena",
    type: "Venue",
    genre: "Rock Venue",
    avatar: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=100&h=100&fit=crop",
    distance: 20,
    rating: 4.8,
    matchScore: 87,
  },
];

const SuggestedMatches = ({ searchQuery }: SuggestedMatchesProps) => {
  const filteredMatches = mockMatches.filter((match) =>
    match.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    match.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Suggested Matches</CardTitle>
        <p className="text-sm text-muted-foreground">
          AI-powered recommendations based on your profile
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredMatches.map((match) => (
            <Card
              key={match.id}
              className="bg-secondary/30 border-border hover:shadow-[var(--shadow-card)] transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-4 space-y-4">
                {/* Avatar & Name */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={match.avatar} alt={match.name} />
                    <AvatarFallback>{match.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">
                      {match.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{match.genre}</p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    {match.distance} km
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                    <Star className="h-3 w-3 mr-1 fill-accent text-accent" />
                    {match.rating}
                  </Badge>
                  <Badge className="bg-primary/20 text-primary border-primary/30">
                    Match {match.matchScore}%
                  </Badge>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Send Proposal
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedMatches;
