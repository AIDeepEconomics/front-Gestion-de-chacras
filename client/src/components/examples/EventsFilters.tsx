import { useState } from "react";
import EventsFilters, { EventFilters } from "../EventsFilters";

export default function EventsFiltersExample() {
  const [filters, setFilters] = useState<EventFilters>({
    establishment: "all",
    zafra: "all",
    regime: "all",
    type: "all"
  });

  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
  };

  return (
    <div className="p-6 max-w-4xl">
      <EventsFilters onFilterChange={handleFilterChange} />
      <div className="mt-4 p-4 bg-muted rounded-md">
        <h4 className="font-medium mb-2">Estado actual de filtros:</h4>
        <pre className="text-sm text-muted-foreground">
          {JSON.stringify(filters, null, 2)}
        </pre>
      </div>
    </div>
  );
}