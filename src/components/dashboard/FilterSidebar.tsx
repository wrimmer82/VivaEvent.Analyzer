import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FilterState } from "@/pages/Dashboard";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterSidebar = ({ filters, onFilterChange }: FilterSidebarProps) => {
  // Local state for filters before applying
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const genres = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Indie', 'Metal', 'Reggaeton', 'Hip Hop'];
  const cities = ['Tutte', 'Milano', 'Roma', 'Torino', 'Bologna', 'Napoli', 'Firenze'];

  const handleGenreToggle = (genre: string) => {
    const newGenres = localFilters.genres.includes(genre)
      ? localFilters.genres.filter(g => g !== genre)
      : [...localFilters.genres, genre];
    setLocalFilters({ ...localFilters, genres: newGenres });
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      genres: [],
      city: 'Tutte',
      radius: 50,
      budgetMin: 0,
      budgetMax: 5000,
      minRating: 0,
      dateStart: null,
      dateEnd: null
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const countResults = () => {
    // This would ideally be passed from parent, but for demo we show the applied filters
    return filters.genres.length + (filters.city !== 'Tutte' ? 1 : 0) + 
           (filters.budgetMin > 0 || filters.budgetMax < 5000 ? 1 : 0) + 
           (filters.minRating > 0 ? 1 : 0);
  };

  return (
    <Card className="bg-[#1a1f2e] border-cyan-500/30 sticky top-4">
      <CardHeader>
        <CardTitle className="text-white text-xl font-bold">🔍 Filtra Ricerca</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Genere Musicale - Multi-select checkboxes */}
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-semibold">Genere Musicale ▼</Label>
          <div className="space-y-2">
            {genres.map(genre => (
              <label key={genre} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={localFilters.genres.includes(genre)}
                  onChange={() => handleGenreToggle(genre)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 
                           focus:ring-2 focus:ring-cyan-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-gray-300 text-sm group-hover:text-cyan-400 transition-colors">
                  {genre}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Location - Dropdown + Slider */}
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-semibold">Location ▼</Label>
          <select
            value={localFilters.city}
            onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
          >
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          
          {localFilters.city !== 'Tutte' && (
            <div className="space-y-2 pt-2">
              <Label className="text-gray-400 text-xs">
                Entro {localFilters.radius}km da {localFilters.city}
              </Label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={localFilters.radius}
                onChange={(e) => setLocalFilters({ ...localFilters, radius: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                         [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 
                         [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Budget Evento - Range Slider */}
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-semibold">Budget Evento ▼</Label>
          <div className="text-cyan-400 text-sm font-mono mb-2">
            €{localFilters.budgetMin} - €{localFilters.budgetMax}
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-gray-400 text-xs mb-1 block">Min: €{localFilters.budgetMin}</Label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={localFilters.budgetMin}
                onChange={(e) => setLocalFilters({ ...localFilters, budgetMin: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                         [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 
                         [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs mb-1 block">Max: €{localFilters.budgetMax}</Label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={localFilters.budgetMax}
                onChange={(e) => setLocalFilters({ ...localFilters, budgetMax: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                         [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                         [&::-webkit-slider-thumb]:bg-cyan-500 [&::-webkit-slider-thumb]:cursor-pointer
                         [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                         [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-cyan-500 
                         [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Rating Minimo - Select dropdown */}
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-semibold">Rating Minimo ▼</Label>
          <select
            value={localFilters.minRating}
            onChange={(e) => setLocalFilters({ ...localFilters, minRating: parseFloat(e.target.value) })}
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
                     focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
          >
            <option value="0">Tutti</option>
            <option value="4.0">4.0+ stelle</option>
            <option value="4.3">4.3+ stelle</option>
            <option value="4.5">4.5+ stelle</option>
            <option value="4.8">4.8+ stelle</option>
          </select>
        </div>

        {/* Periodo Evento - Date range */}
        <div className="space-y-3">
          <Label className="text-gray-300 text-sm font-semibold">Periodo Evento ▼</Label>
          <div className="space-y-2">
            <div>
              <Label className="text-gray-400 text-xs mb-1 block">Da:</Label>
              <input
                type="date"
                value={localFilters.dateStart || ''}
                onChange={(e) => {
                  setLocalFilters({ ...localFilters, dateStart: e.target.value || null });
                  console.log('Data inizio:', e.target.value);
                }}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
                         focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
              />
            </div>
            <div>
              <Label className="text-gray-400 text-xs mb-1 block">A:</Label>
              <input
                type="date"
                value={localFilters.dateEnd || ''}
                onChange={(e) => {
                  setLocalFilters({ ...localFilters, dateEnd: e.target.value || null });
                  console.log('Data fine:', e.target.value);
                }}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 
                         focus:ring-2 focus:ring-cyan-500 focus:outline-none text-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-cyan-500/30">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 
                     rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            🎯 Applica Filtri
            {countResults() > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                {countResults()} attivi
              </span>
            )}
          </button>
          
          <button
            onClick={handleResetFilters}
            className="w-full text-cyan-400 hover:text-cyan-300 font-medium py-2 px-4 
                     transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filtri
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSidebar;
