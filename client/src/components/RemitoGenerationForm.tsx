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
import { Chacra } from "@shared/schema";

const remitoRowSchema = z.object({
  estimatedWeight: z.number().min(1, "El peso estimado es requerido"),
  trailerPlate: z.string().min(1, "La matrícula de la zorra es requerida"),
  driverName: z.string().min(1, "El nombre del camionero es requerido"),
  driverWhatsapp: z.string().min(1, "El WhatsApp del camionero es requerido"),
  industrialPlantId: z.string().min(1, "La planta industrial es requerida"),
  chacraId: z.string().optional()
});

const remitoFormSchema = z.object({
  remitoRows: z.array(remitoRowSchema).min(1, "Debe tener al menos una fila de remitos")
});

export type RemitoFormData = z.infer<typeof remitoFormSchema>;
export type RemitoRowData = z.infer<typeof remitoRowSchema>;

interface RemitoGenerationFormProps {
  onSubmit: (data: RemitoFormData) => void;
  selectedChacras: string[];
  chacras: Chacra[];
}


// Mock industrial plants data
export const mockIndustrialPlants = [
  { id: "1", name: "Planta Arrocera del Este", location: "Treinta y Tres" },
  { id: "2", name: "Molino San Fernando", location: "Rocha" },
  { id: "3", name: "Cooperativa Arrocera", location: "Cerro Largo" },
  { id: "4", name: "Planta Industrial del Norte", location: "Tacuarembó" }
];

export default function RemitoGenerationForm({ onSubmit, selectedChacras, chacras }: RemitoGenerationFormProps) {
  const [remitoRowsCount, setRemitoRowsCount] = useState(1);

  const form = useForm<RemitoFormData>({
    resolver: zodResolver(remitoFormSchema),
    defaultValues: {
      remitoRows: [{
        estimatedWeight: 0,
        trailerPlate: "",
        driverName: "",
        driverWhatsapp: "",
        industrialPlantId: "",
        chacraId: ""
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
          estimatedWeight: 0,
          trailerPlate: "",
          driverName: "",
          driverWhatsapp: "",
          industrialPlantId: "",
          chacraId: ""
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
    // Check if at least one remito row has a chacra selected
    const hasChacraSelected = data.remitoRows.some(row => row.chacraId && row.chacraId.trim() !== '');
    
    if (!hasChacraSelected) {
      alert("Debe seleccionar una chacra para al menos un remito");
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

                  {/* Display selected chacra if exists */}
                  {watchedRows[index]?.chacraId && (
                    <div className="bg-muted/30 rounded-md p-3 mb-4">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Chacra seleccionada:</span>{' '}
                        {chacras.find(c => c.id === watchedRows[index]?.chacraId)?.name || 'N/A'}
                        {' - '}
                        {chacras.find(c => c.id === watchedRows[index]?.chacraId)?.area} ha
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Chacra Selection */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.chacraId` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chacra de Origen</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid={`select-chacra-${index}`}>
                                <SelectValue placeholder="Seleccionar chacra..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedChacras.map((chacraId) => {
                                const chacra = chacras.find(c => c.id === chacraId);
                                return chacra ? (
                                  <SelectItem key={chacra.id} value={chacra.id}>
                                    {chacra.name} ({chacra.area} ha)
                                  </SelectItem>
                                ) : null;
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Estimated Weight */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.estimatedWeight` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso Estimado (ton)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max="999"
                              placeholder="Ej: 25"
                              data-testid={`input-estimated-weight-${index}`}
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Trailer Plate */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.trailerPlate` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Matrícula de la Zorra</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Ej: SAA 1234"
                              data-testid={`input-trailer-plate-${index}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Driver Name */}
                    <FormField
                      control={form.control}
                      name={`remitoRows.${index}.driverName` as const}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Camionero</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Ej: Juan Pérez"
                              data-testid={`input-driver-name-${index}`}
                              {...field}
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