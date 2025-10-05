import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarDays, Plus } from "lucide-react";

const eventRegistrationSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  eventType: z.string().min(1, "El tipo de evento es requerido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  
  // Campos específicos para Fertilización
  fertilizante: z.string().optional(),
  dosisFertilizante: z.string().optional(),
  
  // Campos específicos para Siembra
  variedadSemilla: z.string().optional(),
  densidadSiembra: z.string().optional(),
  
  // Campos específicos para Aplicación
  categoriaProducto: z.string().optional(),
  productoAplicado: z.string().optional(),
  dosisAplicacion: z.string().optional(),
  
  // Campos específicos para Cosecha
  rendimiento: z.string().optional(),
  
  details: z.string().optional(),
  notes: z.string().optional()
});

type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;

interface EventRegistrationFormProps {
  onSubmit: (data: EventRegistrationData) => void;
}

// Productos comunes en Uruguay para cultivo de arroz
const fertilizantes = [
  { value: "urea", label: "Urea" },
  { value: "dap", label: "Fosfato Diamónico (DAP)" },
  { value: "sulfato_amonio", label: "Sulfato de Amonio" },
  { value: "npk", label: "NPK" },
  { value: "superfosfato", label: "Superfosfato Triple" },
  { value: "otro", label: "Otro" }
];

const herbicidas = [
  { value: "glifosato", label: "Glifosato" },
  { value: "propanil", label: "Propanil" },
  { value: "bentazon", label: "Bentazon" },
  { value: "clomazone", label: "Clomazone" },
  { value: "quinclorac", label: "Quinclorac" },
  { value: "otro", label: "Otro" }
];

const insecticidas = [
  { value: "clorpirifos", label: "Clorpirifos" },
  { value: "lambda_cihalotrina", label: "Lambda Cihalotrina" },
  { value: "cipermetrina", label: "Cipermetrina" },
  { value: "fipronil", label: "Fipronil" },
  { value: "otro", label: "Otro" }
];

const fungicidas = [
  { value: "azoxistrobina", label: "Azoxistrobina" },
  { value: "trifloxistrobina", label: "Trifloxistrobina" },
  { value: "tebuconazol", label: "Tebuconazol" },
  { value: "propiconazol", label: "Propiconazol" },
  { value: "otro", label: "Otro" }
];

const variedadesSemilla = [
  { value: "el_paso_144", label: "El Paso 144" },
  { value: "inia_merín", label: "INIA Merín" },
  { value: "inia_tacuarí", label: "INIA Tacuarí" },
  { value: "parao", label: "Parao" },
  { value: "gurí_inta_cl", label: "Gurí INTA CL" },
  { value: "irga_424", label: "IRGA 424" },
  { value: "otro", label: "Otro" }
];

