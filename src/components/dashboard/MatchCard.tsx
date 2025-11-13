import { Star, MapPin, Euro, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export interface MatchCardProps {
  id: string;
  userId?: string; // ID utente per le booking requests
  nome: string;
  tipo: 'artista' | 'venue' | 'professionista';
  genere: string;
  città: string;
  cachet?: number;
  capacity?: number;
  rating: number;
  avatarUrl: string;
  matchScore: number;
  onBookingClick?: () => void;
}

const MatchCard = ({ 
  id,
  nome, 
  tipo, 
  genere, 
  città, 
  cachet,
  capacity,
  rating, 
  avatarUrl, 
  matchScore,
  onBookingClick 
}: MatchCardProps) => {
  const navigate = useNavigate();
  const getMatchScoreColor = (score: number) => {
    if (score > 70) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleViewProfile = () => {
    if (tipo === 'artista') {
      navigate(`/artista/${id}`);
    } else if (tipo === 'professionista') {
      navigate(`/professionista/${id}`);
    } else {
      navigate(`/venue/${id}`);
    }
  };

  const handleSendProposal = () => {
    if (onBookingClick) {
      onBookingClick();
    } else {
      console.log('Send proposal to:', id);
    }
  };

  return (
    <div className="relative bg-[#1a1f2e] border border-cyan-500/30 rounded-xl p-5 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all duration-300">
      {/* Match Score Badge */}
      <Badge 
        className={`absolute top-4 right-4 ${getMatchScoreColor(matchScore)} text-white font-bold text-sm`}
      >
        {matchScore}%
      </Badge>

      {/* Avatar and Name */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl} alt={nome} />
          <AvatarFallback>{nome.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-white mb-1">{nome}</h3>
          <p className="text-sm text-gray-400">{genere}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          <span>{rating} Rating</span>
        </div>
        {città !== 'N/A' && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <MapPin className="h-4 w-4 text-cyan-500" />
            <span>{città}</span>
          </div>
        )}
        {tipo === 'artista' && cachet && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Euro className="h-4 w-4 text-cyan-500" />
            <span>€{cachet.toLocaleString()}</span>
          </div>
        )}
        {tipo === 'venue' && capacity && (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Users className="h-4 w-4 text-cyan-500" />
            <span>{capacity} cap</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1 border-cyan-500 text-cyan-500 hover:bg-cyan-900/30"
          onClick={handleViewProfile}
        >
          Visualizza Profilo
        </Button>
        <Button 
          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
          onClick={handleSendProposal}
        >
          {tipo === 'professionista' ? 'Contatta 📧' : 'Prenota 🎯'}
        </Button>
      </div>
    </div>
  );
};

export default MatchCard;
