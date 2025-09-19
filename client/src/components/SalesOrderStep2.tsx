import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Plus, Minus } from "lucide-react";
import { OrderGeneralData, BatchAssignment } from "./SalesOrderWizard";
import { Silo, RiceBatch } from "@shared/schema";

interface SalesOrderStep2Props {
  orderData: OrderGeneralData;
  assignments: BatchAssignment[];
  onAssignmentsChange: (assignments: BatchAssignment[]) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function SalesOrderStep2({ 
  orderData, 
  assignments, 
  onAssignmentsChange, 
  onNext, 
  onPrevious 
}: SalesOrderStep2Props) {
  const [selectedSilo, setSelectedSilo] = useState<string | null>(null);

  // TODO: remove mock functionality - mock available silos and batches
  const mockSilos: Silo[] = [
    {
      id: "s1",
      siloId: "A-1",
      industrialPlantId: "plant1",
      type: "Almacenamiento",
      maxCapacity: "10000.00",
      currentOccupancy: "4500.00",
      diameter: "12.50",
      createdAt: new Date().toISOString()
    },
    {
      id: "s2",
      siloId: "A-2", 
      industrialPlantId: "plant1",
      type: "Almacenamiento",
      maxCapacity: "8000.00",
      currentOccupancy: "2800.00",
      diameter: "10.00",
      createdAt: new Date().toISOString()
    },
    {
      id: "s3",
      siloId: "B-1",
      industrialPlantId: "plant1", 
      type: "Almacenamiento",
      maxCapacity: "12000.00",
      currentOccupancy: "6200.00",
      diameter: "14.00",
      createdAt: new Date().toISOString()
    }
  ];

  const mockRiceBatches: RiceBatch[] = [
    {
      id: "rb1",
      remitoId: "r1",
      siloId: "s1",
      chacraId: "1",
      chacraName: "Chacra Norte",
      variety: "INIA Olimar",
      tonnage: "25.50",
      originalTonnage: "25.50",
      entryDate: "2024-09-15T10:30:00.000Z",
      layerOrder: 1
    },
    {
      id: "rb2",
      remitoId: "r2",
      siloId: "s1", 
      chacraName: "Campo Sur",
      chacraId: "2",
      variety: "El Paso 144",
      tonnage: "28.00",
      originalTonnage: "28.00",
      entryDate: "2024-09-16T14:15:00.000Z",
      layerOrder: 2
    },
    {
      id: "rb3",
      remitoId: "r3",
      siloId: "s2",
      chacraId: "3",
      chacraName: "Potrero Este", 
      variety: "INIA Olimar",
      tonnage: "22.80",
      originalTonnage: "22.80",
      entryDate: "2024-09-17T08:45:00.000Z",
      layerOrder: 1
    },
    {
      id: "rb4",
      remitoId: "r4",
      siloId: "s3",
      chacraId: "4",
      chacraName: "Estancia La Esperanza",
      variety: "INIA Olimar",
      tonnage: "45.20",
      originalTonnage: "45.20", 
      entryDate: "2024-09-18T11:20:00.000Z",
      layerOrder: 1
    },
    {
      id: "rb5",
      remitoId: "r5",
      siloId: "s3",
      chacraId: "5",
      chacraName: "Campo Verde",
      variety: "El Paso 144",
      tonnage: "38.70",
      originalTonnage: "38.70",
      entryDate: "2024-09-19T09:10:00.000Z",
      layerOrder: 2
    }
  ];

  const totalRequired = parseFloat(orderData.totalTonnage || "0");
  const totalAssigned = assignments.reduce((sum, assignment) => sum + assignment.assignedTonnage, 0);
  const remainingToAssign = totalRequired - totalAssigned;

  const handleAddAssignment = (batch: RiceBatch, silo: Silo) => {
    const availableTonnage = parseFloat(batch.tonnage || "0");
    const newAssignment: BatchAssignment = {
      siloId: silo.id,
      siloName: silo.siloId,
      riceBatchId: batch.id,
      remitoId: batch.remitoId || "",
      chacraName: batch.chacraName || "",
      variety: batch.variety || "",
      assignedTonnage: Math.min(availableTonnage, remainingToAssign),
      availableTonnage: availableTonnage,
    };

    onAssignmentsChange([...assignments, newAssignment]);
  };

  const handleUpdateAssignment = (index: number, newTonnage: number) => {
    const updatedAssignments = [...assignments];
    const assignment = updatedAssignments[index];
    const maxAllowed = Math.min(assignment.availableTonnage, totalRequired - totalAssigned + assignment.assignedTonnage);
    
    updatedAssignments[index] = {
      ...assignment,
      assignedTonnage: Math.max(0, Math.min(newTonnage, maxAllowed))
    };

    onAssignmentsChange(updatedAssignments);
  };

  const handleRemoveAssignment = (index: number) => {
    const updatedAssignments = assignments.filter((_, i) => i !== index);
    onAssignmentsChange(updatedAssignments);
  };

  const isAssignmentComplete = totalAssigned >= totalRequired;
  const canProceed = isAssignmentComplete && assignments.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Paso 2 de 3: Seleccione los lotes de arroz para cumplir con la orden
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-muted-foreground">Total Requerido</div>
              <div className="text-lg font-semibold">{totalRequired.toLocaleString()} t</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total Asignado</div>
              <div className="text-lg font-semibold text-green-600">{totalAssigned.toLocaleString()} t</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Faltante</div>
              <div className={`text-lg font-semibold ${remainingToAssign > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {Math.max(0, remainingToAssign).toLocaleString()} t
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Estado</div>
              <Badge variant={isAssignmentComplete ? "default" : "secondary"} className={isAssignmentComplete ? "bg-green-100 text-green-800" : ""}>
                {isAssignmentComplete ? "Completo" : "Pendiente"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel: Available Silos */}
        <Card>
          <CardHeader>
            <CardTitle>Silos Disponibles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockSilos.map((silo) => {
              const siloBatches = mockRiceBatches.filter(batch => batch.siloId === silo.id);
              const siloOccupancy = parseFloat(silo.currentOccupancy || "0");
              
              return (
                <div
                  key={silo.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedSilo === silo.id ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setSelectedSilo(silo.id)}
                  data-testid={`silo-${silo.id}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Silo {silo.siloId}</h4>
                      <Badge variant="outline" className="text-xs">{silo.type}</Badge>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-mono">{siloOccupancy.toLocaleString()} t</div>
                      <div className="text-muted-foreground">{siloBatches.length} lotes</div>
                    </div>
                  </div>

                  {selectedSilo === silo.id && siloBatches.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <h5 className="text-sm font-medium">Lotes Disponibles:</h5>
                      {siloBatches.map((batch) => {
                        const isAlreadyAssigned = assignments.some(a => a.riceBatchId === batch.id);
                        
                        return (
                          <div
                            key={batch.id}
                            className="flex justify-between items-center bg-muted/50 p-2 rounded text-sm"
                          >
                            <div>
                              <span className="font-mono">{batch.remitoId}</span> - {batch.variety}
                              <div className="text-xs text-muted-foreground">{batch.chacraName}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{parseFloat(batch.tonnage || "0").toLocaleString()} t</span>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isAlreadyAssigned || remainingToAssign <= 0}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddAssignment(batch, silo);
                                }}
                                data-testid={`button-add-batch-${batch.id}`}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Right Panel: Current Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Lotes Asignados ({assignments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <div key={`${assignment.riceBatchId}-${index}`} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium font-mono">{assignment.remitoId}</div>
                        <div className="text-sm text-muted-foreground">
                          {assignment.chacraName} • {assignment.variety}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Silo {assignment.siloName}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveAssignment(index)}
                        data-testid={`button-remove-assignment-${index}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={assignment.assignedTonnage}
                        onChange={(e) => handleUpdateAssignment(index, parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        max={assignment.availableTonnage}
                        className="w-24 h-8 text-sm"
                        data-testid={`input-tonnage-${index}`}
                      />
                      <span className="text-sm">t de {assignment.availableTonnage.toLocaleString()} t disponibles</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <div className="mb-2">No hay lotes asignados</div>
                <div className="text-sm">Seleccione un silo de la izquierda para ver los lotes disponibles</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="gap-2"
          data-testid="button-previous-step2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="gap-2"
          data-testid="button-next-step2"
        >
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}