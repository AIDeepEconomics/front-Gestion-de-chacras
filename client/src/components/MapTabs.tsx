import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Map, Plus, Eye, Edit, Phone, MapPin, Info } from "lucide-react";
import { Establishment } from "@shared/schema";


interface MapTabsProps {
  establishments: Establishment[];
  onAddEstablishment?: (newEstablishment: Establishment) => void;
  onUpdateEstablishment?: (establishment: Establishment) => void;
}

export default function MapTabs({ establishments, onAddEstablishment, onUpdateEstablishment }: MapTabsProps) {
  const [activeTab, setActiveTab] = useState(establishments[0]?.id || "new");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingEstablishment, setPendingEstablishment] = useState<Establishment | null>(null);
  
  const currentEstablishment = establishments.find(e => e.id === activeTab);
  
  const handleViewEstablishment = (establishment: Establishment) => {
    setEditingEstablishment({ ...establishment });
    setIsEditing(false);
    setIsCreatingNew(false);
    setIsModalOpen(true);
  };
  
  const handleCreateNewEstablishment = () => {
    const newEstablishment: Establishment = {
      id: '',
      name: '',
      address: '',
      phone: '',
      owner: '',
      rut: '',
      latitude: '',
      longitude: '',
      referenceCoordinates: '',
      adminEmail: null
    };
    setEditingEstablishment(newEstablishment);
    setIsEditing(true);
    setIsCreatingNew(true);
    setIsModalOpen(true);
  };
  
  const handleEditEstablishment = () => {
    setIsEditing(true);
  };
  
  const handleSaveEstablishment = () => {
    if (editingEstablishment) {
      // Check if adminEmail is being assigned
      if (editingEstablishment.adminEmail && editingEstablishment.adminEmail.trim() !== '') {
        // Show confirmation dialog
        setPendingEstablishment(editingEstablishment);
        setIsConfirmDialogOpen(true);
      } else {
        // No admin email, proceed directly
        proceedWithSave(editingEstablishment);
      }
    }
  };

  const proceedWithSave = (establishment: Establishment) => {
    if (isCreatingNew) {
      // Generate a simple ID for new establishment
      const newId = (establishments.length + 1).toString();
      const newEstablishment = { ...establishment, id: newId };
      if (onAddEstablishment) {
        onAddEstablishment(newEstablishment);
      }
      // Switch to the new establishment tab
      setActiveTab(newId);
    } else if (onUpdateEstablishment) {
      onUpdateEstablishment(establishment);
    }
    setIsEditing(false);
    setIsCreatingNew(false);
    setIsModalOpen(false);
    setIsConfirmDialogOpen(false);
    setPendingEstablishment(null);
  };

  const handleConfirmAssignment = () => {
    if (pendingEstablishment) {
      proceedWithSave(pendingEstablishment);
    }
  };

  const handleCancelAssignment = () => {
    setIsConfirmDialogOpen(false);
    setPendingEstablishment(null);
  };
  
  const handleCancelEdit = () => {
    if (isCreatingNew) {
      setEditingEstablishment(null);
    } else if (currentEstablishment) {
      setEditingEstablishment({ ...currentEstablishment });
    }
    setIsEditing(false);
    setIsCreatingNew(false);
  };

  const tabs = [
    ...establishments,
    { id: "new", name: "Nuevo Establecimiento" }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-border">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`px-4 py-2 rounded-none border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "new") {
                handleCreateNewEstablishment();
              }
            }}
            data-testid={`tab-establishment-${tab.id}`}
          >
            {tab.id === "new" && <Plus className="h-4 w-4 mr-2" />}
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Información del Establecimiento */}
      {currentEstablishment && activeTab !== "new" && (
        <Card className="w-full mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Dirección:</span>
                  <span className="font-medium" data-testid="text-establishment-address">{currentEstablishment.address}</span>
                </div>
                {currentEstablishment.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Teléfono:</span>
                    <span className="font-medium" data-testid="text-establishment-phone">{currentEstablishment.phone}</span>
                  </div>
                )}
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleViewEstablishment(currentEstablishment)}
                data-testid="button-view-establishment"
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Display */}
      <Card className="w-full h-80">
        <CardContent className="flex items-center justify-center h-full p-0">
          <div className="text-center space-y-4">
            <div className="p-4 bg-muted rounded-full inline-block">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {activeTab === "new" 
                  ? "Nuevo Establecimiento" 
                  : tabs.find(t => t.id === activeTab)?.name
                }
              </h3>
              <p className="text-muted-foreground">
                Mapa del establecimiento
              </p>
              {activeTab !== "new" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Mostrando polígonos y chacras del establecimiento
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Información del Establecimiento */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isCreatingNew ? (
                <>
                  <Plus className="h-5 w-5" />
                  Nuevo Establecimiento
                </>
              ) : (
                <>
                  <Eye className="h-5 w-5" />
                  Información del Establecimiento
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {editingEstablishment && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={editingEstablishment.name}
                  onChange={(e) => setEditingEstablishment({...editingEstablishment, name: e.target.value})}
                  disabled={!isEditing}
                  data-testid="input-establishment-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={editingEstablishment.address}
                  onChange={(e) => setEditingEstablishment({...editingEstablishment, address: e.target.value})}
                  disabled={!isEditing}
                  data-testid="input-establishment-address"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={editingEstablishment.phone || ''}
                  onChange={(e) => setEditingEstablishment({...editingEstablishment, phone: e.target.value})}
                  disabled={!isEditing}
                  data-testid="input-establishment-phone"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">Propietario</Label>
                <Input
                  id="owner"
                  value={editingEstablishment.owner}
                  onChange={(e) => setEditingEstablishment({...editingEstablishment, owner: e.target.value})}
                  disabled={!isEditing}
                  data-testid="input-establishment-owner"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rut">RUT</Label>
                <Input
                  id="rut"
                  value={editingEstablishment.rut}
                  onChange={(e) => setEditingEstablishment({...editingEstablishment, rut: e.target.value})}
                  disabled={!isEditing}
                  data-testid="input-establishment-rut"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coordinates">Coordenadas de Referencia</Label>
                <Input
                  id="coordinates"
                  value={editingEstablishment.referenceCoordinates || ''}
                  onChange={(e) => setEditingEstablishment({...editingEstablishment, referenceCoordinates: e.target.value})}
                  disabled={!isEditing}
                  placeholder="Ej: -32.3054, -58.0836"
                  data-testid="input-establishment-coordinates"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="adminEmail">Asignar Usuario como Administrador</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-help" data-testid="icon-admin-info" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p className="text-sm">
                          Designar un Usuario como administrador de este establecimiento hará que el establecimiento aparezca en la sesión de ese usuario, el cual podrá editar y controlar todo el establecimiento. Por default, usted mantendrá todos los permisos para también editar el establecimiento, pero el usuario administrador puede retirarle los permisos luego si lo desea. Esta opción es útil si usted quiere subir la información de un establecimiento de un productor para ahorrarle el trabajo al mismo, pudiéndole entregarle el control del mismo luego.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="adminEmail"
                  type="email"
                  value={editingEstablishment.adminEmail || ''}
                  onChange={(e) => setEditingEstablishment({...editingEstablishment, adminEmail: e.target.value})}
                  disabled={!isEditing}
                  placeholder="email@ejemplo.com"
                  data-testid="input-establishment-admin-email"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelEdit}
                      data-testid="button-cancel-edit"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleSaveEstablishment}
                      data-testid="button-save-establishment"
                    >
                      {isCreatingNew ? 'Crear' : 'Guardar'}
                    </Button>
                  </>
                ) : (
                  !isCreatingNew && (
                    <Button 
                      onClick={handleEditEstablishment}
                      data-testid="button-edit-establishment"
                    >
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

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent data-testid="dialog-confirm-admin">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Asignación de Administrador</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea asignar a <strong>{pendingEstablishment?.adminEmail}</strong> como administrador de este establecimiento? Esta acción permitirá que ese usuario tenga control total sobre el establecimiento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelAssignment} data-testid="button-cancel-confirm">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAssignment} data-testid="button-confirm-admin">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}