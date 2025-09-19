import ChacrasTable from "../ChacrasTable";
import { Chacra } from "@shared/schema";

export default function ChacrasTableExample() {
  // todo: remove mock functionality - comprehensive mock data with all options
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

  return (
    <div className="p-6 max-w-6xl">
      <ChacrasTable chacras={mockChacras} />
    </div>
  );
}