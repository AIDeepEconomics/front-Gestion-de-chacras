import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Upload, Save } from 'lucide-react';

export function GeneralInfoTab() {
  const [companyData, setCompanyData] = useState({
    comercialName: 'Arrocera Los Pinos S.A.',
    legalName: 'Arrocera Los Pinos Sociedad Anónima',
    rut: '211234560018',
    address: 'Ruta 8 Km 245',
    department: 'Treinta y Tres',
    phone: '+598 99 123 456',
    email: 'contacto@arrocera-lospinos.com.uy',
    website: 'www.arrocera-lospinos.com.uy',
    description: 'Empresa dedicada a la producción y comercialización de arroz de alta calidad desde 1985.',
    foundedYear: '1985',
  });

  const departments = [
    'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno',
    'Flores', 'Florida', 'Lavalleja', 'Maldonado', 'Montevideo',
    'Paysandú', 'Río Negro', 'Rivera', 'Rocha', 'Salto',
    'San José', 'Soriano', 'Tacuarembó', 'Treinta y Tres'
  ];

  const handleSave = () => {
    alert('Información de empresa actualizada correctamente');
  };

  return (
    <div className="space-y-6">
      {/* Logo Section */}
      <Card>
        <CardHeader>
          <CardTitle>Logo de la Empresa</CardTitle>
          <CardDescription>
            Imagen que representa tu empresa en documentos y plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Building2 className="h-16 w-16 text-gray-400" />
            </div>
            <div className="flex-1">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Subir Logo
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Formato: PNG, JPG. Tamaño recomendado: 512x512px
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información Básica</CardTitle>
          <CardDescription>
            Datos principales de identificación de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="comercialName">Nombre Comercial *</Label>
              <Input
                id="comercialName"
                value={companyData.comercialName}
                onChange={(e) => setCompanyData({ ...companyData, comercialName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalName">Razón Social *</Label>
              <Input
                id="legalName"
                value={companyData.legalName}
                onChange={(e) => setCompanyData({ ...companyData, legalName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                value={companyData.rut}
                onChange={(e) => setCompanyData({ ...companyData, rut: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foundedYear">Año de Fundación</Label>
              <Input
                id="foundedYear"
                value={companyData.foundedYear}
                onChange={(e) => setCompanyData({ ...companyData, foundedYear: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción de la Empresa</Label>
            <Textarea
              id="description"
              value={companyData.description}
              onChange={(e) => setCompanyData({ ...companyData, description: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
          <CardDescription>
            Datos de contacto y ubicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono *</Label>
              <Input
                id="phone"
                value={companyData.phone}
                onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={companyData.email}
                onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Sitio Web</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => setCompanyData({ ...companyData, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento *</Label>
              <Select
                value={companyData.department}
                onValueChange={(value) => setCompanyData({ ...companyData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue />
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              value={companyData.address}
              onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>
    </div>
  );
}
