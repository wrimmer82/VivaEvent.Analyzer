import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const StatsSidebar = () => {
  const stats = [
    { label: "Match Ricevuti", value: 24 },
    { label: "Proposte Inviate", value: 8 },
    { label: "Tasso Successo", value: "67%" }
  ];

  return (
    <div className="space-y-4 sticky top-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-[#1a1f2e] border-cyan-500/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
              <p className="text-white text-3xl font-bold">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-center">
        <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 text-xs">
          Aggiornato ora
        </Badge>
      </div>
    </div>
  );
};

export default StatsSidebar;
