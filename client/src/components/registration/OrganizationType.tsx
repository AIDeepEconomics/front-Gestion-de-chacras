import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Factory, Wheat, Building2 } from 'lucide-react';

interface OrganizationTypeProps {
  onNext: (type: string) => void;
}

export function OrganizationType({ onNext }: OrganizationTypeProps) {
  const [selectedType, setSelectedType] = useState<string>('');

  const organizationTypes = [
    {
      id: 'molino',
      icon: Factory,
      title: '🏭 Molino o Aglutinador',
      description: 'Procesas y comercializas arroz',
      color: 'border-blue-500 hover:bg-blue-50',
      selectedColor: 'border-blue-600 bg-blue-50',
    },
    {
      id: 'establecimiento',
      icon: Wheat,
      title: '🌾 Establecimiento Rural',
      description: 'Produces arroz en chacras',
      color: 'border-green-500 hover:bg-green-50',
      selectedColor: 'border-green-600 bg-green-50',
    },
    {
      id: 'ambos',
      icon: Building2,
      title: '🏢 Ambos',
      description: 'Tengo molino Y establecimientos rurales',
      color: 'border-purple-500 hover:bg-purple-50',
      selectedColor: 'border-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">¿Qué describe mejor tu organización?</CardTitle>
          <CardDescription>
            Selecciona el tipo que mejor represente tu actividad principal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {organizationTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full p-6 border-2 rounded-lg text-left transition-all ${
                  isSelected ? type.selectedColor : type.color
                }`}
              >
                <div className="flex items-start gap-4">
                  <Icon className="h-8 w-8 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{type.title}</h3>
                    <p className="text-gray-600">{type.description}</p>
                  </div>
                  {isSelected && (
                    <div className="text-green-600 text-2xl">✓</div>
                  )}
                </div>
              </button>
            );
          })}

          <Button
            onClick={() => onNext(selectedType)}
            disabled={!selectedType}
            className="w-full bg-green-600 hover:bg-green-700 mt-6"
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
