import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const siloFormSchema = z.object({
  siloId: z.string().min(1, "ID del silo es requerido"),
  type: z.string().min(1, "Tipo de silo es requerido"),
  maxCapacity: z.string().min(1, "Capacidad máxima es requerida"),
  diameter: z.string().min(1, "Diámetro es requerido"),
});

type SiloFormValues = z.infer<typeof siloFormSchema>;

interface SiloFormModalProps {
  industrialPlantId: string;
  onSiloAdded?: () => void;
}

export default function SiloFormModal({ industrialPlantId, onSiloAdded }: SiloFormModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<SiloFormValues>({
    resolver: zodResolver(siloFormSchema),
    defaultValues: {
      siloId: "",
      type: "",
      maxCapacity: "",
      diameter: "",
    },
  });

  const onSubmit = async (values: SiloFormValues) => {
    try {
      // TODO: Implement API call to create silo
      console.log("Creating silo:", {
        ...values,
        industrialPlantId,
        maxCapacity: parseFloat(values.maxCapacity),
        diameter: parseFloat(values.diameter),
      });

      toast({
        title: "Silo creado exitosamente",
        description: `El silo ${values.siloId} ha sido registrado en la planta.`,
      });

      form.reset();
      setOpen(false);
      onSiloAdded?.();
    } catch (error) {
      toast({
        title: "Error al crear silo",
        description: "Ocurrió un error al intentar crear el silo. Intente nuevamente.",
        variant: "destructive",
      });
    }
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
                disabled={form.formState.isSubmitting}
                data-testid="button-submit-silo"
              >
                {form.formState.isSubmitting ? "Creando..." : "Crear Silo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}