import { useState } from "react";
import TimelineRow from "./TimelineRow";
import TimelineModal from "./TimelineModal";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Chacra, Event, Zafra } from "@shared/schema";
import { EventFilters } from "./EventsFilters";
import { FileDown, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventsTableProps {
  chacras: Chacra[];
  events: Event[];
  zafras: Zafra[];
  filters: EventFilters;
  selectedChacras: string[];
  onChacraSelectionChange: (chacraId: string, selected: boolean) => void;
}

export default function EventsTable({ chacras, events, zafras, filters, selectedChacras, onChacraSelectionChange }: EventsTableProps) {
  const [selectedChacra, setSelectedChacra] = useState<Chacra | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Filter chacras based on current filters
  const filteredChacras = chacras.filter(chacra => {
    if (filters.establishment !== "all") {
      const establishmentMatch = chacra.establishmentName.toLowerCase().includes(filters.establishment.replace("-", " "));
      if (!establishmentMatch) return false;
    }
    
    if (filters.regime !== "all" && chacra.regime !== filters.regime) {
      return false;
    }

    // Filter by type (arroz/pasturas) based on zafras
    if (filters.type !== "all") {
      const chacraZafras = zafras.filter(z => z.chacraId === chacra.id);
      const hasType = chacraZafras.some(z => z.type === filters.type);
      if (!hasType) return false;
    }

    return true;
  });

  const handleViewDetails = (chacra: Chacra) => {
    setSelectedChacra(chacra);
    setModalOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    filteredChacras.forEach((chacra) => {
      if (checked !== selectedChacras.includes(chacra.id)) {
        onChacraSelectionChange(chacra.id, checked);
      }
    });
  };

  const isAllSelected = filteredChacras.length > 0 && filteredChacras.every(chacra => selectedChacras.includes(chacra.id));
  const isSomeSelected = filteredChacras.some(chacra => selectedChacras.includes(chacra.id));

  const handleExportToExcel = () => {
    // TODO: Implement Excel export functionality
    console.log("Exporting selected chacras to Excel:", selectedChacras);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Líneas de Tiempo de Chacras
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-chacras"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              data-testid="checkbox-select-all-chacras"
            />
            <label htmlFor="select-all-chacras" className="text-sm text-muted-foreground cursor-pointer">
              Seleccionar todas
            </label>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            {selectedChacras.length > 0 && (
              <Badge variant="default" className="text-sm">
                {selectedChacras.filter(id => filteredChacras.find(c => c.id === id)).length} seleccionadas
              </Badge>
            )}
            <Badge variant="secondary" className="text-sm">
              {filteredChacras.length} de {chacras.length} chacras
            </Badge>
            {filters.establishment !== "all" || filters.regime !== "all" || filters.type !== "all" ? (
              <Badge variant="outline" className="text-sm">
                Filtros activos
              </Badge>
            ) : null}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportToExcel}
              disabled={selectedChacras.length === 0}
              className="gap-2"
              data-testid="button-export-excel"
            >
              <FileDown className="h-4 w-4" />
              Exportar en Excel
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    data-testid="button-export-info"
                  >
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Exportar el historial de eventos de chacras seleccionadas en Excel
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredChacras.length > 0 ? (
          filteredChacras.map((chacra) => (
            <div key={chacra.id} className="flex items-center space-x-3 border rounded-md p-3 hover-elevate">
              <Checkbox
                id={`chacra-select-${chacra.id}`}
                checked={selectedChacras.includes(chacra.id)}
                onCheckedChange={(checked) => onChacraSelectionChange(chacra.id, checked as boolean)}
                data-testid={`checkbox-chacra-${chacra.id}`}
              />
              <div className="flex-1">
                <TimelineRow
                  chacra={chacra}
                  events={events}
                  zafras={zafras}
                  onViewDetails={handleViewDetails}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-md">
            <p>No se encontraron chacras que coincidan con los filtros seleccionados.</p>
          </div>
        )}
      </div>

      <TimelineModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        chacra={selectedChacra}
        events={events}
        zafras={zafras}
      />
    </div>
  );
}