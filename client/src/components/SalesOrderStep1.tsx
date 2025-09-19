import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, X } from "lucide-react";
import { OrderGeneralData } from "./SalesOrderWizard";

const step1Schema = z.object({
  clientName: z.string().min(1, "Nombre del cliente es requerido"),
  destination: z.string().min(1, "Destino es requerido"),
  totalTonnage: z.string().min(1, "Cantidad total es requerida"),
  variety: z.string().optional(),
  moisture: z.string().optional(),
  purity: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  estimatedDeliveryDate: z.string().min(1, "Fecha estimada de entrega es requerida"),
  notes: z.string().optional(),
});

type Step1FormValues = z.infer<typeof step1Schema>;

interface SalesOrderStep1Props {
  data: OrderGeneralData;
  onDataChange: (data: OrderGeneralData) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function SalesOrderStep1({ data, onDataChange, onNext, onCancel }: SalesOrderStep1Props) {
  const form = useForm<Step1FormValues>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      clientName: data.clientName,
      destination: data.destination,
      totalTonnage: data.totalTonnage,
      variety: data.qualityRequirements.variety || "",
      moisture: data.qualityRequirements.moisture || "",
      purity: data.qualityRequirements.purity || "",
      certifications: data.qualityRequirements.certifications || [],
      estimatedDeliveryDate: data.estimatedDeliveryDate,
      notes: data.notes,
    },
  });

  const availableCertifications = [
    "Orgánico",
    "Comercio Justo",
    "Rainforest Alliance",
    "GlobalGAP",
    "ISO 14001",
    "RTRS (Soja Responsable)",
  ];

  const onSubmit = (values: Step1FormValues) => {
    const updatedData: OrderGeneralData = {
      clientName: values.clientName,
      destination: values.destination,
      totalTonnage: values.totalTonnage,
      qualityRequirements: {
        variety: values.variety,
        moisture: values.moisture,
        purity: values.purity,
        certifications: values.certifications,
      },
      estimatedDeliveryDate: values.estimatedDeliveryDate,
      notes: values.notes || "",
    };

    onDataChange(updatedData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Paso 1 de 3: Ingrese los datos generales de la orden de venta
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Información Básica */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Cliente *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Cooperativa Tacuarembó"
                          {...field}
                          data-testid="input-client-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destino *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Montevideo"
                          {...field}
                          data-testid="input-destination"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalTonnage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad Total Requerida (toneladas) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          step="0.01"
                          min="0"
                          {...field}
                          data-testid="input-total-tonnage"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="estimatedDeliveryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Estimada de Entrega *</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          data-testid="input-delivery-date"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Requerimientos de Calidad */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Requerimientos de Calidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="variety"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variedad Preferida</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: INIA Olimar"
                          {...field}
                          data-testid="input-variety"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="moisture"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Humedad Máxima</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: 14%"
                          {...field}
                          data-testid="input-moisture"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pureza Mínima</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: 98%"
                          {...field}
                          data-testid="input-purity"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Certificaciones */}
              <FormField
                control={form.control}
                name="certifications"
                render={() => (
                  <FormItem>
                    <FormLabel>Certificaciones Requeridas</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableCertifications.map((certification) => (
                        <FormField
                          key={certification}
                          control={form.control}
                          name="certifications"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={certification}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(certification)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), certification])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== certification
                                            )
                                          );
                                    }}
                                    data-testid={`checkbox-cert-${certification.toLowerCase().replace(/\s+/g, '-')}`}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {certification}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Notas Adicionales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notas Adicionales</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas y Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Información adicional sobre la orden..."
                        {...field}
                        data-testid="textarea-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="gap-2"
              data-testid="button-cancel-step1"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              type="submit"
              className="gap-2"
              data-testid="button-next-step1"
            >
              Continuar
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}