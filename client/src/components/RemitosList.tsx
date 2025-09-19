import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Package, Route, AlertTriangle, CheckCircle } from "lucide-react";
import { Remito } from "@shared/schema";

interface RemitosListProps {
  remitos: Remito[];
}

const statusConfig = {
  "creandose": {
    label: "Creándose",
    color: "bg-gray-100 text-gray-800 border-gray-200",
    icon: Package
  },
  "creado": {
    label: "Creado",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    icon: CheckCircle
  },
  "cargandose": {
    label: "Cargándose",
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    icon: Package
  },
  "en_viaje": {
    label: "En viaje",
    color: "bg-purple-100 text-purple-800 border-purple-200",
    icon: Route
  },
  "descargandose": {
    label: "Descargándose",
    color: "bg-orange-100 text-orange-800 border-orange-200",
    icon: Package
  },
  "perdido_destruido": {
    label: "Perdido/Destruido",
    color: "bg-red-100 text-red-800 border-red-200",
    icon: AlertTriangle
  },
  "descargado": {
    label: "Descargado",
    color: "bg-green-100 text-green-800 border-green-200",
    icon: CheckCircle
  }
};

export default function RemitosList({ remitos }: RemitosListProps) {
  // Group remitos by status
  const remitosByStatus = useMemo(() => {
    const grouped: Record<string, Remito[]> = {};
    
    remitos.forEach(remito => {
      if (!grouped[remito.status]) {
        grouped[remito.status] = [];
      }
      grouped[remito.status].push(remito);
    });

    // Sort each group by creation date (most recent first)
    Object.keys(grouped).forEach(status => {
      grouped[status].sort((a, b) => 
        new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime()
      );
    });

    return grouped;
  }, [remitos]);

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.creandose;
    const Icon = config.icon;
    
    return (
      <Badge 
        variant="outline" 
        className={`${config.color} font-medium border`}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const totalRemitos = remitos.length;
  const completedRemitos = remitos.filter(r => r.status === "descargado").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Lista de Remitos
        </h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            {totalRemitos} remitos totales
          </Badge>
          <Badge variant="default" className="text-sm">
            {completedRemitos} completados
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const count = remitosByStatus[status]?.length || 0;
          const Icon = config.icon;
          
          return (
            <Card key={status} className="text-center">
              <CardContent className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold text-foreground">{count}</div>
                <div className="text-xs text-muted-foreground">
                  {config.label}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Remitos Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Chacra de Origen</TableHead>
              <TableHead className="font-semibold">Camión</TableHead>
              <TableHead className="font-semibold">Destino</TableHead>
              <TableHead className="font-semibold">Creado</TableHead>
              <TableHead className="font-semibold">Salida</TableHead>
              <TableHead className="font-semibold">Llegada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {remitos.length > 0 ? (
              remitos
                .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
                .map((remito) => (
                  <TableRow 
                    key={remito.id} 
                    className="hover:bg-muted/50"
                    data-testid={`row-remito-${remito.id}`}
                  >
                    <TableCell>
                      <StatusBadge status={remito.status} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {remito.chacraName}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {remito.loadedTonnage}t / {remito.truckMaxTonnage}t
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {remito.driverWhatsapp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {remito.industrialPlantName}
                      </div>
                      {remito.destinationSilo && (
                        <div className="text-xs text-muted-foreground">
                          Silo: {remito.destinationSilo}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTime(remito.createdAt?.toString() || null)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTime(remito.departureDateTime?.toString() || null)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTime(remito.arrivalDateTime?.toString() || null)}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No hay remitos registrados aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}