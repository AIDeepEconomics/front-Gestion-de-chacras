import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MapTabs from "./MapTabs";
import ChacrasTable from "./ChacrasTable";
import { Chacra, Establishment } from "@shared/schema";

export default function ChacrasManagement() {
  // Fetch establishments from backend
  const { data: establishments = [], isLoading } = useQuery<Establishment[]>({
    queryKey: ["/api/establishments"],
  });

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

  // Create establishment mutation
  const createMutation = useMutation({
    mutationFn: async (newEstablishment: Omit<Establishment, 'id'>) => {
      const res = await apiRequest("POST", "/api/establishments", newEstablishment);
      return await res.json();
    },
    onSuccess: (data: Establishment) => {
      queryClient.invalidateQueries({ queryKey: ["/api/establishments"] });
      // Notify MapTabs of the new establishment ID if needed
      return data;
    },
  });

  // Update establishment mutation
  const updateMutation = useMutation({
    mutationFn: async (updatedEstablishment: Establishment) => {
      const res = await apiRequest("PATCH", `/api/establishments/${updatedEstablishment.id}`, updatedEstablishment);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/establishments"] });
    },
  });

  const handleAddEstablishment = (newEstablishment: Establishment) => {
    const { id, ...establishmentData } = newEstablishment;
    createMutation.mutate(establishmentData);
  };
  
  const handleUpdateEstablishment = (updatedEstablishment: Establishment) => {
    updateMutation.mutate(updatedEstablishment);
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