import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Eye, FileText, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface TraceabilityLot {
  id: string;
  lotNumber: string;
  producerName: string;
  chacras: string[];
  totalWeight: number;
  variety: string;
  harvestDate: string;
  processingDate: string;
  status: string;
  qualityGrade: string;
}

export default function TrazabilidadManagementMolino() {
  const mockLots: TraceabilityLot[] = [
    {
      id: "lot1",
      lotNumber: "LOT-2024-A001",
      producerName: "Juan Carlos Rodríguez",
      chacras: ["Chacra Norte", "Loma Alta"],
      totalWeight: 58,
      variety: "El Paso 144",
      harvestDate: "2024-09-15",
      processingDate: "2024-09-18",
      status: "procesado",
      qualityGrade: "Premium"
    },
    {
      id: "lot2",
      lotNumber: "LOT-2024-A002",
      producerName: "María del Carmen Silva",
      chacras: ["Campo La Esperanza"],
      totalWeight: 26,
      variety: "INIA Olimar",
      harvestDate: "2024-09-28",
      processingDate: "2024-10-01",
      status: "procesado",
      qualityGrade: "Primera"
    },
    {
      id: "lot3",
      lotNumber: "LOT-2024-A003",
      producerName: "Juan Carlos Rodríguez",
      chacras: ["Potrero Este"],
      totalWeight: 32,
      variety: "INIA Merín",
      harvestDate: "2024-10-20",
      processingDate: "2024-10-22",
      status: "en proceso",
      qualityGrade: "Pendiente"
    },
    {
      id: "lot4",
      lotNumber: "LOT-2024-A004",
      producerName: "Roberto Fernández",
      chacras: ["Chacra Río Cebollatí"],
      totalWeight: 24,
      variety: "El Paso 144",
      harvestDate: "2024-10-21",
      processingDate: "",
      status: "recibido",
      qualityGrade: "Pendiente"
    }
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
      recibido: { label: "Recibido", variant: "secondary" },
      "en proceso": { label: "En Proceso", variant: "default" },
      procesado: { label: "Procesado", variant: "outline" },
      despachado: { label: "Despachado", variant: "destructive" }
    };
    return badges[status] || { label: status, variant: "secondary" };
  };

  const getQualityBadge = (grade: string) => {
    const badges: Record<string, { variant: "default" | "secondary" | "outline" | "destructive" }> = {
      "Premium": { variant: "default" },
      "Primera": { variant: "secondary" },
      "Segunda": { variant: "outline" },
      "Pendiente": { variant: "secondary" }
    };
    return badges[grade] || { variant: "secondary" };
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2" data-testid="heading-trazabilidad-molino">
          Trazabilidad de Lotes - Molino Los Pinos
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Seguimiento de lotes procesados desde origen hasta despacho
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Lotes en Planta ({mockLots.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Lote</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Productor</TableHead>
                <TableHead>Chacras Origen</TableHead>
                <TableHead>Variedad</TableHead>
                <TableHead>Peso (ton)</TableHead>
                <TableHead>Calidad</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLots.map((lot) => (
                <tr key={lot.id} data-testid={`row-lot-molino-${lot.id}`}>
                  <TableCell className="font-medium" data-testid={`text-lot-number-${lot.id}`}>
                    {lot.lotNumber}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadge(lot.status).variant}
                      data-testid={`badge-status-${lot.id}`}
                    >
                      {getStatusBadge(lot.status).label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span data-testid={`text-producer-${lot.id}`}>{lot.producerName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm" data-testid={`text-chacras-${lot.id}`}>
                      {lot.chacras.join(", ")}
                    </div>
                  </TableCell>
                  <TableCell data-testid={`text-variety-${lot.id}`}>
                    {lot.variety}
                  </TableCell>
                  <TableCell data-testid={`text-weight-${lot.id}`}>
                    {lot.totalWeight} ton
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getQualityBadge(lot.qualityGrade).variant}
                      data-testid={`badge-quality-${lot.id}`}
                    >
                      {lot.qualityGrade}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-view-trace-${lot.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Trazabilidad
                    </Button>
                  </TableCell>
                </tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground" data-testid="count-total-lots">
              {mockLots.length}
            </div>
            <div className="text-sm text-muted-foreground">Lotes Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground" data-testid="count-processing">
              {mockLots.filter(l => l.status === "en proceso").length}
            </div>
            <div className="text-sm text-muted-foreground">En Proceso</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground" data-testid="count-processed">
              {mockLots.filter(l => l.status === "procesado").length}
            </div>
            <div className="text-sm text-muted-foreground">Procesados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-foreground" data-testid="total-weight-lots">
              {mockLots.reduce((sum, l) => sum + l.totalWeight, 0)} ton
            </div>
            <div className="text-sm text-muted-foreground">Peso Total</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información de Trazabilidad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cada lote incluye información completa de trazabilidad desde el campo hasta el despacho:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Origen: Productor, establecimiento y chacras específicas</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Variedad de arroz y fecha de cosecha</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Historial de eventos agrícolas (fertilización, aplicaciones, etc.)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Análisis de calidad y clasificación</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Fechas de recepción, procesamiento y despacho</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
