import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import PlantList from "./PlantList";
import PlantDetails from "./PlantDetails";
import { IndustrialPlant } from "@shared/schema";

export default function PlantasySilos() {
  const [selectedPlant, setSelectedPlant] = useState<IndustrialPlant | null>(null);

  const { data: plants = [], isLoading: plantsLoading } = useQuery({
    queryKey: ['/api/plants'],
    queryFn: async () => {
      const response = await fetch('/api/plants');
      if (!response.ok) {
        throw new Error('Failed to fetch plants');
      }
      return response.json() as IndustrialPlant[];
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Gestión de Plantas y Silos
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Panel Izquierdo: Lista de Plantas */}
        <div className="lg:col-span-1">
          <PlantList
            plants={plants}
            selectedPlant={selectedPlant}
            onPlantSelect={setSelectedPlant}
            isLoading={plantsLoading}
          />
        </div>
        
        {/* Panel Derecho: Detalles y Silos de la Planta */}
        <div className="lg:col-span-2">
          <PlantDetails
            selectedPlant={selectedPlant}
          />
        </div>
      </div>
    </div>
  );
}