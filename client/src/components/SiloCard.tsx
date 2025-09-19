import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRightLeft, Wheat, ShoppingCart } from "lucide-react";
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
                      <TableCell className="text-right font-mono">
                        {parseFloat(batch.tonnage).toLocaleString()} t
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(batch.entryDate)}
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