export default function EventRegistrationForm({ onSubmit }: EventRegistrationFormProps) {

  const form = useForm<EventRegistrationData>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      description: "",
      eventType: "",
      startDate: "",
      endDate: "",
      fertilizante: "",
      dosisFertilizante: "",
      variedadSemilla: "",
      densidadSiembra: "",
      categoriaProducto: "",
      productoAplicado: "",
      dosisAplicacion: "",
      rendimiento: "",
      details: "",
      notes: ""
    }
  });

  const eventTypes = [
    { value: "inicio_zafra", label: "Inicio de Zafra" },
    { value: "laboreo", label: "Laboreo" },
    { value: "fertilización", label: "Fertilización" },
    { value: "siembra", label: "Siembra" },
    { value: "emergencia", label: "Emergencia" },
    { value: "inundación", label: "Inundación" },
    { value: "aplicación", label: "Aplicación" },
    { value: "drenado", label: "Drenado" },
    { value: "cosecha", label: "Cosecha" },
    { value: "fin_zafra", label: "Fin de Zafra" }
  ];

  const watchedEventType = form.watch("eventType");
  const watchedCategoriaProducto = form.watch("categoriaProducto");

  const handleSubmit = (data: EventRegistrationData) => {
    onSubmit(data);
    console.log("Event registered:", data);
    
    // Reset form
    form.reset();
  };

  // Obtener productos según categoría seleccionada
  const getProductosPorCategoria = () => {
    switch (watchedCategoriaProducto) {
      case "herbicida":
        return herbicidas;
      case "insecticida":
        return insecticidas;
      case "fungicida":
        return fungicidas;
      default:
        return [];
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <span>Registrar Eventos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Event Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Evento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ej: Aplicación de fertilizante..."
                        data-testid="input-event-description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Evento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-event-type">
                          <SelectValue placeholder="Seleccionar tipo..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypes.map((type) => (
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
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Inicio / Ocurrencia</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        data-testid="input-start-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Fin (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date"
                        placeholder="Solo si es un evento de múltiples días"
                        data-testid="input-end-date"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos específicos para Fertilización */}
            {watchedEventType === "fertilización" && (
              <div className="border border-muted rounded-lg p-4 space-y-4 bg-muted/10">
                <h4 className="font-medium text-sm text-foreground">Detalles de Fertilización</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fertilizante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Fertilizante</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-fertilizante">
                              <SelectValue placeholder="Seleccionar fertilizante..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fertilizantes.map((fert) => (
                              <SelectItem key={fert.value} value={fert.value}>
                                {fert.label}
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
                    name="dosisFertilizante"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosis (kg/ha)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="Ej: 80"
                            data-testid="input-dosis-fertilizante"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Campos específicos para Siembra */}
            {watchedEventType === "siembra" && (
              <div className="border border-muted rounded-lg p-4 space-y-4 bg-muted/10">
                <h4 className="font-medium text-sm text-foreground">Detalles de Siembra</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="variedadSemilla"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Variedad de Semilla</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-variedad-semilla">
                              <SelectValue placeholder="Seleccionar variedad..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {variedadesSemilla.map((variedad) => (
                              <SelectItem key={variedad.value} value={variedad.value}>
                                {variedad.label}
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
                    name="densidadSiembra"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Densidad de Siembra (kg/ha)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="Ej: 120"
                            data-testid="input-densidad-siembra"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Campos específicos para Aplicación */}
            {watchedEventType === "aplicación" && (
              <div className="border border-muted rounded-lg p-4 space-y-4 bg-muted/10">
                <h4 className="font-medium text-sm text-foreground">Detalles de Aplicación</h4>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="categoriaProducto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría de Producto</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-categoria-producto">
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="herbicida">Herbicida</SelectItem>
                            <SelectItem value="insecticida">Insecticida</SelectItem>
                            <SelectItem value="fungicida">Fungicida</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedCategoriaProducto && (
                    <FormField
                      control={form.control}
                      name="productoAplicado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Producto Aplicado</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-producto-aplicado">
                                <SelectValue placeholder="Seleccionar producto..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getProductosPorCategoria().map((producto) => (
                                <SelectItem key={producto.value} value={producto.value}>
                                  {producto.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="dosisAplicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosis (L/ha o kg/ha)</FormLabel>
                        <FormControl>
                          <Input 
                            type="text"
                            placeholder="Ej: 2.5 L/ha"
                            data-testid="input-dosis-aplicacion"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Campos específicos para Cosecha */}
            {watchedEventType === "cosecha" && (
              <div className="border border-muted rounded-lg p-4 space-y-4 bg-muted/10">
                <h4 className="font-medium text-sm text-foreground">Detalles de Cosecha</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="rendimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rendimiento (ton/ha)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.1"
                            placeholder="Ej: 8.5"
                            data-testid="input-rendimiento"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalles Técnicos Adicionales</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Información técnica adicional..."
                        className="resize-none"
                        data-testid="textarea-details"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas Adicionales</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Observaciones generales..."
                        className="resize-none"
                        data-testid="textarea-notes"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                data-testid="button-clear-form"
              >
                Limpiar
              </Button>
              <Button 
                type="submit"
                className="bg-primary text-primary-foreground"
                data-testid="button-register-event"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Evento/s
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
