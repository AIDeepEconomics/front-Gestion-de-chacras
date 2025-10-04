import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";

interface EventsFiltersProps {
  onFilterChange: (filters: EventFilters) => void;
}

export interface EventFilters {
  establishment: string;
  zafra: string;
  regime: string;
  type: string;
}

export default function EventsFilters({ onFilterChange }: EventsFiltersProps) {
  const [filters, setFilters] = useState<EventFilters>({
    establishment: "all",
    zafra: "all", 
    regime: "all",
    type: "all"
  });

  const handleFilterChange = (key: keyof EventFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    console.log(`Filter changed: ${key} = ${value}`);
  };

  const clearFilters = () => {
    const clearedFilters = {
      establishment: "all",
      zafra: "all",
      regime: "all", 
      type: "all"
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
    console.log("Filters cleared");
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== "all");

  return (
    <div className="bg-card border border-border rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium text-foreground">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost" 
            size="sm"
            onClick={clearFilters}
            data-testid="button-clear-filters"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Establecimiento
          </label>
          <Select value={filters.establishment} onValueChange={(value) => handleFilterChange("establishment", value)}>
            <SelectTrigger data-testid="select-establishment">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="la-juanita">La Juanita</SelectItem>
              <SelectItem value="don-timoteo">Don Timoteo</SelectItem>
              <SelectItem value="los-pinos">Los Pinos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Zafra
          </label>
          <Select value={filters.zafra} onValueChange={(value) => handleFilterChange("zafra", value)}>
            <SelectTrigger data-testid="select-zafra">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="2024-25">2024-25</SelectItem>
              <SelectItem value="2023-24">2023-24</SelectItem>
              <SelectItem value="2022-23">2022-23</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Régimen
          </label>
          <Select value={filters.regime} onValueChange={(value) => handleFilterChange("regime", value)}>
            <SelectTrigger data-testid="select-regime">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="propiedad">Propiedad</SelectItem>
              <SelectItem value="arrendamiento">Arrendamiento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1 block">
            Tipo
          </label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange("type", value)}>
            <SelectTrigger data-testid="select-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="arroz">Arroz</SelectItem>
              <SelectItem value="pasturas">Pasturas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}