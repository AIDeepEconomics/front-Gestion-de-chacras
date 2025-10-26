import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileCheck, Calendar, Building2, Factory, Wheat, Download, Trash2, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Certification {
  id: string;
  name: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'vigente' | 'por-vencer' | 'vencido';
  appliesTo: string[];
  fileUrl: string;
}

export function CertificationsTab() {
  const [certifications] = useState<Certification[]>([
    {
      id: '1',
      name: 'Certificación BPS',
      type: 'BPS',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      status: 'vigente',
      appliesTo: ['Todos los establecimientos'],
      fileUrl: '#',
    },
    {
      id: '2',
      name: 'ISO 9001:2015',
      type: 'ISO 9001',
      issueDate: '2023-06-20',
      expiryDate: '2024-12-20',
      status: 'por-vencer',
      appliesTo: ['Molino Central'],
      fileUrl: '#',
    },
    {
      id: '3',
      name: 'GlobalGAP',
      type: 'GlobalGAP',
      issueDate: '2024-03-10',
      expiryDate: '2025-03-10',
      status: 'vigente',
      appliesTo: ['El Retiro', 'San José'],
      fileUrl: '#',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'vigente':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'por-vencer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'vencido':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'vigente':
        return 'Vigente';
      case 'por-vencer':
        return 'Por Vencer';
      case 'vencido':
        return 'Vencido';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Certificaciones y Permisos</h2>
          <p className="text-muted-foreground">
            Gestiona las certificaciones de tu empresa y asócialas a establecimientos o molinos
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Certificación
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Agregar Nueva Certificación</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="cert-type">Tipo de Certificación *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bps">🌾 BPS (Buenas Prácticas Sostenibles)</SelectItem>
                    <SelectItem value="iso9001">📋 ISO 9001 (Calidad)</SelectItem>
                    <SelectItem value="iso14001">🌱 ISO 14001 (Medio Ambiente)</SelectItem>
                    <SelectItem value="iso22000">🔒 ISO 22000 (Seguridad Alimentaria)</SelectItem>
                    <SelectItem value="globalgap">✅ GlobalGAP</SelectItem>
                    <SelectItem value="organica">🏆 Certificación Orgánica</SelectItem>
                    <SelectItem value="trazabilidad">📊 Certificación de Trazabilidad</SelectItem>
                    <SelectItem value="carbono">🌍 Huella de Carbono</SelectItem>
                    <SelectItem value="otra">📄 Otra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-name">Nombre de la Certificación *</Label>
                <Input id="cert-name" placeholder="Ej: Certificación BPS 2024" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="issue-date">Fecha de Emisión *</Label>
                  <Input id="issue-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry-date">Fecha de Vencimiento *</Label>
                  <Input id="expiry-date" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Aplica a: *</Label>
                <div className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="all" />
                    <label htmlFor="all" className="text-sm font-medium">
                      Todos los establecimientos y molinos
                    </label>
                  </div>
                  <div className="ml-6 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Establecimientos:</p>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="est1" />
                      <label htmlFor="est1" className="text-sm flex items-center gap-2">
                        <Wheat className="h-3 w-3" />
                        El Retiro
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="est2" />
                      <label htmlFor="est2" className="text-sm flex items-center gap-2">
                        <Wheat className="h-3 w-3" />
                        San José
                      </label>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mt-3">Molinos:</p>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="mol1" />
                      <label htmlFor="mol1" className="text-sm flex items-center gap-2">
                        <Factory className="h-3 w-3" />
                        Molino Central
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-file">Archivo del Certificado *</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Haz clic para subir o arrastra el archivo aquí
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, PNG, JPG (máx. 10MB)
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline">Cancelar</Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Guardar Certificación
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Certifications List */}
      <div className="grid gap-4">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <FileCheck className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">{cert.name}</h3>
                    <Badge variant="outline" className={getStatusColor(cert.status)}>
                      {getStatusLabel(cert.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo</p>
                      <p className="font-medium">{cert.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Emisión
                      </p>
                      <p className="font-medium">{new Date(cert.issueDate).toLocaleDateString('es-UY')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Vencimiento
                      </p>
                      <p className="font-medium">{new Date(cert.expiryDate).toLocaleDateString('es-UY')}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Aplica a:</p>
                    <div className="flex flex-wrap gap-2">
                      {cert.appliesTo.map((entity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {entity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alert for expiring certifications */}
      {certifications.some(c => c.status === 'por-vencer') && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-yellow-600">⚠️</div>
              <div>
                <p className="font-medium text-yellow-900">
                  Tienes certificaciones próximas a vencer
                </p>
                <p className="text-sm text-yellow-800">
                  Revisa las fechas de vencimiento y renueva tus certificaciones a tiempo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
