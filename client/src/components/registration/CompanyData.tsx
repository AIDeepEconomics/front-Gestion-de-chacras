import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

interface CompanyDataProps {
  onNext: (data: any) => void;
}

export function CompanyData({ onNext }: CompanyDataProps) {
  const [formData, setFormData] = useState({
    comercialName: '',
    legalName: '',
    rut: '',
    address: '',
    department: '',
  });

  const departments = [
    'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
    'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
    'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
    'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Datos de tu Empresa</CardTitle>
          <CardDescription>
            Esta información aparecerá en remitos y documentos de trazabilidad
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comercialName">Nombre Comercial *</Label>
              <Input
                id="comercialName"
                value={formData.comercialName}
                onChange={(e) => setFormData({ ...formData, comercialName: e.target.value })}
                placeholder="Ej: Arrocera del Este"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalName">Razón Social *</Label>
              <Input
                id="legalName"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                placeholder="Ej: Arrocera del Este S.A."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                placeholder="Ej: 211234560018"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ej: Ruta 8 Km 245"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-900">
                Estos datos aparecerán en remitos y documentos de trazabilidad
              </p>
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
