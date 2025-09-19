import Timeline from "../Timeline";
import { Event, Zafra } from "@shared/schema";

export default function TimelineExample() {
  // todo: remove mock functionality - sample timeline data
  const mockEvents: Event[] = [
    {
      id: "e1",
      chacraId: "1",
      zafraId: "z1",
      type: "laboreo",
      date: "2024-09-15",
      details: "Arado y rastreado",
      notes: "Preparación del suelo"
    },
    {
      id: "e2",
      chacraId: "1",
      zafraId: "z1",
      type: "fertilización",
      date: "2024-10-05",
      details: "Urea, 80 kg/ha",
      notes: "Fertilización base"
    },
    {
      id: "e3",
      chacraId: "1",
      zafraId: "z1",
      type: "siembra",
      date: "2024-10-20",
      details: "INIA Olimar, 160 kg/ha",
      notes: "Siembra directa"
    },
    {
      id: "e4",
      chacraId: "1",
      zafraId: "z1",
      type: "inundación",
      date: "2024-11-15",
      details: "Lámina de 10cm",
      notes: "Inicio fase acuática"
    }
  ];

  const mockZafras: Zafra[] = [
    {
      id: "z1",
      chacraId: "1",
      startDate: "2024-10-01",
      endDate: "2025-03-31",
      type: "arroz",
      variety: "INIA Olimar",
      waterLevel: "10cm",
      notes: "Zafra actual"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Timeline Compacta</h3>
        <Timeline
          events={mockEvents}
          zafras={mockZafras}
          isCompact={true}
          onEventClick={(event) => console.log('Compact timeline event:', event)}
        />
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Timeline Detallada</h3>
        <Timeline
          events={mockEvents}
          zafras={mockZafras}
          monthsToShow={8}
          isCompact={false}
          onEventClick={(event) => console.log('Detailed timeline event:', event)}
        />
      </div>
    </div>
  );
}