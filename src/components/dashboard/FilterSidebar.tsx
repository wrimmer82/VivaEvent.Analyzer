import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FilterState } from "@/pages/Dashboard";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  return (
    <Card className="bg-[#1a1f2e] border-cyan-500/30 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold">Filtra Ricerca</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Genere Filter */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Genere</Label>
          <Select
            value={filters.genere}
            onValueChange={(value) => onFilterChange({ ...filters, genere: value })}
          >
            <SelectTrigger className="bg-[#0f1419] border-cyan-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1f2e] border-cyan-500/30 text-white">
              <SelectItem value="all">Tutti i Generi</SelectItem>
              <SelectItem value="rock">Rock</SelectItem>
              <SelectItem value="pop">Pop</SelectItem>
              <SelectItem value="jazz">Jazz</SelectItem>
              <SelectItem value="electronic">Electronic</SelectItem>
              <SelectItem value="metal">Metal</SelectItem>
              <SelectItem value="indie">Indie</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Città Filter */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">Città</Label>
          <Select
            value={filters.città}
            onValueChange={(value) => onFilterChange({ ...filters, città: value })}
          >
            <SelectTrigger className="bg-[#0f1419] border-cyan-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1f2e] border-cyan-500/30 text-white">
              <SelectItem value="all">Tutte le Città</SelectItem>
              <SelectItem value="Milano">Milano</SelectItem>
              <SelectItem value="Roma">Roma</SelectItem>
              <SelectItem value="Torino">Torino</SelectItem>
              <SelectItem value="Bologna">Bologna</SelectItem>
              <SelectItem value="Napoli">Napoli</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm">Rating Minimo: {filters.ratingMin.toFixed(1)}</Label>
          <Slider
            value={[filters.ratingMin]}
            onValueChange={(value) => onFilterChange({ ...filters, ratingMin: value[0] })}
            min={0}
            max={5}
            step={0.5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
