import { useState } from "react";
import PlantList from "./PlantList";
import PlantDetails from "./PlantDetails";
import { IndustrialPlant, Silo, RiceBatch } from "@shared/schema";

export default function PlantasySilos() {
  const [selectedPlant, setSelectedPlant] = useState<IndustrialPlant | null>(null);

  // TODO: remove mock functionality - comprehensive mock data for plants
  const mockPlants: IndustrialPlant[] = [
    {
      id: "1",
      name: "Planta Industrial SAMAN",
      location: "Treinta y Tres",
      silos: ["Silo A-1", "Silo A-2", "Silo A-3", "Silo B-1", "Silo B-2"]
    },
    {
      id: "2",
      name: "Molino San Fernando",
      location: "Rocha", 
      silos: ["Silo Norte", "Silo Sur", "Silo Centro"]
    },
    {
      id: "3",
      name: "Cooperativa Arrocera del Este",
      location: "Cerro Largo",
      silos: ["Silo 1", "Silo 2", "Silo 3", "Silo 4"]
    },
    {
      id: "4",
      name: "Planta Industrial del Norte",
      location: "Tacuarembó",
      silos: ["Silo Principal", "Silo Secundario"]
    }
  ];

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
            plants={mockPlants}
            selectedPlant={selectedPlant}
            onPlantSelect={setSelectedPlant}
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