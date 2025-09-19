import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertSiloSchema, type InsertSilo } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

type SiloFormValues = InsertSilo;

interface SiloFormModalProps {
  industrialPlantId: string;
  onSiloAdded?: () => void;
}

export default function SiloFormModal({ industrialPlantId, onSiloAdded }: SiloFormModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SiloFormValues>({
    resolver: zodResolver(insertSiloSchema),
    defaultValues: {
      siloId: "",
      type: "",
      maxCapacity: "",
      diameter: "",
      industrialPlantId,
    },
  });

  const createSiloMutation = useMutation({
    mutationFn: async (data: InsertSilo) => {
      return await apiRequest({
        method: 'POST',
        url: '/api/silos',
        data,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/silos', industrialPlantId] });
      toast({
        title: "Silo creado exitosamente",
        description: `El silo ha sido registrado en la planta.`,
      });
      form.reset();
      setOpen(false);
      onSiloAdded?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear silo",
        description: error?.response?.data?.error || "Ocurrió un error al intentar crear el silo.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: SiloFormValues) => {
    const siloData: InsertSilo = {
      siloId: values.siloId,
      type: values.type,
      maxCapacity: values.maxCapacity,
      diameter: values.diameter,
      industrialPlantId,
    };
    
    createSiloMutation.mutate(siloData);
  };

  const siloTypes = [
    { value: "Almacenamiento", label: "Almacenamiento" },
    { value: "Secado", label: "Secado" },
    { value: "Aireacion", label: "Aireación" },
    { value: "Limpieza", label: "Limpieza" },
    { value: "Pre-almacenamiento", label: "Pre-almacenamiento" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2" data-testid="button-add-silo">
          <Plus className="h-4 w-4" />
          Agregar Silo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Silo</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="siloId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID del Silo *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: A-1, Norte, Principal..."
                      {...field}
                      data-testid="input-silo-id"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Silo *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-silo-type">
                        <SelectValue placeholder="Seleccionar tipo de silo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {siloTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidad Máxima (toneladas) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10000"
                      step="0.01"
                      min="0"
                      {...field}
                      data-testid="input-max-capacity"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="diameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diámetro (metros) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12.5"
                      step="0.01"
                      min="0"
                      {...field}
                      data-testid="input-diameter"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-silo"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createSiloMutation.isPending}
                data-testid="button-submit-silo"
              >
                {createSiloMutation.isPending ? "Creando..." : "Crear Silo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}