import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Info } from "lucide-react";

export interface Mill {
  id: string;
  name: string;
  shareFieldManagement: boolean;
  shareHarvestManagement: boolean;
  shareTraceabilityInfo: boolean;
}

interface MillRowProps {
  mill: Mill;
  availableMills: string[];
  onUpdate: (mill: Mill) => void;
  onDelete: (millId: string) => void;
  canDelete?: boolean;
}

const permissionDescriptions = {
  shareFieldManagement: {
    title: "Compartir Administración de Chacras y Eventos",
    description: "Permite que los propios molinos cambien las chacras y asignen eventos a las mismas. Es útil cuando el molino tiene un técnico que anota los eventos de chacra por usted. Sin embargo usted también mantiene la capacidad de agregar o editar chacras y eventos en las mismas."
  },
  shareHarvestManagement: {
    title: "Compartir Administración de Cosecha", 
    description: "Al compartir la administración de cosecha, el molino asociado podrá crear remitos a su chacra, y enviar directamente el camión a levantar el arroz con el remito creado. Sin embargo usted también mantendrá la potestad de crear y administrar los remitos."
  },
  shareTraceabilityInfo: {
    title: "Compartir Información de Trazabilidad",
    description: "Al aceptar usted compartirá los datos de trazabilidad (lista de eventos) de la o las chacras desde las que se envió arroz a ese molino."
  }
};

export default function MillRow({ mill, availableMills, onUpdate, onDelete, canDelete = true }: MillRowProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionDialog, setPermissionDialog] = useState<string | null>(null);

  const handleMillChange = (value: string) => {
    onUpdate({ ...mill, name: value });
  };

  const handlePermissionChange = (permission: keyof Mill, checked: boolean) => {
    onUpdate({ ...mill, [permission]: checked });
  };

  const handleDelete = () => {
    onDelete(mill.id);
    setDeleteDialogOpen(false);
  };

  const renderPermissionButton = (key: keyof Mill, label: string) => {
    const isChecked = mill[key] as boolean;
    const info = permissionDescriptions[key as keyof typeof permissionDescriptions];
    
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${mill.id}-${key}`}
          checked={isChecked}
          onCheckedChange={(checked) => handlePermissionChange(key, checked as boolean)}
          data-testid={`checkbox-${key}-${mill.id}`}
        />
        <label
          htmlFor={`${mill.id}-${key}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {label}
        </label>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 p-0"
          onClick={() => setPermissionDialog(key)}
          data-testid={`info-${key}-${mill.id}`}
        >
          <Info className="h-3 w-3 text-muted-foreground" />
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-border rounded-md bg-card space-x-4">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div className="min-w-48">
              <label className="text-sm font-medium text-foreground mb-1 block">
                Molino Asociado
              </label>
              <Select value={mill.name} onValueChange={handleMillChange}>
                <SelectTrigger data-testid={`select-mill-${mill.id}`}>
                  <SelectValue placeholder="Seleccionar molino" />
                </SelectTrigger>
                <SelectContent>
                  {availableMills.map((millName) => (
                    <SelectItem key={millName} value={millName}>
                      {millName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {canDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive hover:text-destructive"
                data-testid={`button-delete-${mill.id}`}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {renderPermissionButton("shareFieldManagement", "Compartir Administración de Chacras y Eventos")}
            {renderPermissionButton("shareHarvestManagement", "Compartir Administración de Cosecha")}
            {renderPermissionButton("shareTraceabilityInfo", "Compartir Información de Trazabilidad")}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que quiere eliminar este molino? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} data-testid="button-confirm-delete">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permission Info Dialog */}
      {permissionDialog && (
        <Dialog open={!!permissionDialog} onOpenChange={() => setPermissionDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {permissionDescriptions[permissionDialog as keyof typeof permissionDescriptions].title}
              </DialogTitle>
              <DialogDescription className="text-base leading-relaxed">
                {permissionDescriptions[permissionDialog as keyof typeof permissionDescriptions].description}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setPermissionDialog(null)}>
                Entendido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}