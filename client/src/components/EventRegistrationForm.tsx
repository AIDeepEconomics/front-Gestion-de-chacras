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
  notes: z.string().optional(),
  selectedChacras: z.array(z.string()).min(1, "Debe seleccionar al menos una chacra")
});

type EventRegistrationData = z.infer<typeof eventRegistrationSchema>;

interface EventRegistrationFormProps {
  chacras: Chacra[];
  onSubmit: (data: EventRegistrationData) => void;
}

export default function EventRegistrationForm({ chacras, onSubmit }: EventRegistrationFormProps) {
  const [selectedChacras, setSelectedChacras] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const form = useForm<EventRegistrationData>({
    resolver: zodResolver(eventRegistrationSchema),
    defaultValues: {
      description: "",
      eventType: "",
      startDate: "",
      endDate: "",
      details: "",
      notes: "",
      selectedChacras: []
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

  const handleChacraToggle = (chacraId: string, checked: boolean) => {
    let newSelection;
    if (checked) {
      newSelection = [...selectedChacras, chacraId];
    } else {
      newSelection = selectedChacras.filter(id => id !== chacraId);
    }
    setSelectedChacras(newSelection);
    form.setValue("selectedChacras", newSelection);
    
    // Update "select all" state
    setIsAllSelected(newSelection.length === chacras.length);
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelection = checked ? chacras.map(c => c.id) : [];
    setSelectedChacras(newSelection);
    setIsAllSelected(checked);
    form.setValue("selectedChacras", newSelection);
  };

  const handleSubmit = (data: EventRegistrationData) => {
    const eventData = {
      ...data,
      selectedChacras
    };
    onSubmit(eventData);
    console.log("Event registered:", eventData);
    
    // Reset form
    form.reset();
    setSelectedChacras([]);
    setIsAllSelected(false);
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

            {/* Chacra Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel className="text-base font-medium">
                  Seleccionar Chacras
                </FormLabel>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                  <label htmlFor="select-all" className="text-sm text-muted-foreground">
                    Seleccionar todas
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-md p-4">
                {chacras.map((chacra) => (
                  <div key={chacra.id} className="flex items-center space-x-3 p-2 rounded hover-elevate">
                    <Checkbox
                      id={`chacra-${chacra.id}`}
                      checked={selectedChacras.includes(chacra.id)}
                      onCheckedChange={(checked) => handleChacraToggle(chacra.id, checked as boolean)}
                      data-testid={`checkbox-chacra-${chacra.id}`}
                    />
                    <label 
                      htmlFor={`chacra-${chacra.id}`} 
                      className="text-sm font-medium cursor-pointer flex-1"
                    >
                      <div>
                        <span className="text-foreground">{chacra.name}</span>
                        <div className="text-xs text-muted-foreground">
                          {chacra.establishmentName} • {chacra.area} ha
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              {form.formState.errors.selectedChacras && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.selectedChacras.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setSelectedChacras([]);
                  setIsAllSelected(false);
                }}
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