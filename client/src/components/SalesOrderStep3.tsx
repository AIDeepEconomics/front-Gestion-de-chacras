import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OrderGeneralData, BatchAssignment, TraceabilitySummary } from "./SalesOrderWizard";

interface SalesOrderStep3Props {
  orderData: OrderGeneralData;
  assignments: BatchAssignment[];
  summary: TraceabilitySummary;
  onSummaryChange: (summary: TraceabilitySummary) => void;
  onOrderCreated: (newOrder: any) => void; // TODO: Use proper SalesOrder type
  onPrevious: () => void;
}

export default function SalesOrderStep3({ 
  orderData, 
  assignments, 
  summary, 
  onSummaryChange, 
  onOrderCreated, 
  onPrevious 
}: SalesOrderStep3Props) {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Calculate traceability summary when component mounts or assignments change
  useEffect(() => {
    calculateTraceabilitySummary();
  }, [assignments]);

  const calculateTraceabilitySummary = () => {
    // Group assignments by chacra
    const chacraGroups = assignments.reduce((groups, assignment) => {
      if (!groups[assignment.chacraName]) {
        groups[assignment.chacraName] = {
          chacraName: assignment.chacraName,
          producer: "Productor Rural", // TODO: Get from real data
          variety: assignment.variety,
          tonnage: 0,
        };
      }
      groups[assignment.chacraName].tonnage += assignment.assignedTonnage;
      return groups;
    }, {} as Record<string, any>);

    const totalTonnage = assignments.reduce((sum, a) => sum + a.assignedTonnage, 0);
    
    const chacraBreakdown = Object.values(chacraGroups).map((group: any) => ({
      ...group,
      percentage: totalTonnage > 0 ? (group.tonnage / totalTonnage) * 100 : 0,
    }));

    // TODO: Calculate real sustainability metrics based on events data
    // For now, using mock calculations
    const sustainabilityMetrics = {
      carbonFootprintPerTon: calculateWeightedAverage([
        { value: 2.1, weight: 0.4 }, // INIA Olimar
        { value: 2.3, weight: 0.6 }, // El Paso 144
      ]),
      waterUsagePerTon: calculateWeightedAverage([
        { value: 1200, weight: 0.4 },
        { value: 1350, weight: 0.6 },
      ]),
      energyUsagePerTon: calculateWeightedAverage([
        { value: 180, weight: 0.4 },
        { value: 195, weight: 0.6 },
      ]),
    };

    onSummaryChange({
      chacraBreakdown,
      sustainabilityMetrics,
    });
  };

  const calculateWeightedAverage = (values: { value: number; weight: number }[]) => {
    const totalWeight = values.reduce((sum, v) => sum + v.weight, 0);
    const weightedSum = values.reduce((sum, v) => sum + v.value * v.weight, 0);
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  const handleCreateOrder = async () => {
    setIsCreating(true);
    
    try {
      // Generate order number
      const orderNumber = `OV-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      
      // Create new order object
      const newOrder = {
        id: `so_${Date.now()}`,
        orderNumber,
        clientName: orderData.clientName,
        destination: orderData.destination,
        totalTonnage: totalTonnage.toString(),
        qualityRequirements: JSON.stringify(orderData.qualityRequirements),
        status: "Virgen",
        orderDate: new Date().toISOString(),
        estimatedDeliveryDate: orderData.estimatedDeliveryDate,
        notes: orderData.notes || "",
        createdAt: new Date().toISOString()
      };
      
      // TODO: Implement actual order creation API call
      console.log("Creating order:", {
        orderNumber,
        ...orderData,
        assignments,
        traceabilitySummary: summary,
      });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Orden creada exitosamente",
        description: `La orden ${orderNumber} ha sido creada y los lotes han sido reservados.`,
      });

      onOrderCreated(newOrder);
    } catch (error) {
      toast({
        title: "Error al crear orden",
        description: "Ocurrió un error al crear la orden. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    toast({
      title: "Exportando reporte",
      description: "La funcionalidad de exportación PDF será implementada próximamente.",
    });
  };

  const totalTonnage = assignments.reduce((sum, a) => sum + a.assignedTonnage, 0);

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Paso 3 de 3: Revise el resumen de trazabilidad y confirme la creación de la orden
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen de la Orden</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cliente</div>
              <div>{orderData.clientName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Destino</div>
              <div>{orderData.destination}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Cantidad Total</div>
              <div className="font-mono">{totalTonnage.toLocaleString()} toneladas</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Fecha de Entrega</div>
              <div>{new Date(orderData.estimatedDeliveryDate).toLocaleDateString("es-UY")}</div>
            </div>
          </div>

          {orderData.qualityRequirements.variety && (
            <div>
              <div className="text-sm font-medium text-muted-foreground">Requerimientos de Calidad</div>
              <div className="flex gap-2 mt-1">
                {orderData.qualityRequirements.variety && (
                  <Badge variant="outline">Variedad: {orderData.qualityRequirements.variety}</Badge>
                )}
                {orderData.qualityRequirements.moisture && (
                  <Badge variant="outline">Humedad: {orderData.qualityRequirements.moisture}</Badge>
                )}
                {orderData.qualityRequirements.purity && (
                  <Badge variant="outline">Pureza: {orderData.qualityRequirements.purity}</Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Traceability Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Desglose de Origen</CardTitle>
        </CardHeader>
        <CardContent>
          {summary.chacraBreakdown.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Chacra Origen</TableHead>
                    <TableHead>Productor</TableHead>
                    <TableHead>Variedad</TableHead>
                    <TableHead className="text-right">Porcentaje (%)</TableHead>
                    <TableHead className="text-right">Tonelaje (t)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.chacraBreakdown.map((breakdown, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{breakdown.chacraName}</TableCell>
                      <TableCell>{breakdown.producer}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{breakdown.variety}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {breakdown.percentage.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {breakdown.tonnage.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No hay datos de origen disponibles
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sustainability Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cálculo de Sostenibilidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {summary.sustainabilityMetrics.carbonFootprintPerTon.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">kg CO₂-eq / ton</div>
              <div className="text-xs text-muted-foreground mt-1">Huella de Carbono</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {summary.sustainabilityMetrics.waterUsagePerTon.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">L / ton</div>
              <div className="text-xs text-muted-foreground mt-1">Uso de Agua</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {summary.sustainabilityMetrics.energyUsagePerTon.toFixed(0)}
              </div>
              <div className="text-sm text-muted-foreground">kWh / ton</div>
              <div className="text-xs text-muted-foreground mt-1">Uso de Energía</div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <div className="text-sm font-medium text-green-800 dark:text-green-200">
              Huella de Carbono Estimada Total
            </div>
            <div className="text-lg font-bold text-green-900 dark:text-green-100">
              {(summary.sustainabilityMetrics.carbonFootprintPerTon * totalTonnage).toFixed(2)} kg CO₂-eq
            </div>
            <div className="text-xs text-green-700 dark:text-green-300">
              Para {totalTonnage.toLocaleString()} toneladas de arroz
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="gap-2"
          data-testid="button-previous-step3"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="gap-2"
            data-testid="button-export-pdf"
          >
            <FileDown className="h-4 w-4" />
            Exportar Reporte
          </Button>
          <Button
            onClick={handleCreateOrder}
            disabled={isCreating}
            className="gap-2"
            data-testid="button-create-order"
          >
            {isCreating ? (
              "Creando..."
            ) : (
              <>
                <Check className="h-4 w-4" />
                Generar Orden y Reservar Inventario
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}