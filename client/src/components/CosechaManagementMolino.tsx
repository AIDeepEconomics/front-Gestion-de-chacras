import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, User, MapPin, Calendar, Weight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface RemitoWithProducer {
  id: string;
  remitoNumber: string;
  chacraName: string;
  establishmentName: string;
  producerName: string;
  producerPhone: string;
  estimatedWeight: number;
  trailerPlate: string;
  status: string;
  createdAt: string;
  departureDateTime?: string;
  arrivalDateTime?: string;
}

interface HarvestSummary {
  producerName: string;
  totalRemitos: number;
  totalWeight: number;
  chacrasCount: number;
}

export default function CosechaManagementMolino() {
  const mockRemitosReceived: RemitoWithProducer[] = [
    {
      id: "r1",
      remitoNumber: "REM-2024-001",
      chacraName: "Chacra Norte",
      establishmentName: "La Juanita",
      producerName: "Juan Carlos Rodríguez",
      producerPhone: "099 123 456",
      estimatedWeight: 28,
      trailerPlate: "SAA 1234",
      status: "descargado",
      createdAt: "2024-09-15T08:00:00.000Z",
      departureDateTime: "2024-09-15T10:30:00.000Z",
      arrivalDateTime: "2024-09-15T14:45:00.000Z"
    },
    {
      id: "r2",
      remitoNumber: "REM-2024-002",
      chacraName: "Potrero Este",
      establishmentName: "Don Timoteo",
      producerName: "Juan Carlos Rodríguez",
      producerPhone: "099 123 456",
      estimatedWeight: 32,
      trailerPlate: "SAB 5678",
      status: "en transito",
      createdAt: "2024-10-20T06:00:00.000Z",
      departureDateTime: "2024-10-20T08:15:00.000Z"
    },
    {
      id: "r3",
      remitoNumber: "REM-2024-003",
      chacraName: "Campo La Esperanza",
      establishmentName: "Santa Rosa",
      producerName: "María del Carmen Silva",
      producerPhone: "099 555 777",
      estimatedWeight: 26,
      trailerPlate: "SAC 9012",
      status: "pendiente",
      createdAt: "2024-10-22T07:30:00.000Z"
    },
    {
      id: "r4",
      remitoNumber: "REM-2024-004",
      chacraName: "Loma Alta",
      establishmentName: "La Juanita",
      producerName: "Juan Carlos Rodríguez",
      producerPhone: "099 123 456",
      estimatedWeight: 30,
      trailerPlate: "SAD 3456",
      status: "descargado",
      createdAt: "2024-09-28T09:00:00.000Z",
      departureDateTime: "2024-09-28T11:00:00.000Z",
      arrivalDateTime: "2024-09-28T15:20:00.000Z"
    },
    {
      id: "r5",
      remitoNumber: "REM-2024-005",
      chacraName: "Chacra Río Cebollatí",
      establishmentName: "El Trébol",
      producerName: "Roberto Fernández",
      producerPhone: "099 888 999",
      estimatedWeight: 24,
      trailerPlate: "SAE 7890",
      status: "en transito",
      createdAt: "2024-10-21T05:45:00.000Z",
      departureDateTime: "2024-10-21T07:30:00.000Z"
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      pendiente: { label: "Pendiente", variant: "secondary" },
      "en transito": { label: "En Tránsito", variant: "default" },
      descargado: { label: "Descargado", variant: "outline" },
    };
    return badges[status] || { label: status, variant: "secondary" };
  };

  const harvestSummary: HarvestSummary[] = mockRemitosReceived.reduce((acc, remito) => {
    const existing = acc.find(item => item.producerName === remito.producerName);
    if (existing) {
      existing.totalRemitos += 1;
      existing.totalWeight += remito.estimatedWeight;
    } else {
      acc.push({
        producerName: remito.producerName,
        totalRemitos: 1,
        totalWeight: remito.estimatedWeight,
        chacrasCount: 1
      });
    }
    return acc;
  }, [] as HarvestSummary[]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="heading-cosecha-molino">
          Gestión de Cosecha - Molino Los Pinos
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Control de remitos y entregas de productores asociados
        </p>
      </div>

      <Tabs defaultValue="remitos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="remitos" data-testid="tab-remitos">
            Remitos Recibidos
          </TabsTrigger>
          <TabsTrigger value="resumen" data-testid="tab-resumen">
            Resumen por Productor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="remitos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Remitos ({mockRemitosReceived.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nº Remito</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Productor</TableHead>
                    <TableHead>Chacra</TableHead>
                    <TableHead>Peso Est. (ton)</TableHead>
                    <TableHead>Matrícula</TableHead>
                    <TableHead>Fecha Creación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRemitosReceived.map((remito) => (
                    <tr key={remito.id} data-testid={`row-remito-molino-${remito.id}`}>
                      <TableCell className="font-medium" data-testid={`text-remito-number-${remito.id}`}>
                        {remito.remitoNumber}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadge(remito.status).variant}
                          data-testid={`badge-status-${remito.id}`}
                        >
                          {getStatusBadge(remito.status).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span data-testid={`text-producer-${remito.id}`}>{remito.producerName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span data-testid={`text-chacra-${remito.id}`}>{remito.chacraName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Weight className="h-3 w-3 text-muted-foreground" />
                          <span data-testid={`text-weight-${remito.id}`}>{remito.estimatedWeight} ton</span>
                        </div>
                      </TableCell>
                      <TableCell data-testid={`text-plate-${remito.id}`}>
                        {remito.trailerPlate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span data-testid={`text-date-${remito.id}`}>
                            {format(new Date(remito.createdAt), "dd MMM yyyy", { locale: es })}
                          </span>
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resumen" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen por Productor</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Productor</TableHead>
                    <TableHead>Total Remitos</TableHead>
                    <TableHead>Peso Total (ton)</TableHead>
                    <TableHead>Promedio por Remito (ton)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {harvestSummary.map((summary, index) => (
                    <tr key={index} data-testid={`row-summary-${index}`}>
                      <TableCell className="font-medium" data-testid={`text-summary-producer-${index}`}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {summary.producerName}
                        </div>
                      </TableCell>
                      <TableCell data-testid={`text-summary-remitos-${index}`}>
                        {summary.totalRemitos}
                      </TableCell>
                      <TableCell data-testid={`text-summary-weight-${index}`}>
                        {summary.totalWeight} ton
                      </TableCell>
                      <TableCell data-testid={`text-summary-avg-${index}`}>
                        {(summary.totalWeight / summary.totalRemitos).toFixed(1)} ton
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground" data-testid="total-remitos-count">
                  {mockRemitosReceived.length}
                </div>
                <div className="text-sm text-muted-foreground">Remitos Totales</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground" data-testid="total-weight-sum">
                  {mockRemitosReceived.reduce((sum, r) => sum + r.estimatedWeight, 0)} ton
                </div>
                <div className="text-sm text-muted-foreground">Peso Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-foreground" data-testid="unique-producers-count">
                  {harvestSummary.length}
                </div>
                <div className="text-sm text-muted-foreground">Productores Activos</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
