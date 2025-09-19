import { useState } from "react";
import TimelineRow from "./TimelineRow";
import TimelineModal from "./TimelineModal";
import { Badge } from "@/components/ui/badge";
import { Chacra, Event, Zafra } from "@shared/schema";
import { EventFilters } from "./EventsFilters";

interface EventsTableProps {
  chacras: Chacra[];
  events: Event[];
  zafras: Zafra[];
  filters: EventFilters;
}

export default function EventsTable({ chacras, events, zafras, filters }: EventsTableProps) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Líneas de Tiempo de Chacras
        </h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {filteredChacras.length} de {chacras.length} chacras
          </Badge>
          {filters.establishment !== "all" || filters.regime !== "all" || filters.type !== "all" ? (
            <Badge variant="outline" className="text-sm">
              Filtros activos
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {filteredChacras.length > 0 ? (
          filteredChacras.map((chacra) => (
            <TimelineRow
              key={chacra.id}
              chacra={chacra}
              events={events}
              zafras={zafras}
              onViewDetails={handleViewDetails}
            />
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