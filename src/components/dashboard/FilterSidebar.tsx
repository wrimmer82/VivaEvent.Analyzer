import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FilterSidebar = () => {
  return (
    <Card className="bg-[#1a1f2e] border-cyan-500/30 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold">Filtra Ricerca</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm">
          Filtri disponibili prossimamente
        </p>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
