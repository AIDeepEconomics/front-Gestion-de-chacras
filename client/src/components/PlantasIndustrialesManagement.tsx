import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Factory, MapPin, Phone, Edit, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PlantaIndustrial {
  id: string;
  name: string;
  address: string;
  phone: string;
  referenceCoordinates: string;
}

export default function PlantasIndustrialesManagement() {
  const [plantas, setPlantas] = useState<PlantaIndustrial[]>([
    {
      id: "1",
      name: "Planta Central",
      address: "Ruta 8 Km 245, Treinta y Tres",
      phone: "+598 4452 2345",
      referenceCoordinates: "-33.2319, -54.3833"
    },
    {
      id: "2",
      name: "Planta Norte",
      address: "Av. Artigas 1234, Artigas",
      phone: "+598 4772 8901",
      referenceCoordinates: "-30.3994, -56.5089"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [editingPlanta, setEditingPlanta] = useState<PlantaIndustrial | null>(null);

  const handleCreateNew = () => {
    const newPlanta: PlantaIndustrial = {
      id: '',
      name: '',
      address: '',
      phone: '',
      referenceCoordinates: ''
    };
    setEditingPlanta(newPlanta);
    setIsEditing(true);
    setIsCreatingNew(true);
    setIsModalOpen(true);
  };

  const handleView = (planta: PlantaIndustrial) => {
    setEditingPlanta({ ...planta });
    setIsEditing(false);
    setIsCreatingNew(false);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingPlanta) {
      if (isCreatingNew) {
        const newId = (plantas.length + 1).toString();
        const newPlanta = { ...editingPlanta, id: newId };
        setPlantas([...plantas, newPlanta]);
      } else {
        setPlantas(plantas.map(p => p.id === editingPlanta.id ? editingPlanta : p));
      }
    }
    setIsEditing(false);
    setIsCreatingNew(false);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreatingNew(false);
    if (isCreatingNew) {
      setEditingPlanta(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Gestión de Plantas Industriales
            </CardTitle>
            <Button onClick={handleCreateNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Planta Industrial
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Diseño aún en desarrollo</strong> (probablemente cambie)
            </p>
          </div>

          <div className="space-y-3">
            {plantas.map((planta) => (
              <Card key={planta.id} className="border-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Factory className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{planta.name}</h3>
                      </div>
                      
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Dirección:</span>
                          <span className="font-medium">{planta.address}</span>
                        </div>
                        
                        {planta.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Teléfono:</span>
                            <span className="font-medium">{planta.phone}</span>
                          </div>
                        )}
                        
                        {planta.referenceCoordinates && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Coordenadas:</span>
                            <span className="font-medium font-mono text-xs">{planta.referenceCoordinates}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleView(planta)}
                      className="ml-4"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Planta Industrial */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCreatingNew ? (
                <>
                  <Plus className="h-5 w-5" />
                  Nueva Planta Industrial
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  Información de Planta Industrial
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {editingPlanta && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Planta Industrial</Label>
                <Input
                  id="name"
                  value={editingPlanta.name}
                  onChange={(e) => setEditingPlanta({...editingPlanta, name: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={editingPlanta.address}
                  onChange={(e) => setEditingPlanta({...editingPlanta, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={editingPlanta.phone || ''}
                  onChange={(e) => setEditingPlanta({...editingPlanta, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coordinates">Coordenadas de Referencia</Label>
                <Input
                  id="coordinates"
                  value={editingPlanta.referenceCoordinates || ''}
                  onChange={(e) => setEditingPlanta({...editingPlanta, referenceCoordinates: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Ej: -32.3054, -58.0836"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancel}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      {isCreatingNew ? 'Crear' : 'Guardar'}
                    </Button>
                  </>
                ) : (
                  !isCreatingNew && (
                    <Button onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
