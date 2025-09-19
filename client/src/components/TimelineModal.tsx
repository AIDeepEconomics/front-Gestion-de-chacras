import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Timeline from "./Timeline";
import { Chacra, Event, Zafra } from "@shared/schema";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  chacra: Chacra | null;
  events: Event[];
  zafras: Zafra[];
}

export default function TimelineModal({ isOpen, onClose, chacra, events, zafras }: TimelineModalProps) {
  const [timelineOffset, setTimelineOffset] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const timelineRef = useRef<HTMLDivElement>(null);

  if (!chacra) return null;

  const chacraEvents = events.filter(event => event.chacraId === chacra.id);
  const chacraZafras = zafras.filter(zafra => zafra.chacraId === chacra.id);

  const moveTimeline = (direction: 'left' | 'right') => {
    const step = 100;
    setTimelineOffset(prev => {
      const newOffset = direction === 'left' ? prev - step : prev + step;
      console.log(`Timeline moved ${direction}, new offset: ${newOffset}`);
      return newOffset;
    });
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? Math.min(prev * 1.2, 3) : Math.max(prev / 1.2, 0.5);
      console.log(`Timeline zoomed ${direction}, new zoom: ${newZoom}`);
      return newZoom;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>
              <span>Línea de Tiempo - {chacra.name}</span>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                {chacra.area} ha • {chacra.establishmentName} • {chacra.regime}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Timeline Controls */}
          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveTimeline('left')}
                data-testid="button-move-left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => moveTimeline('right')}
                data-testid="button-move-right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Mover línea de tiempo
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom('out')}
                data-testid="button-zoom-out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleZoom('in')}
                data-testid="button-zoom-in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Detailed Timeline */}
          <div 
            ref={timelineRef}
            className="relative overflow-hidden border border-border rounded-md"
            style={{
              transform: `translateX(${timelineOffset}px) scale(${zoomLevel})`,
              transformOrigin: 'left center',
              transition: 'transform 0.3s ease'
            }}
          >
            <Timeline 
              events={chacraEvents}
              zafras={chacraZafras}
              monthsToShow={12}
              isCompact={false}
              onEventClick={(event) => console.log('Detailed event clicked:', event)}
            />
          </div>

          {/* Event Legend */}
          <div className="bg-muted/30 p-4 rounded-md">
            <h4 className="font-medium text-foreground mb-3">Tipos de Eventos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { type: 'laboreo', icon: '🚜', color: 'bg-orange-500' },
                { type: 'fertilización', icon: '🌱', color: 'bg-yellow-500' },
                { type: 'siembra', icon: '🌾', color: 'bg-green-600' },
                { type: 'emergencia', icon: '🌱', color: 'bg-green-400' },
                { type: 'inundación', icon: '💧', color: 'bg-blue-500' },
                { type: 'aplicación', icon: '💊', color: 'bg-purple-500' },
                { type: 'drenado', icon: '🌊', color: 'bg-blue-300' },
                { type: 'cosecha', icon: '✂️', color: 'bg-amber-600' }
              ].map((item) => (
                <div key={item.type} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${item.color} flex items-center justify-center text-xs`}>
                    <span className="text-white">{item.icon}</span>
                  </div>
                  <span className="text-muted-foreground capitalize">{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Event Summary */}
          <div className="bg-card border border-border p-4 rounded-md">
            <h4 className="font-medium text-foreground mb-3">
              Resumen de Eventos ({chacraEvents.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {chacraEvents
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((event) => (
                <div key={event.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {({ laboreo: '🚜', fertilización: '🌱', siembra: '🌾', emergencia: '🌱', inundación: '💧', aplicación: '💊', drenado: '🌊', cosecha: '✂️' } as any)[event.type] || '📅'}
                    </span>
                    <div>
                      <p className="font-medium text-sm capitalize">{event.type}</p>
                      {event.details && <p className="text-xs text-muted-foreground">{event.details}</p>}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('es-ES')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}