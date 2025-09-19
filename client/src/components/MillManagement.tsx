import { useState } from "react";
import { Button } from "@/components/ui/button";
import MillRow, { Mill } from "./MillRow";
import { Plus } from "lucide-react";

const AVAILABLE_MILLS = ["Casarone", "Dambo", "Saman", "Arrozal 33"];

export default function MillManagement() {
  // todo: remove mock functionality - this will be replaced with real data
  const [mills, setMills] = useState<Mill[]>([
    {
      id: "1",
      name: "Casarone",
      shareFieldManagement: false,
      shareHarvestManagement: false,
      shareTraceabilityInfo: false,
    }
  ]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addNewMill = () => {
    const newMill: Mill = {
      id: generateId(),
      name: "",
      shareFieldManagement: false,
      shareHarvestManagement: false,
      shareTraceabilityInfo: false,
    };
    setMills([...mills, newMill]);
    console.log("New mill added");
  };

  const updateMill = (updatedMill: Mill) => {
    setMills(mills.map(mill => 
      mill.id === updatedMill.id ? updatedMill : mill
    ));
    console.log("Mill updated:", updatedMill);
  };

  const deleteMill = (millId: string) => {
    setMills(mills.filter(mill => mill.id !== millId));
    console.log("Mill deleted:", millId);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Gestión de Molinos Asociados
        </h2>
        
        <div className="space-y-4">
          {mills.map((mill, index) => (
            <MillRow
              key={mill.id}
              mill={mill}
              availableMills={AVAILABLE_MILLS}
              onUpdate={updateMill}
              onDelete={deleteMill}
              canDelete={mills.length > 1}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={addNewMill}
          className="w-full border-dashed"
          data-testid="button-add-mill"
        >
          <Plus className="h-4 w-4 mr-2" />
          Agregar Nuevo Molino
        </Button>
      </div>
    </div>
  );
}