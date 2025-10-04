import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, User, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface EventWithProducer {
  id: string;
  description: string;
  eventType: string;
  startDate: string;
  chacraName: string;
  establishmentName: string;
  producerName: string;
  notes?: string;
}

export default function EventsManagementMolino() {
  const [filterProducer, setFilterProducer] = useState<string>("all");
  const [filterEventType, setFilterEventType] = useState<string>("all");

  const mockEventsShared: EventWithProducer[] = [
    {
      id: "e1",
      description: "Fertilización con Urea - 150 kg/ha",
      eventType: "fertilizacion",
      startDate: "2024-10-15",
      chacraName: "Chacra Norte",
      establishmentName: "La Juanita",
      producerName: "Juan Carlos Rodríguez",
      notes: "Primera aplicación de la zafra"
    },
    {
      id: "e2",
      description: "Siembra - El Paso 144",
      eventType: "siembra",
      startDate: "2024-10-05",
      chacraName: "Potrero Este",
      establishmentName: "Don Timoteo",
      producerName: "Juan Carlos Rodríguez",
      notes: "Densidad 180 kg/ha"
    },
    {
      id: "e3",
      description: "Aplicación Herbicida - Glifosato",
      eventType: "aplicacion",
      startDate: "2024-10-20",
      chacraName: "Loma Alta",
      establishmentName: "La Juanita",
      producerName: "Juan Carlos Rodríguez",
      notes: "Control de malezas"
    },
    {
      id: "e4",
      description: "Cosecha - Rendimiento 8.2 ton/ha",
      eventType: "cosecha",
      startDate: "2024-09-28",
      chacraName: "Campo La Esperanza",
      establishmentName: "Santa Rosa",
      producerName: "María del Carmen Silva",
      notes: "Excelente rendimiento"
    },
    {
      id: "e5",
      description: "Fertilización con DAP - 120 kg/ha",
      eventType: "fertilizacion",
      startDate: "2024-10-12",
      chacraName: "Chacra Río Cebollatí",
      establishmentName: "El Trébol",
      producerName: "Roberto Fernández",
      notes: ""
    }
  ];

  const getEventTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      fertilizacion: { label: "Fertilización", variant: "default" },
      siembra: { label: "Siembra", variant: "secondary" },
      aplicacion: { label: "Aplicación", variant: "outline" },
      cosecha: { label: "Cosecha", variant: "destructive" },
    };
    return badges[type] || { label: type, variant: "secondary" };
  };

  const filteredEvents = mockEventsShared.filter(event => {
    if (filterProducer !== "all" && event.producerName !== filterProducer) return false;
    if (filterEventType !== "all" && event.eventType !== filterEventType) return false;
    return true;
  });

  const uniqueProducers = Array.from(new Set(mockEventsShared.map(e => e.producerName)));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="heading-eventos-molino">
          Eventos Agrícolas Compartidos
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Visualización de eventos registrados por productores asociados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Productor
              </label>
              <Select value={filterProducer} onValueChange={setFilterProducer}>
                <SelectTrigger data-testid="select-filter-producer">
                  <SelectValue placeholder="Todos los productores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los productores</SelectItem>
                  {uniqueProducers.map(producer => (
                    <SelectItem key={producer} value={producer}>
                      {producer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tipo de Evento
              </label>
              <Select value={filterEventType} onValueChange={setFilterEventType}>
                <SelectTrigger data-testid="select-filter-event-type">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="fertilizacion">Fertilización</SelectItem>
                  <SelectItem value="siembra">Siembra</SelectItem>
                  <SelectItem value="aplicacion">Aplicación</SelectItem>
                  <SelectItem value="cosecha">Cosecha</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Registro de Eventos ({filteredEvents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Chacra</TableHead>
                <TableHead>Productor</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No hay eventos que coincidan con los filtros seleccionados
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <tr key={event.id} data-testid={`row-event-molino-${event.id}`}>
                    <TableCell data-testid={`text-date-${event.id}`}>
                      {format(new Date(event.startDate), "dd MMM yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getEventTypeBadge(event.eventType).variant}
                        data-testid={`badge-type-${event.id}`}
                      >
                        {getEventTypeBadge(event.eventType).label}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium" data-testid={`text-description-${event.id}`}>
                      {event.description}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span data-testid={`text-chacra-${event.id}`}>{event.chacraName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span data-testid={`text-producer-${event.id}`}>{event.producerName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        data-testid={`button-view-${event.id}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
