import { useState, useEffect } from "react";
import RemitoGenerationForm, { RemitoFormData, mockIndustrialPlants } from "./RemitoGenerationForm";
import CosechaTabs from "./CosechaTabs";
import { Chacra, Remito } from "@shared/schema";

export default function CosechaManagement() {
  const [selectedChacras, setSelectedChacras] = useState<string[]>([]);
  const [remitos, setRemitos] = useState<Remito[]>([]);

  // todo: remove mock functionality - comprehensive mock data for chacras
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

  // todo: remove mock functionality - sample remitos with different statuses
  const mockRemitos: Remito[] = [
    {
      id: "r1",
      chacraId: "1",
      chacraName: "Chacra Norte",
      truckMaxTonnage: 30,
      loadedTonnage: 28,
      driverWhatsapp: "+59899123456",
      industrialPlantId: "1",
      industrialPlantName: "Planta Arrocera del Este",
      destinationSilo: "Silo A-3",
      status: "descargado",
      createdAt: "2024-09-15T08:00:00.000Z",
      departureDateTime: "2024-09-15T10:30:00.000Z",
      arrivalDateTime: "2024-09-15T14:45:00.000Z",
      notes: null
    },
    {
      id: "r2",
      chacraId: "2",
      chacraName: "Campo Sur", 
      truckMaxTonnage: 25,
      loadedTonnage: 24,
      driverWhatsapp: "+59899234567",
      industrialPlantId: "2",
      industrialPlantName: "Molino San Fernando",
      destinationSilo: "Silo B-1",
      status: "en_viaje",
      createdAt: "2024-09-18T09:15:00.000Z",
      departureDateTime: "2024-09-18T11:00:00.000Z",
      arrivalDateTime: null,
      notes: "Carga completa"
    },
    {
      id: "r3",
      chacraId: "3",
      chacraName: "Potrero Este",
      truckMaxTonnage: 35,
      loadedTonnage: 33,
      driverWhatsapp: "+59899345678",
      industrialPlantId: "1",
      industrialPlantName: "Planta Arrocera del Este",
      destinationSilo: "Silo A-5",
      status: "cargandose",
      createdAt: "2024-09-19T07:30:00.000Z",
      departureDateTime: null,
      arrivalDateTime: null,
      notes: null
    },
    {
      id: "r4",
      chacraId: "4",
      chacraName: "Bajo Inundable",
      truckMaxTonnage: 20,
      loadedTonnage: 18,
      driverWhatsapp: "+59899456789",
      industrialPlantId: "3",
      industrialPlantName: "Cooperativa Arrocera",
      destinationSilo: null,
      status: "creado",
      createdAt: "2024-09-19T11:20:00.000Z",
      departureDateTime: null,
      arrivalDateTime: null,
      notes: "WhatsApp enviado"
    },
    {
      id: "r5",
      chacraId: "1",
      chacraName: "Chacra Norte",
      truckMaxTonnage: 30,
      loadedTonnage: 29,
      driverWhatsapp: "+59899567890",
      industrialPlantId: "4",
      industrialPlantName: "Planta Industrial del Norte",
      destinationSilo: "Silo C-2",
      status: "descargandose",
      createdAt: "2024-09-19T13:45:00.000Z",
      departureDateTime: "2024-09-19T15:30:00.000Z",
      arrivalDateTime: "2024-09-19T18:15:00.000Z",
      notes: null
    },
    {
      id: "r6",
      chacraId: "5",
      chacraName: "Loma Alta",
      truckMaxTonnage: 25,
      loadedTonnage: 22,
      driverWhatsapp: "+59899678901",
      industrialPlantId: "2",
      industrialPlantName: "Molino San Fernando",
      destinationSilo: "Silo B-3",
      status: "creandose",
      createdAt: "2024-09-19T16:00:00.000Z",
      departureDateTime: null,
      arrivalDateTime: null,
      notes: null
    }
  ];

  // Initialize remitos with mock data on component mount
  useEffect(() => {
    setRemitos(mockRemitos);
  }, []);

  const handleRemitoGeneration = (formData: RemitoFormData) => {
    if (selectedChacras.length === 0) {
      alert("Debe seleccionar al menos una chacra en la tabla de abajo");
      return;
    }
    
    // Generate remitos for each selected chacra and each form row
    const newRemitos: Remito[] = [];
    const currentTimestamp = new Date().toISOString();
    
    selectedChacras.forEach(chacraId => {
      const chacra = mockChacras.find(c => c.id === chacraId);
      if (!chacra) return;
      
      // Process each remito row from the form
      formData.remitoRows.forEach((rowData, rowIndex) => {
        const plant = mockIndustrialPlants.find(p => p.id === rowData.industrialPlantId);
        
        // Create the specified quantity of remitos for this chacra and row
        for (let i = 0; i < rowData.quantityRemitos; i++) {
          const newRemito: Remito = {
            id: `remito-${Date.now()}-${chacraId}-${rowIndex}-${i}`,
            chacraId: chacraId,
            chacraName: chacra.name,
            truckMaxTonnage: rowData.truckMaxTonnage,
            loadedTonnage: rowData.loadedTonnage, // From form input
            driverWhatsapp: rowData.driverWhatsapp,
            industrialPlantId: rowData.industrialPlantId,
            industrialPlantName: plant?.name || "Planta no encontrada",
            destinationSilo: null, // Will be assigned at plant
            status: "creandose",
            createdAt: currentTimestamp,
            departureDateTime: null,
            arrivalDateTime: null,
            notes: null
          };
          newRemitos.push(newRemito);
        }
      });
    });
    
    // Add new remitos to state
    setRemitos(prev => [...newRemitos, ...prev]);
    
    // Clear selections after successful generation
    setSelectedChacras([]);
    alert(`${newRemitos.length} remitos generados exitosamente!`);
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
          Gestión de Cosecha y Remitos
        </h2>
        
        {/* Remito Generation Form */}
        <RemitoGenerationForm 
          onSubmit={handleRemitoGeneration}
          selectedChacras={selectedChacras}
        />
      </div>
      
      <CosechaTabs
        chacras={mockChacras}
        remitos={remitos}
        selectedChacras={selectedChacras}
        onChacraSelectionChange={handleChacraSelectionChange}
      />
    </div>
  );
}