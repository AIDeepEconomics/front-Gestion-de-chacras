import { useState } from "react";
import EventRegistrationForm from "./EventRegistrationForm";
import EventsFilters, { EventFilters } from "./EventsFilters";
import EventsTable from "./EventsTable";
import { Chacra, Event, Zafra } from "@shared/schema";

export default function EventsManagementMolino() {
  const [filters, setFilters] = useState<EventFilters>({
    establishment: "all",
    zafra: "all",
    regime: "all",
    type: "all"
  });
  
  const [selectedChacras, setSelectedChacras] = useState<string[]>([]);

  // todo: remove mock functionality - comprehensive mock data for events and zafras
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
      regime: "propiedad", 
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
    },
    {
      id: "z2", 
      chacraId: "2",
      startDate: "2024-10-01",
      endDate: "2025-03-31",
      type: "pasturas",
      variety: "Festuca y trébol blanco",
      waterLevel: null,
      notes: "Rotación con pasturas"
    },
    {
      id: "z3",
      chacraId: "3",
      startDate: "2024-10-01", 
      endDate: "2025-03-31",
      type: "arroz",
      variety: "INIA Merín",
      waterLevel: "12cm",
      notes: "Zafra para terceros"
    },
    {
      id: "z4",
      chacraId: "4",
      startDate: "2024-10-01",
      endDate: "2025-03-31", 
      type: "pasturas",
      variety: "Raigrás y lotus",
      waterLevel: null,
      notes: "Campo de pastoreo"
    }
  ];

  const mockEvents: Event[] = [
    // Chacra Norte events
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
      type: "emergencia",
      date: "2024-11-02",
      details: "85% emergencia",
      notes: "Buena implantación"
    },
    {
      id: "e5",
      chacraId: "1",
      zafraId: "z1",
      type: "inundación",
      date: "2024-11-15", 
      details: "Lámina de 10cm",
      notes: "Inicio fase acuática"
    },

    // Campo Sur events  
    {
      id: "e6",
      chacraId: "2",
      zafraId: "z2",
      type: "laboreo",
      date: "2024-09-20",
      details: "Rastra de discos",
      notes: "Preparación para pasturas"
    },
    {
      id: "e7",
      chacraId: "2",
      zafraId: "z2",
      type: "siembra", 
      date: "2024-10-10",
      details: "Festuca 15kg/ha + Trébol 3kg/ha",
      notes: "Mezcla forrajera"
    },

    // Potrero Este events
    {
      id: "e8", 
      chacraId: "3",
      zafraId: "z3",
      type: "laboreo",
      date: "2024-09-10",
      details: "Arado y nivelación",
      notes: "Preparación intensiva"
    },
    {
      id: "e9",
      chacraId: "3",
      zafraId: "z3",
      type: "fertilización",
      date: "2024-10-01",
      details: "Fosfato DAP, 120 kg/ha", 
      notes: "Fertilización de base"
    },
    {
      id: "e10",
      chacraId: "3",
      zafraId: "z3",
      type: "siembra",
      date: "2024-10-25",
      details: "INIA Merín, 170 kg/ha",
      notes: "Variedad de alta productividad"
    },
    {
      id: "e11",
      chacraId: "3",
      zafraId: "z3",
      type: "aplicación",
      date: "2024-11-20",
      details: "Herbicida post-emergente",
      notes: "Control de malezas"
    },

    // Bajo Inundable events
    {
      id: "e12",
      chacraId: "4",
      zafraId: "z4", 
      type: "siembra",
      date: "2024-10-05",
      details: "Raigrás 25kg/ha + Lotus 8kg/ha",
      notes: "Pastura de invierno"
    }
  ];

  const handleFilterChange = (newFilters: EventFilters) => {
    setFilters(newFilters);
    console.log("Filters changed:", newFilters);
  };

  const handleEventRegistration = (eventData: any) => {
    if (selectedChacras.length === 0) {
      alert("Debe seleccionar al menos una chacra en la tabla de abajo");
      return;
    }
    
    const eventWithChacras = {
      ...eventData,
      selectedChacras
    };
    
    console.log("New event registered:", eventWithChacras);
    // TODO: Implement actual event creation logic
    // Clear selections after successful registration
    setSelectedChacras([]);
  };

  const handleChacraSelectionChange = (chacraId: string, selected: boolean) => {
    if (selected) {
      setSelectedChacras(prev => [...prev, chacraId]);
    } else {
      setSelectedChacras(prev => prev.filter(id => id !== chacraId));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-6">
          Gestión de Eventos y Líneas de Tiempo
        </h2>
        
        {/* Event Registration Form */}
        <EventRegistrationForm 
          onSubmit={handleEventRegistration}
        />
      </div>
      
      <div className="space-y-6">
        <EventsFilters onFilterChange={handleFilterChange} />
        
        <EventsTable 
          chacras={mockChacras}
          events={mockEvents}
          zafras={mockZafras}
          filters={filters}
          selectedChacras={selectedChacras}
          onChacraSelectionChange={handleChacraSelectionChange}
        />
      </div>
    </div>
  );
}
