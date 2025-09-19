import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CalendarDays, Plus } from "lucide-react";
import { Chacra } from "@shared/schema";

const eventRegistrationSchema = z.object({
  description: z.string().min(1, "La descripción es requerida"),
  eventType: z.string().min(1, "El tipo de evento es requerido"),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().optional(),
  details: z.string().optional(),
  notes: z.string().optional()
});

type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;

interface EventRegistrationFormProps {
  onSubmit: (data: EventRegistrationData) => void;
  selectedChacras: string[];
}

export default function EventRegistrationForm({ onSubmit, selectedChacras }: EventRegistrationFormProps) {

  const form = useForm<EventRegistrationData>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      description: "",
      eventType: "",
      startDate: "",
      endDate: "",
      details: "",
      notes: ""
    }
  });

  const eventTypes = [
    { value: "laboreo", label: "Laboreo" },
    { value: "fertilización", label: "Fertilización" },
    { value: "siembra", label: "Siembra" },
    { value: "emergencia", label: "Emergencia" },
    { value: "inundación", label: "Inundación" },
    { value: "aplicación", label: "Aplicación" },
    { value: "drenado", label: "Drenado" },
    { value: "cosecha", label: "Cosecha" }
  ];


  const handleSubmit = (data: EventRegistrationData) => {
    if (selectedChacras.length === 0) {
      alert("Debe seleccionar al menos una chacra en la tabla de abajo");
      return;
    }
    
    const eventData = {
      ...data,
      selectedChacras
    };
    onSubmit(eventData);
    console.log("Event registered:", eventData);
    
    // Reset form
    form.reset();
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

            {/* Additional Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detalles Técnicos</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ej: Urea, 80 kg/ha"
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

            {/* Selected Chacras Info */}
            <div className="p-4 bg-muted/30 rounded-md">
              <p className="text-sm text-muted-foreground">
                {selectedChacras.length > 0 
                  ? `${selectedChacras.length} chacra${selectedChacras.length > 1 ? 's' : ''} seleccionada${selectedChacras.length > 1 ? 's' : ''} en la tabla de abajo`
                  : "Seleccione las chacras en la tabla de abajo donde desea registrar este evento"
                }
              </p>
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