import { useState } from "react";
import MillRow, { Mill } from "../MillRow";

export default function MillRowExample() {
  const [mill, setMill] = useState<Mill>({
    id: "1",
    name: "Casarone",
    shareFieldManagement: false,
    shareHarvestManagement: true,
    shareTraceabilityInfo: false,
  });

  const availableMills = ["Casarone", "Dambo", "Saman", "Arrozal 33"];

  const handleUpdate = (updatedMill: Mill) => {
    setMill(updatedMill);
    console.log("Mill updated:", updatedMill);
  };

  const handleDelete = (millId: string) => {
    console.log("Delete mill:", millId);
  };

  return (
    <div className="p-4 space-y-4">
      <MillRow
        mill={mill}
        availableMills={availableMills}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}