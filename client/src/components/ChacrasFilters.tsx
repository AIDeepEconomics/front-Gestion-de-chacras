import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface ChacrasFilters {
  establishment: string;
  area: string; // "asc" | "desc" | "all"
  regime: string;
}

interface ChacrasFiltersProps {
  onFilterChange: (filters: ChacrasFilters) => void;
}

export default function ChacrasFilters({ onFilterChange }: ChacrasFiltersProps) {
  const handleFilterChange = (key: keyof ChacrasFilters, value: string) => {
    const newFilters = { establishment: "all", area: "all", regime: "all" };
    newFilters[key] = value;
    
    // Get current filters from other selects
    const establishmentSelect = document.querySelector('[data-testid="select-establishment-filter"]') as HTMLSelectElement;
    const areaSelect = document.querySelector('[data-testid="select-area-filter"]') as HTMLSelectElement;
    const regimeSelect = document.querySelector('[data-testid="select-regime-filter"]') as HTMLSelectElement;
    
    if (establishmentSelect && establishmentSelect.getAttribute('data-value')) {
      newFilters.establishment = establishmentSelect.getAttribute('data-value') || "all";
    }
    if (areaSelect && areaSelect.getAttribute('data-value')) {
      newFilters.area = areaSelect.getAttribute('data-value') || "all";
    }
    if (regimeSelect && regimeSelect.getAttribute('data-value')) {
      newFilters.regime = regimeSelect.getAttribute('data-value') || "all";
    }
    
    // Override with the new value
    newFilters[key] = value;
    
    console.log(`Filter changed: ${key} = ${value}`);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ChacrasFilters = {
      establishment: "all",
      area: "all", 
      regime: "all"
    };
    onFilterChange(clearedFilters);
    console.log("Filters cleared");
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-md">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-foreground">Filtrar por:</span>
      </div>

      {/* Establishment Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Establecimiento:</span>
        <Select
          onValueChange={(value) => handleFilterChange("establishment", value)}
          defaultValue="all"
        >
          <SelectTrigger 
            className="w-48"
            data-testid="select-establishment-filter"
          >
            <SelectValue placeholder="Todos los establecimientos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los establecimientos</SelectItem>
            <SelectItem value="la-juanita">La Juanita</SelectItem>
            <SelectItem value="don-timoteo">Don Timoteo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Area Sorting Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Área:</span>
        <Select
          onValueChange={(value) => handleFilterChange("area", value)}
          defaultValue="all"
        >
          <SelectTrigger 
            className="w-40"
            data-testid="select-area-filter"
          >
            <SelectValue placeholder="Sin ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Sin ordenar</SelectItem>
            <SelectItem value="desc">Mayor a menor</SelectItem>
            <SelectItem value="asc">Menor a mayor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Regime Filter */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Régimen:</span>
        <Select
          onValueChange={(value) => handleFilterChange("regime", value)}
          defaultValue="all"
        >
          <SelectTrigger 
            className="w-52"
            data-testid="select-regime-filter"
          >
            <SelectValue placeholder="Todos los regímenes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los regímenes</SelectItem>
            <SelectItem value="propiedad">Propiedad</SelectItem>
            <SelectItem value="arrendamiento">Arrendamiento</SelectItem>
            <SelectItem value="gestionando para terceros">Gestionando para terceros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={clearFilters}
        className="text-muted-foreground hover:text-foreground"
        data-testid="button-clear-filters"
      >
        <X className="h-4 w-4 mr-1" />
        Limpiar filtros
      </Button>
    </div>
  );
}