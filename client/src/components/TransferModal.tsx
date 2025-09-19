import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRightLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Silo, RiceBatch } from "@shared/schema";

const transferFormSchema = z.object({
  transferType: z.enum(["silo_to_silo", "silo_to_sale"]),
  targetSiloId: z.string().optional(),
  saleOrderId: z.string().optional(),
  amount: z.string().min(1, "Cantidad es requerida"),
  notes: z.string().optional(),
}).refine((data) => {
  if (data.transferType === "silo_to_silo" && !data.targetSiloId) {
    return false;
  }
  if (data.transferType === "silo_to_sale" && !data.saleOrderId) {
    return false;
  }
  return true;
}, {
  message: "Debe seleccionar destino válido según el tipo de trasiego",
  path: ["targetSiloId"]
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

interface TransferModalProps {
  silo: Silo;
  batches: RiceBatch[];
  transferLogic: "proportional_mix" | "fifo_layers";
  availableSilos?: Silo[];
  onTransferComplete?: () => void;
}

export default function TransferModal({ 
  silo, 
  batches, 
  transferLogic, 
  availableSilos = [], 
  onTransferComplete 
}: TransferModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      transferType: "silo_to_silo",
      targetSiloId: "",
      saleOrderId: "",
      amount: "",
      notes: "",
    },
  });

  const transferType = form.watch("transferType");
  const currentOccupancy = parseFloat(silo.currentOccupancy || "0");

  const calculateTransferPreview = (amount: number) => {
    if (transferLogic === "proportional_mix") {
      const percentage = amount / currentOccupancy;
      return batches.map(batch => ({
        ...batch,
        transferAmount: (parseFloat(batch.tonnage) * percentage).toFixed(2)
      }));
    } else {
      // FIFO - take from oldest layers first
      const sortedBatches = [...batches].sort((a, b) => a.layerOrder - b.layerOrder);
      let remainingAmount = amount;
      return sortedBatches.map(batch => {
        const batchTonnage = parseFloat(batch.tonnage);
        const transferAmount = Math.min(remainingAmount, batchTonnage);
        remainingAmount -= transferAmount;
        return {
          ...batch,
          transferAmount: transferAmount.toFixed(2)
        };
      }).filter(batch => parseFloat(batch.transferAmount) > 0);
    }
  };

  const onSubmit = async (values: TransferFormValues) => {
    try {
      const amount = parseFloat(values.amount);
      const transferPreview = calculateTransferPreview(amount);
      
      // TODO: Implement actual transfer logic
      console.log("Transfer Details:", {
        fromSilo: silo.id,
        transferType: values.transferType,
        targetSiloId: values.targetSiloId,
        saleOrderId: values.saleOrderId,
        totalAmount: amount,
        transferLogic,
        batchDetails: transferPreview,
        notes: values.notes
      });

      toast({
        title: "Trasiego realizado exitosamente",
        description: `Se transfirieron ${amount} toneladas del silo ${silo.siloId} usando lógica ${transferLogic === "proportional_mix" ? "proporcional" : "FIFO"}.`,
      });

      form.reset();
      setOpen(false);
      onTransferComplete?.();
    } catch (error) {
      toast({
        title: "Error en trasiego",
        description: "Ocurrió un error al realizar el trasiego. Intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const watchedAmount = form.watch("amount");
  const transferPreview = watchedAmount ? calculateTransferPreview(parseFloat(watchedAmount) || 0) : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-2"
          disabled={batches.length === 0}
          data-testid={`button-transfer-${silo.id}`}
        >
          <ArrowRightLeft className="h-4 w-4" />
          Trasiego entre Silos
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trasiego - Silo {silo.siloId}</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-3 bg-muted rounded-md text-sm">
          <div className="font-medium">Lógica de Trasiego: {transferLogic === "proportional_mix" ? "Mezcla Proporcional" : "Manejo por Capas (FIFO)"}</div>
          <div className="text-muted-foreground">
            {transferLogic === "proportional_mix" 
              ? "Se extraerá el mismo porcentaje de cada lote individual"
              : "Los lotes más antiguos (abajo) salen primero"
            }
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="transferType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Trasiego</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex space-x-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="silo_to_silo" id="silo_to_silo" />
                        <Label htmlFor="silo_to_silo">Entre Silos</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="silo_to_sale" id="silo_to_sale" />
                        <Label htmlFor="silo_to_sale">Asignar a Venta</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {transferType === "silo_to_silo" && (
              <FormField
                control={form.control}
                name="targetSiloId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Silo Destino</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-target-silo">
                          <SelectValue placeholder="Seleccionar silo destino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSilos
                          .filter(s => s.id !== silo.id)
                          .map((targetSilo) => (
                          <SelectItem key={targetSilo.id} value={targetSilo.id}>
                            Silo {targetSilo.siloId} - {targetSilo.type} 
                            ({parseFloat(targetSilo.currentOccupancy || "0").toLocaleString()}/{parseFloat(targetSilo.maxCapacity || "0").toLocaleString()} t)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {transferType === "silo_to_sale" && (
              <FormField
                control={form.control}
                name="saleOrderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID de Orden de Venta</FormLabel>
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
            )}

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad a Transferir (toneladas)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      max={currentOccupancy.toString()}
                      {...field}
                      data-testid="input-transfer-amount"
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
                      placeholder="Notas adicionales sobre el trasiego..."
                      {...field}
                      data-testid="textarea-transfer-notes"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transfer Preview */}
            {transferPreview.length > 0 && (
              <div className="border rounded-md p-4 bg-muted/50">
                <h4 className="font-medium mb-3">Vista Previa del Trasiego</h4>
                <div className="space-y-2 text-sm">
                  {transferPreview.map((batch, index) => (
                    <div key={batch.id} className="flex justify-between items-center">
                      <div>
                        <span className="font-mono">{batch.remitoId}</span> - {batch.variety}
                      </div>
                      <div className="font-medium">
                        {parseFloat(batch.transferAmount).toLocaleString()} t
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{transferPreview.reduce((sum, batch) => sum + parseFloat(batch.transferAmount), 0).toLocaleString()} t</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-transfer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                data-testid="button-submit-transfer"
              >
                {form.formState.isSubmitting ? "Procesando..." : "Realizar Trasiego"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}