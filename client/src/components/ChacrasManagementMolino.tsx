import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MapPin, User } from "lucide-react";

interface ChacraWithProducer {
  id: string;
  name: string;
  area: string;
  regime: string;
  establishmentName: string;
  producerName: string;
  producerPhone: string;
}

export default function ChacrasManagementMolino() {
  const mockChacrasShared: ChacraWithProducer[] = [
    {
      id: "1",
      name: "Chacra Norte",
      area: "125.5",
      regime: "propiedad",
      establishmentName: "La Juanita",
      producerName: "Juan Carlos Rodríguez",
      producerPhone: "099 123 456"
    },
    {
      id: "3",
      name: "Potrero Este",
      area: "203.7",
      regime: "gestionando para terceros",
      establishmentName: "Don Timoteo",
      producerName: "Juan Carlos Rodríguez",
      producerPhone: "099 123 456"
    },
    {
      id: "5",
      name: "Loma Alta",
      area: "156.3",
      regime: "arrendamiento",
      establishmentName: "La Juanita",
      producerName: "Juan Carlos Rodríguez",
      producerPhone: "099 123 456"
    },
    {
      id: "8",
      name: "Campo La Esperanza",
      area: "184.2",
      regime: "propiedad",
      establishmentName: "Santa Rosa",
      producerName: "María del Carmen Silva",
      producerPhone: "099 555 777"
    },
    {
      id: "9",
      name: "Chacra Río Cebollatí",
      area: "98.6",
      regime: "arrendamiento",
      establishmentName: "El Trébol",
      producerName: "Roberto Fernández",
      producerPhone: "099 888 999"
    }
  ];

  const getRegimeBadgeVariant = (regime: string) => {
    switch (regime) {
      case "propiedad":
        return "default";
      case "arrendamiento":
        return "secondary";
      case "gestionando para terceros":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="heading-chacras-molino">
          Chacras Compartidas por Productores
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Visualización de chacras cuya información ha sido compartida con Molino Los Pinos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Chacras con Acceso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chacra</TableHead>
                <TableHead>Establecimiento</TableHead>
                <TableHead>Productor</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Área (ha)</TableHead>
                <TableHead>Régimen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockChacrasShared.map((chacra) => (
                <tr key={chacra.id} data-testid={`row-chacra-molino-${chacra.id}`}>
                  <TableCell className="font-medium" data-testid={`text-chacra-name-${chacra.id}`}>
                    {chacra.name}
                  </TableCell>
                  <TableCell data-testid={`text-establishment-${chacra.id}`}>
                    {chacra.establishmentName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span data-testid={`text-producer-${chacra.id}`}>{chacra.producerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground" data-testid={`text-phone-${chacra.id}`}>
                    {chacra.producerPhone}
                  </TableCell>
                  <TableCell data-testid={`text-area-${chacra.id}`}>
                    {chacra.area} ha
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getRegimeBadgeVariant(chacra.regime)}
                      data-testid={`badge-regime-${chacra.id}`}
                    >
                      {chacra.regime}
                    </Badge>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumen de Información Compartida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-foreground" data-testid="count-total-chacras">
                {mockChacrasShared.length}
              </div>
              <div className="text-sm text-muted-foreground">Chacras con Acceso</div>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-foreground" data-testid="count-total-area">
                {mockChacrasShared.reduce((sum, c) => sum + parseFloat(c.area), 0).toFixed(1)} ha
              </div>
              <div className="text-sm text-muted-foreground">Área Total</div>
            </div>
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-foreground" data-testid="count-producers">
                {new Set(mockChacrasShared.map(c => c.producerName)).size}
              </div>
              <div className="text-sm text-muted-foreground">Productores</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
