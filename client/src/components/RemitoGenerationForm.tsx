import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Truck, Plus, Minus } from "lucide-react";

const remitoRowSchema = z.object({
  truckMaxTonnage: z.number().min(1, "El tonelaje máximo es requerido"),
  loadedTonnage: z.number().min(1, "La cantidad de toneladas es requerida"),
  quantityRemitos: z.number().min(1, "La cantidad de remitos es requerida").max(999, "Máximo 999 remitos"),
  driverWhatsapp: z.string().min(1, "El WhatsApp del camionero es requerido"),
  industrialPlantId: z.string().min(1, "La planta industrial es requerida")
});

const remitoFormSchema = z.object({
  remitoRows: z.array(remitoRowSchema).min(1, "Debe tener al menos una fila de remitos")
});

export type RemitoFormData = z.infer<typeof remitoFormSchema>;
export type RemitoRowData = z.infer<typeof remitoRowSchema>;

interface RemitoGenerationFormProps {
  onSubmit: (data: RemitoFormData) => void;
  selectedChacras: string[];
}

// Standard truck tonnage options used in the industry
const truckTonnageOptions = [
  { value: 15, label: "15 toneladas" },
  { value: 20, label: "20 toneladas" },
  { value: 25, label: "25 toneladas" },
  { value: 30, label: "30 toneladas" },
  { value: 35, label: "35 toneladas" },
  { value: 40, label: "40 toneladas" }
];

// Mock industrial plants data
export const mockIndustrialPlants = [
  { id: "1", name: "Planta Arrocera del Este", location: "Treinta y Tres" },
  { id: "2", name: "Molino San Fernando", location: "Rocha" },
  { id: "3", name: "Cooperativa Arrocera", location: "Cerro Largo" },
  { id: "4", name: "Planta Industrial del Norte", location: "Tacuarembó" }
];

export default function RemitoGenerationForm({ onSubmit, selectedChacras }: RemitoGenerationFormProps) {
  const [remitoRowsCount, setRemitoRowsCount] = useState(1);

  const form = useForm<RemitoFormData>({
    resolver: zodResolver(remitoFormSchema),
    defaultValues: {
      remitoRows: [{
        truckMaxTonnage: 0,
        loadedTonnage: 0,
        quantityRemitos: 1,
        driverWhatsapp: "",
        industrialPlantId: ""
      }]
    }
  });

  const addRemitoRow = () => {
    if (remitoRowsCount < 5) { // Limit to 5 rows for UI purposes
      setRemitoRowsCount(prev => prev + 1);
      const currentRows = form.getValues("remitoRows");
      form.setValue("remitoRows", [
        ...currentRows,
        {
          truckMaxTonnage: 0,
          loadedTonnage: 0,
          quantityRemitos: 1,
          driverWhatsapp: "",
          industrialPlantId: ""
        }
      ]);
    }
  };

  const removeRemitoRow = (index: number) => {
    if (remitoRowsCount > 1) {
      setRemitoRowsCount(prev => prev - 1);
      const currentRows = form.getValues("remitoRows");
      const newRows = currentRows.filter((_, i) => i !== index);
      form.setValue("remitoRows", newRows);
    }
  };

  const handleSubmit = (data: RemitoFormData) => {
    if (selectedChacras.length === 0) {
      alert("Debe seleccionar al menos una chacra en la tabla de abajo");
      return;
    }

    console.log("Generating remitos:", data);
    onSubmit(data);
    
    // Reset form
    form.reset();
    setRemitoRowsCount(1);
  };

  const watchedRows = form.watch("remitoRows");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-primary" />
          <span>Generar Remitos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Remito Rows */}
            <div className="space-y-4">
              {watchedRows.map((_, index) => (
                <div key={index} className="border rounded-md p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">
                      Remito {index + 1}
                    </h4>
                    {remitoRowsCount > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRemitoRow(index)}
                        data-testid={`button-remove-remito-${index}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Truck Max Tonnage */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.truckMaxTonnage` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tonelaje Máximo</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString() || ""}
                          >
                            <FormControl>
                              <SelectTrigger data-testid={`select-max-tonnage-${index}`}>
                                <SelectValue placeholder="Seleccionar..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {truckTonnageOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Loaded Tonnage */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.loadedTonnage` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Toneladas a Cargar</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max={watchedRows[index]?.truckMaxTonnage || 999}
                              placeholder="Ej: 25"
                              data-testid={`input-loaded-tonnage-${index}`}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Quantity of Remitos */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.quantityRemitos` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad de Remitos</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="999"
                              placeholder="Ej: 3"
                              data-testid={`input-quantity-remitos-${index}`}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Driver WhatsApp */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.driverWhatsapp` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>WhatsApp Camionero</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Ej: +59899123456"
                              data-testid={`input-driver-whatsapp-${index}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Industrial Plant */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.industrialPlantId` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Planta Industrial</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid={`select-industrial-plant-${index}`}>
                                <SelectValue placeholder="Seleccionar..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockIndustrialPlants.map((plant) => (
                                <SelectItem key={plant.id} value={plant.id}>
                                  {plant.name} - {plant.location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}

              {/* Add More Remitos Button */}
              {remitoRowsCount < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRemitoRow}
                  className="w-full"
                  data-testid="button-add-remito-row"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Crear más remitos
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground"
                data-testid="button-generate-remitos"
              >
                <Truck className="h-4 w-4 mr-2" />
                Generar Remitos
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}