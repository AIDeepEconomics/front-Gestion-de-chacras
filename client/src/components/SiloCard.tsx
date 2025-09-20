import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Wheat, ShoppingCart, Thermometer, Droplets, Wind, AlertTriangle, Clock, Wifi, WifiOff } from "lucide-react";
import { Silo, RiceBatch } from "@shared/schema";
import TransferModal from "./TransferModal";
import SaleAssignmentModal from "./SaleAssignmentModal";

interface SiloCardProps {
  silo: Silo;
  batches: RiceBatch[];
  availableSilos?: Silo[];
}

type TransferLogic = "proportional_mix" | "fifo_layers";

export default function SiloCard({ silo, batches, availableSilos = [] }: SiloCardProps) {
  const [transferLogic, setTransferLogic] = useState<TransferLogic>("proportional_mix");
  const maxCapacity = parseFloat(silo.maxCapacity || "0");
  const currentOccupancy = parseFloat(silo.currentOccupancy || "0");
  const occupancyPercentage = maxCapacity > 0 ? (currentOccupancy / maxCapacity) * 100 : 0;

  // Cálculo de días en silo
  function getDaysInSilo(entryDate: string): number {
    const entry = new Date(entryDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - entry.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Datos de sensores en tiempo real (mock data)
  const temperature = 22.5;
  const humidity = 13.5;
  const sensorData = {
    temperature,
    humidity,
    co2Level: 450,
    isOnline: true,
    lastReading: new Date(),
    aerationActive: silo.type.toLowerCase() === 'almacenamiento',
    qualityAlerts: [
      ...(batches.some(b => getDaysInSilo(b.entryDate) > 25) ? ['Lote r1 se aproxima al límite de 30 días'] : []),
      ...(temperature > 25 ? ['Temperatura elevada'] : [])
    ]
  };

  function getTemperatureStatus(temp: number): string {
    if (temp > 28) return 'alert';
    if (temp > 25) return 'warning';
    return 'normal';
  }

  function getHumidityStatus(humidity: number): string {
    if (humidity > 14) return 'alert';
    if (humidity > 13.5) return 'warning';
    return 'normal';
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'alert': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleString("es-UY", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "-";
    }
  };

  const getSiloTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "almacenamiento":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "secado":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "aireacion":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Silo {silo.siloId}
          </CardTitle>
          <Badge className={getSiloTypeColor(silo.type)}>
            {silo.type}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Capacidad: {maxCapacity.toLocaleString()} toneladas
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sensores en Tiempo Real */}
        <div className="border rounded-md p-3 bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {sensorData.isOnline ? (
                <Wifi className="h-3 w-3 text-green-600" />
              ) : (
                <WifiOff className="h-3 w-3 text-red-600" />
              )}
              <span className="text-xs font-medium">Sensores Activos</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Última lectura: {sensorData.lastReading.toLocaleTimeString('es-UY', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="flex items-center gap-1">
              <Thermometer className={`h-3 w-3 ${getStatusColor(getTemperatureStatus(sensorData.temperature))}`} />
              <div className="text-xs">
                <div className="font-medium">{sensorData.temperature}°C</div>
                <div className="text-muted-foreground">Temp.</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Droplets className={`h-3 w-3 ${getStatusColor(getHumidityStatus(sensorData.humidity))}`} />
              <div className="text-xs">
                <div className="font-medium">{sensorData.humidity}%</div>
                <div className="text-muted-foreground">Humedad</div>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Wind className={`h-3 w-3 ${sensorData.aerationActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="text-xs">
                <div className="font-medium">{sensorData.aerationActive ? 'ON' : 'OFF'}</div>
                <div className="text-muted-foreground">Aireación</div>
              </div>
            </div>
          </div>
          
          {/* Alertas de Calidad */}
          {sensorData.qualityAlerts.length > 0 && (
            <div className="mt-3 pt-2 border-t">
              {sensorData.qualityAlerts.map((alert: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-xs text-amber-600">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Occupancy Level */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Ocupación</span>
            <span className="text-sm text-muted-foreground">
              {currentOccupancy.toLocaleString()} / {maxCapacity.toLocaleString()} t
            </span>
          </div>
          <Progress 
            value={occupancyPercentage} 
            className="h-3"
          />
          <div className="text-xs text-muted-foreground text-center">
            {occupancyPercentage.toFixed(1)}% ocupado
          </div>
        </div>

        {/* Batches Table */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            Lotes de Arroz ({batches.length})
            {transferLogic === "fifo_layers" && (
              <Badge variant="outline" className="text-xs">
                FIFO
              </Badge>
            )}
          </h4>
          
          {batches.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID Lote</TableHead>
                    <TableHead className="text-xs">Chacra</TableHead>
                    <TableHead className="text-xs">Variedad</TableHead>
                    <TableHead className="text-xs">Calidad</TableHead>
                    <TableHead className="text-xs">Certificación</TableHead>
                    <TableHead className="text-xs text-right">Tonelaje</TableHead>
                    <TableHead className="text-xs">F. Entrada</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches
                    .sort((a, b) => {
                      if (transferLogic === "fifo_layers") {
                        return a.layerOrder - b.layerOrder; // Show oldest first for FIFO
                      }
                      return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime(); // Show newest first for proportional
                    })
                    .map((batch, index) => (
                    <TableRow 
                      key={batch.id}
                      className="text-xs"
                      data-testid={`row-batch-${batch.id}`}
                    >
                      <TableCell className="font-mono">
                        {batch.remitoId}
                        {transferLogic === "fifo_layers" && (
                          <div className="text-xs text-muted-foreground">
                            Capa #{batch.layerOrder}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{batch.chacraName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs">
                          {batch.variety}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            <span>13.2%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Partidos: 2.8%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge 
                            variant={Math.random() > 0.5 ? "default" : "outline"} 
                            className={`text-xs ${
                              Math.random() > 0.5 
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            }`}
                          >
                            {Math.random() > 0.5 ? "Orgánico" : "Convencional"}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {Math.random() > 0.7 ? "Comercio Justo" : "Estándar"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {parseFloat(batch.tonnage).toLocaleString()} t
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div className="space-y-1">
                          <div>{formatDateTime(batch.entryDate)}</div>
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            <span className={getDaysInSilo(batch.entryDate) > 25 ? 'text-amber-600 font-medium' : ''}>
                              {getDaysInSilo(batch.entryDate)} días
                            </span>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground text-sm border rounded-md">
              Silo vacío - No hay lotes registrados
            </div>
          )}
        </div>

        {/* Transfer Logic Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Lógica de Trasiego</Label>
          <RadioGroup
            value={transferLogic}
            onValueChange={(value: TransferLogic) => setTransferLogic(value)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="proportional_mix" 
                id={`proportional_mix_${silo.id}`}
                data-testid={`radio-proportional-mix-${silo.id}`}
              />
              <Label htmlFor={`proportional_mix_${silo.id}`} className="text-sm">
                Mezcla Proporcional
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="fifo_layers" 
                id={`fifo_layers_${silo.id}`}
                data-testid={`radio-fifo-layers-${silo.id}`}
              />
              <Label htmlFor={`fifo_layers_${silo.id}`} className="text-sm">
                Manejo por Capas (FIFO)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Silo Actions */}
        <div className="space-y-2">
          <TransferModal
            silo={silo}
            batches={batches}
            transferLogic={transferLogic}
            availableSilos={availableSilos}
            onTransferComplete={() => {
              // TODO: Implement refetch logic when real API is connected
              console.log("Transfer completed, should refetch data");
            }}
          />
          <SaleAssignmentModal
            silo={silo}
            batches={batches}
            transferLogic={transferLogic}
            onSaleAssigned={() => {
              // TODO: Implement refetch logic when real API is connected
              console.log("Sale assigned, should refetch data");
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}