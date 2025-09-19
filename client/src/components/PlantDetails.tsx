import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Settings, Building2 } from "lucide-react";
import { IndustrialPlant, Silo, RiceBatch } from "@shared/schema";
import SiloCard from "./SiloCard";

interface PlantDetailsProps {
  selectedPlant: IndustrialPlant | null;
}

type TransferLogic = "proportional_mix" | "fifo_layers";

export default function PlantDetails({ selectedPlant }: PlantDetailsProps) {
  const [transferLogic, setTransferLogic] = useState<TransferLogic>("proportional_mix");

  // TODO: remove mock functionality - mock silos for the selected plant
  const mockSilos: Silo[] = selectedPlant ? [
    {
      id: "s1",
      siloId: "A-1",
      industrialPlantId: selectedPlant.id,
      type: "Almacenamiento",
      maxCapacity: "10000.00",
      currentOccupancy: "4500.00", 
      diameter: "12.50",
      createdAt: new Date().toISOString()
    },
    {
      id: "s2", 
      siloId: "A-2",
      industrialPlantId: selectedPlant.id,
      type: "Secado",
      maxCapacity: "8000.00",
      currentOccupancy: "2800.00",
      diameter: "10.00",
      createdAt: new Date().toISOString()
    },
    {
      id: "s3",
      siloId: "B-1", 
      industrialPlantId: selectedPlant.id,
      type: "Almacenamiento",
      maxCapacity: "12000.00",
      currentOccupancy: "0.00",
      diameter: "14.00",
      createdAt: new Date().toISOString()
    }
  ] : [];

  // TODO: remove mock functionality - mock rice batches
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
      chacraId: "2",
      chacraName: "Campo Sur",
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
    }
  ];

  if (!selectedPlant) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center py-12">
          <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Seleccione una planta
          </h3>
          <p className="text-muted-foreground">
            Seleccione una planta industrial del panel izquierdo para gestionar sus silos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plant Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {selectedPlant.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Actions */}
          <div className="flex flex-wrap gap-3">
            <Button
              size="sm" 
              className="gap-2"
              data-testid="button-add-silo"
            >
              <Plus className="h-4 w-4" />
              Agregar Silo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              data-testid="button-register-process"
            >
              <Settings className="h-4 w-4" />
              Registrar Proceso Industrial
            </Button>
          </div>

          {/* Transfer Logic Selector */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Lógica de Trasiego
            </Label>
            <RadioGroup
              value={transferLogic}
              onValueChange={(value: TransferLogic) => setTransferLogic(value)}
              className="space-y-3"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem 
                  value="proportional_mix" 
                  id="proportional_mix"
                  data-testid="radio-proportional-mix"
                />
                <div className="space-y-1">
                  <Label htmlFor="proportional_mix" className="font-medium">
                    Mezcla Proporcional
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Al extraer un porcentaje del volumen, se extrae el mismo porcentaje de cada lote individual
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <RadioGroupItem 
                  value="fifo_layers" 
                  id="fifo_layers"
                  data-testid="radio-fifo-layers"
                />
                <div className="space-y-1">
                  <Label htmlFor="fifo_layers" className="font-medium">
                    Manejo por Capas (FIFO)
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Los lotes más antiguos (abajo) salen primero. Requiere cálculo por capas según diámetro del silo
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Silos Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Silos ({mockSilos.length})
        </h3>
        {mockSilos.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {mockSilos.map((silo) => {
              const siloBatches = mockRiceBatches.filter(batch => batch.siloId === silo.id);
              return (
                <SiloCard
                  key={silo.id}
                  silo={silo}
                  batches={siloBatches}
                  transferLogic={transferLogic}
                />
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">
                No hay silos registrados para esta planta
              </p>
              <Button className="mt-4 gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Agregar Primer Silo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}