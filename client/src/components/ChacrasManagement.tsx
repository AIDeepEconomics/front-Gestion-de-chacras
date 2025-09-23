import { useState } from "react";
import MapTabs from "./MapTabs";
import ChacrasTable from "./ChacrasTable";
import { Chacra, Establishment } from "@shared/schema";

export default function ChacrasManagement() {
  // todo: remove mock functionality - comprehensive mock data
  const [establishments, setEstablishments] = useState<Establishment[]>([
    { 
      id: "1", 
      name: "La Juanita",
      address: "Ruta 8 Km 380",
      phone: "099 123 456",
      owner: "Juan Carlos Rodríguez",
      rut: "21.456.789-0",
      latitude: "-32.3054",
      longitude: "-58.0836",
      referenceCoordinates: "-32.3054, -58.0836"
    },
    { 
      id: "2", 
      name: "Don Timoteo",
      address: "Ruta 7 Km 125, Treinta y Tres",
      phone: "099 987 654",
      owner: "Timoteo González López",
      rut: "18.765.432-1",
      latitude: "-33.2341",
      longitude: "-54.3872",
      referenceCoordinates: "-33.2341, -54.3872"
    },
  ]);

  const mockChacras: Chacra[] = [
    {
      id: "1",
      name: "Chacra Norte",
      area: "125.5",
      regime: "propiedad",
      establishmentId: "1",
      establishmentName: "La Juanita"
    },
    {
      id: "2", 
      name: "Campo Sur",
      area: "89.2",
      regime: "arrendamiento",
      establishmentId: "1",
      establishmentName: "La Juanita"
    },
    {
      id: "3",
      name: "Potrero Este",
      area: "203.7",
      regime: "gestionando para terceros", 
      establishmentId: "2",
      establishmentName: "Don Timoteo"
    },
    {
      id: "4",
      name: "Bajo Inundable",
      area: "67.8",
      regime: "propiedad",
      establishmentId: "2", 
      establishmentName: "Don Timoteo"
    },
    {
      id: "5",
      name: "Loma Alta",
      area: "156.3",
      regime: "arrendamiento",
      establishmentId: "1",
      establishmentName: "La Juanita"
    },
    {
      id: "6",
      name: "Campo Nuevo",
      area: "92.1",
      regime: "gestionando para terceros",
      establishmentId: "2",
      establishmentName: "Don Timoteo"
    },
    {
      id: "7",
      name: "Chacra Central",
      area: "178.9",
      regime: "propiedad", 
      establishmentId: "1",
      establishmentName: "La Juanita"
    }
  ];

  const handleAddEstablishment = (newEstablishment: Establishment) => {
    setEstablishments(prev => [...prev, newEstablishment]);
  };
  
  const handleUpdateEstablishment = (updatedEstablishment: Establishment) => {
    setEstablishments(prev => 
      prev.map(est => 
        est.id === updatedEstablishment.id ? updatedEstablishment : est
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Gestión de Chacras y Polígonos
        </h2>
        <MapTabs 
          establishments={establishments}
          onAddEstablishment={handleAddEstablishment}
          onUpdateEstablishment={handleUpdateEstablishment}
        />
      </div>
      
      <ChacrasTable chacras={mockChacras} />
    </div>
  );
}