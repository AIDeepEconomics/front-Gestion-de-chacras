import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Silo, RiceBatch } from "@shared/schema";

const saleAssignmentFormSchema = z.object({
  saleOrderId: z.string().min(1, "ID de orden de venta es requerido"),
  amount: z.string().min(1, "Cantidad es requerida"),
  notes: z.string().optional(),
});

type SaleAssignmentFormValues = z.infer<typeof saleAssignmentFormSchema>;

interface SaleAssignmentModalProps {
  silo: Silo;
  batches: RiceBatch[];
  transferLogic: "proportional_mix" | "fifo_layers";
  onSaleAssigned?: () => void;
}

export default function SaleAssignmentModal({ 
  silo, 
  batches, 
  transferLogic, 
  onSaleAssigned 
}: SaleAssignmentModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<SaleAssignmentFormValues>({
    resolver: zodResolver(saleAssignmentFormSchema),
    defaultValues: {
      saleOrderId: "",
      amount: "",
      notes: "",
    },
  });

  const currentOccupancy = parseFloat(silo.currentOccupancy || "0");

  const calculateSalePreview = (amount: number) => {
    if (transferLogic === "proportional_mix") {
      const percentage = amount / currentOccupancy;
      return batches.map(batch => ({
        ...batch,
        saleAmount: (parseFloat(batch.tonnage) * percentage).toFixed(2)
      }));
    } else {
      // FIFO - take from oldest layers first
      const sortedBatches = [...batches].sort((a, b) => a.layerOrder - b.layerOrder);
      let remainingAmount = amount;
      return sortedBatches.map(batch => {
        const batchTonnage = parseFloat(batch.tonnage);
        const saleAmount = Math.min(remainingAmount, batchTonnage);
        remainingAmount -= saleAmount;
        return {
          ...batch,
          saleAmount: saleAmount.toFixed(2)
        };
      }).filter(batch => parseFloat(batch.saleAmount) > 0);
    }
  };

  const onSubmit = async (values: SaleAssignmentFormValues) => {
    try {
      const amount = parseFloat(values.amount);
      const salePreview = calculateSalePreview(amount);
      
      // TODO: Implement actual sale assignment logic
      console.log("Sale Assignment Details:", {
        fromSilo: silo.id,
        saleOrderId: values.saleOrderId,
        totalAmount: amount,
        transferLogic,
        batchDetails: salePreview,
        notes: values.notes
      });

      toast({
        title: "Asignación a venta exitosa",
        description: `Se asignaron ${amount} toneladas del silo ${silo.siloId} a la orden de venta ${values.saleOrderId}.`,
      });

      form.reset();
      setOpen(false);
      onSaleAssigned?.();
    } catch (error) {
      toast({
        title: "Error en asignación",
        description: "Ocurrió un error al asignar a la orden de venta. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const watchedAmount = form.watch("amount");
  const salePreview = watchedAmount ? calculateSalePreview(parseFloat(watchedAmount) || 0) : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="w-full gap-2"
          disabled={batches.length === 0}
          data-testid={`button-assign-sale-${silo.id}`}
        >
          <ShoppingCart className="h-4 w-4" />
          Asignar a Orden de Venta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Asignar a Orden de Venta - Silo {silo.siloId}</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-muted rounded-md text-sm">
          <div className="font-medium">Lógica de Asignación: {transferLogic === "proportional_mix" ? "Mezcla Proporcional" : "Manejo por Capas (FIFO)"}</div>
          <div className="text-muted-foreground">
            {transferLogic === "proportional_mix" 
              ? "Se asignará el mismo porcentaje de cada lote individual"
              : "Los lotes más antiguos (abajo) se asignarán primero"
            }
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="saleOrderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de Orden de Venta *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: OV-2024-001"
                      {...field}
                      data-testid="input-sale-order-id"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad a Asignar (toneladas) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      max={currentOccupancy.toString()}
                      {...field}
                      data-testid="input-sale-amount"
                    />
                  </FormControl>
                  <div className="text-xs text-muted-foreground">
                    Disponible: {currentOccupancy.toLocaleString()} toneladas
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Notas adicionales sobre la asignación a venta..."
                      {...field}
                      data-testid="textarea-sale-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sale Preview */}
            {salePreview.length > 0 && (
              <div className="border rounded-md p-4 bg-muted/50">
                <h4 className="font-medium mb-3">Vista Previa de Asignación</h4>
                <div className="space-y-2 text-sm">
                  {salePreview.map((batch, index) => (
                    <div key={batch.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-mono">{batch.remitoId}</span> - {batch.variety}
                        <div className="text-xs text-muted-foreground">
                          Chacra: {batch.chacraName}
                        </div>
                      </div>
                      <div className="font-medium">
                        {parseFloat(batch.saleAmount).toLocaleString()} t
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total a asignar:</span>
                    <span>{salePreview.reduce((sum, batch) => sum + parseFloat(batch.saleAmount), 0).toLocaleString()} t</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-sale"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                data-testid="button-submit-sale"
              >
                {form.formState.isSubmitting ? "Procesando..." : "Asignar a Venta"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}