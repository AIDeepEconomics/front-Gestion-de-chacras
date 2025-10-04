import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Map, Plus, Eye, Edit, Phone, MapPin, Info, Share2 } from "lucide-react";
import { Establishment } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


interface MapTabsProps {
  establishments: Establishment[];
  onAddEstablishment?: (newEstablishment: Establishment) => void;
  onUpdateEstablishment?: (establishment: Establishment) => void;
  sharedEstablishmentIds?: string[];
}

export default function MapTabs({ establishments, onAddEstablishment, onUpdateEstablishment, sharedEstablishmentIds = [] }: MapTabsProps) {
  const [activeTab, setActiveTab] = useState(establishments[0]?.id || "new");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<Establishment | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
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
    if (editingEstablishment && editingEstablishment.adminEmail && editingEstablishment.adminEmail.trim()) {
      setPendingEstablishment(editingEstablishment);
      setIsConfirmationOpen(true);
    } else {
      confirmSaveEstablishment(editingEstablishment);
    }
  };

  const confirmSaveEstablishment = (establishment: Establishment | null) => {
    if (establishment) {
      if (isCreatingNew) {
        const newId = (establishments.length + 1).toString();
        const newEstablishment = { ...establishment, id: newId };
        if (onAddEstablishment) {
          onAddEstablishment(newEstablishment);
        }
        setActiveTab(newId);
      } else if (onUpdateEstablishment) {
        onUpdateEstablishment(establishment);
      }
    }
    setIsEditing(false);
    setIsCreatingNew(false);
    setIsModalOpen(false);
    setIsConfirmationOpen(false);
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
        {tabs.map((tab) => {
          const isShared = tab.id !== "new" && sharedEstablishmentIds.includes(tab.id);
          const isActive = activeTab === tab.id;
          
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`px-4 py-2 rounded-none border-b-2 transition-colors ${
                isActive
                  ? isShared 
                    ? "border-blue-500 text-blue-600" 
                    : "border-primary text-primary"
                  : isShared
                    ? "border-transparent text-blue-600 hover:text-blue-700"
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
              {isShared && <Share2 className="h-3 w-3 mr-1.5" />}
              {tab.name}
            </Button>
          );
        })}
      </div>

      {/* Información del Establecimiento */}
      {currentEstablishment && activeTab !== "new" && (
        <Card className="w-full mb-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              {sharedEstablishmentIds.includes(currentEstablishment.id) && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
                  <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-medium text-blue-700 dark:text-blue-300">Establecimiento Compartido</span>
                    <span className="text-blue-600 dark:text-blue-400"> - Compartido por {currentEstablishment.owner}</span>
                  </div>
                </div>
              )}
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
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="h-5 w-5 p-0"
                          data-testid="button-admin-info"
                        >
                          <Info className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-sm">
                        <p>
                          Designar un Usuario como administrador de este establecimiento hará que el establecimiento 
                          aparezca en la sesión de ese usuario, el cual podrá editar y controlar todo el establecimiento. 
                          Por default, usted mantendrá todos los permisos para también editar el establecimiento, pero 
                          el usuario administrador puede retirarle los permisos luego si lo desea. Esta opción es útil 
                          si usted quiere subir la información de un establecimiento de un productor para ahorrarle el 
                          trabajo al mismo, pudiéndole entregar el control del mismo luego.
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

      {/* Modal de Confirmación de Asignación de Administrador */}
      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Asignación de Administrador</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea asignar el email{' '}
              <span className="font-semibold">{pendingEstablishment?.adminEmail}</span>{' '}
              como administrador de este establecimiento?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsConfirmationOpen(false);
                setPendingEstablishment(null);
              }}
              data-testid="button-cancel-confirmation"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => confirmSaveEstablishment(pendingEstablishment)}
              data-testid="button-confirm-admin-assignment"
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}