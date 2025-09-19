import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Event, Zafra } from "@shared/schema";

interface TimelineProps {
  events: Event[];
  zafras: Zafra[];
  monthsToShow?: number;
  isCompact?: boolean;
  onEventClick?: (event: Event) => void;
}

const eventTypeColors = {
  laboreo: "bg-orange-500",
  fertilización: "bg-yellow-500", 
  siembra: "bg-green-600",
  emergencia: "bg-green-400",
  inundación: "bg-blue-500",
  aplicación: "bg-purple-500",
  drenado: "bg-blue-300",
  cosecha: "bg-amber-600"
};

const eventTypeIcons = {
  laboreo: "🚜",
  fertilización: "🌱", 
  siembra: "🌾",
  emergencia: "🌱",
  inundación: "💧",
  aplicación: "💊",
  drenado: "🌊",
  cosecha: "✂️"
};

export default function Timeline({ 
  events, 
  zafras, 
  monthsToShow = 6, 
  isCompact = false,
  onEventClick 
}: TimelineProps) {
  const [scrollPosition, setScrollPosition] = useState(0);

  const getZafraBackground = (zafraType: string) => {
    return zafraType === "pasturas" ? "bg-green-100" : "bg-orange-50";
  };

  // Generate timeline months
  const generateTimelineMonths = () => {
    const months = [];
    const today = new Date();
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        date,
        label: date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
      });
    }
    return months;
  };

  const timelineMonths = generateTimelineMonths();

  const getEventPosition = (eventDate: string) => {
    const date = new Date(eventDate);
    const firstMonth = timelineMonths[0].date;
    const lastMonth = timelineMonths[timelineMonths.length - 1].date;
    
    if (date < firstMonth || date > lastMonth) return null;
    
    const totalDays = (lastMonth.getTime() - firstMonth.getTime()) / (1000 * 60 * 60 * 24);
    const eventDays = (date.getTime() - firstMonth.getTime()) / (1000 * 60 * 60 * 24);
    
    return (eventDays / totalDays) * 100;
  };

  return (
    <TooltipProvider>
      <div className={`relative ${isCompact ? 'h-12' : 'h-20'} bg-background border border-border rounded overflow-hidden`}>
        {/* Zafra backgrounds */}
        {zafras.map((zafra) => (
          <div
            key={zafra.id}
            className={`absolute top-0 h-full ${getZafraBackground(zafra.type)} opacity-50`}
            style={{
              left: '10%',
              width: '40%', // Placeholder positioning
            }}
          />
        ))}

        {/* Timeline grid */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex h-full">
            {timelineMonths.map((month, index) => (
              <div
                key={index}
                className="flex-1 border-r border-border/30 relative"
              >
                {!isCompact && (
                  <div className="absolute bottom-1 left-1 text-xs text-muted-foreground">
                    {month.label}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Events */}
        {events.map((event) => {
          const position = getEventPosition(event.date);
          if (position === null) return null;

          return (
            <Tooltip key={event.id}>
              <TooltipTrigger asChild>
                <div
                  className={`absolute top-2 w-6 h-6 rounded-full cursor-pointer transform -translate-x-3 
                    ${eventTypeColors[event.type as keyof typeof eventTypeColors] || 'bg-gray-500'}
                    hover:scale-110 transition-transform flex items-center justify-center text-xs`}
                  style={{ left: `${position}%` }}
                  onClick={() => {
                    onEventClick?.(event);
                    console.log('Event clicked:', event);
                  }}
                  data-testid={`event-${event.id}`}
                >
                  <span className="text-white">
                    {eventTypeIcons[event.type as keyof typeof eventTypeIcons] || '📅'}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{event.type}</p>
                  <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString('es-ES')}</p>
                  {event.details && <p className="text-sm mt-1">{event.details}</p>}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Zafra dividers */}
        <div className="absolute top-0 w-full h-full pointer-events-none">
          <div className="absolute left-1/2 top-0 w-0.5 h-full bg-border"></div>
        </div>
      </div>
    </TooltipProvider>
  );
}