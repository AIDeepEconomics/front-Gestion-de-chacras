import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Timeline from "./Timeline";
import { Chacra, Event, Zafra } from "@shared/schema";
import { Eye } from "lucide-react";

interface TimelineRowProps {
  chacra: Chacra;
  events: Event[];
  zafras: Zafra[];
  onViewDetails: (chacra: Chacra) => void;
}

const regimeColors = {
  "propiedad": "bg-primary text-primary-foreground",
  "arrendamiento": "bg-secondary text-secondary-foreground", 
  "gestionando para terceros": "bg-accent text-accent-foreground"
};

export default function TimelineRow({ chacra, events, zafras, onViewDetails }: TimelineRowProps) {
  const chacraEvents = events.filter(event => event.chacraId === chacra.id);
  const chacraZafras = zafras.filter(zafra => zafra.chacraId === chacra.id);

  return (
    <div className="flex items-center space-x-4 p-4 border border-border rounded-md bg-card hover:bg-muted/50 transition-colors">
      {/* Chacra Info */}
      <div className="min-w-0 flex-1 max-w-xs">
        <div className="space-y-2">
          <div>
            <h4 className="font-medium text-foreground truncate">{chacra.name}</h4>
            <p className="text-sm text-muted-foreground">
              {chacra.area} ha • {chacra.establishmentName}
            </p>
          </div>
          <Badge 
            className={regimeColors[chacra.regime as keyof typeof regimeColors]}
            variant="secondary"
          >
            {chacra.regime}
          </Badge>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 min-w-0">
        <Timeline 
          events={chacraEvents}
          zafras={chacraZafras}
          isCompact={true}
          onEventClick={(event) => console.log('Event clicked:', event)}
        />
      </div>

      {/* View Details Button */}
      <div className="flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onViewDetails(chacra);
            console.log('View details clicked for chacra:', chacra.name);
          }}
          data-testid={`button-view-details-${chacra.id}`}
        >
          <Eye className="h-4 w-4 mr-2" />
          Ver Detalles
        </Button>
      </div>
    </div>
  );
}