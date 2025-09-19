import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Plus, MapPin, Loader2 } from "lucide-react";
import { IndustrialPlant } from "@shared/schema";

interface PlantListProps {
  plants: IndustrialPlant[];
  selectedPlant: IndustrialPlant | null;
  onPlantSelect: (plant: IndustrialPlant) => void;
  isLoading?: boolean;
}

export default function PlantList({ plants, selectedPlant, onPlantSelect, isLoading }: PlantListProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Plantas Industriales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add Plant Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 h-auto py-3"
          data-testid="button-add-plant"
        >
          <Plus className="h-4 w-4" />
          Agregar Planta
        </Button>
        
        {/* Plants List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Cargando plantas...</span>
            </div>
          ) : (
            plants.map((plant) => (
              <Button
                key={plant.id}
                variant={selectedPlant?.id === plant.id ? "default" : "ghost"}
                size="sm"
                className={`w-full justify-start h-auto py-3 px-3 ${
                  selectedPlant?.id === plant.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-left hover:bg-muted"
                }`}
                onClick={() => onPlantSelect(plant)}
                data-testid={`button-plant-${plant.id}`}
              >
                <div className="text-left space-y-1">
                  <div className="font-medium text-sm">
                    {plant.name}
                  </div>
                  <div className="flex items-center gap-1 text-xs opacity-70">
                    <MapPin className="h-3 w-3" />
                    {plant.location || "Sin ubicación"}
                  </div>
                  <div className="text-xs opacity-70">
                    {plant.silos?.length || 0} silos
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
        
        {!isLoading && plants.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No hay plantas registradas
          </div>
        )}
      </CardContent>
    </Card>
  );
}