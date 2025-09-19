import EventRegistrationForm from "../EventRegistrationForm";
import { Chacra } from "@shared/schema";

export default function EventRegistrationFormExample() {
  // todo: remove mock functionality - sample chacras for form
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
    }
  ];

  const handleEventSubmit = (data: any) => {
    console.log("Event registration submitted:", data);
    alert("Evento registrado exitosamente!");
  };

  return (
    <div className="p-6 max-w-6xl">
      <EventRegistrationForm 
        onSubmit={handleEventSubmit}
        selectedChacras={[]}
      />
    </div>
  );
}