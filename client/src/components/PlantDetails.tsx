import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Plus, Settings, Building2, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { IndustrialPlant, Silo, RiceBatch } from "@shared/schema";
import SiloCard from "./SiloCard";
import SiloFormModal from "./SiloFormModal";

interface PlantDetailsProps {
  selectedPlant: IndustrialPlant | null;
}

type TransferLogic = "proportional_mix" | "fifo_layers";

export default function PlantDetails({ selectedPlant }: PlantDetailsProps) {
  const [transferLogic, setTransferLogic] = useState<TransferLogic>("proportional_mix");

  const { data: silos = [], isLoading: silosLoading, refetch: refetchSilos } = useQuery({
    queryKey: ['/api/silos', selectedPlant?.id],
    queryFn: async () => {
      if (!selectedPlant?.id) return [];
      const response = await fetch(`/api/silos?plantId=${selectedPlant.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch silos');
      }
      return response.json() as Silo[];
    },
    enabled: !!selectedPlant?.id,
  });

  const { data: riceBatches = [] } = useQuery({
    queryKey: ['/api/rice-batches'],
    queryFn: async () => {
      const response = await fetch('/api/rice-batches');
      if (!response.ok) {
        throw new Error('Failed to fetch rice batches');
      }
      return response.json() as RiceBatch[];
    },
  });

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
            <SiloFormModal 
              industrialPlantId={selectedPlant.id}
              onSiloAdded={() => {
                refetchSilos();
              }}
            />
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
          Silos ({silos.length})
        </h3>
        {silosLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Cargando silos...</span>
          </div>
        ) : silos.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {silos.map((silo) => {
              const siloBatches = riceBatches.filter(batch => batch.siloId === silo.id);
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
              <SiloFormModal 
                industrialPlantId={selectedPlant.id}
                onSiloAdded={() => {
                  refetchSilos();
                }}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}