import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, Download, Trash2, Plus, Calendar } from 'lucide-react';

interface LegalDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate?: string;
  fileUrl: string;
}

export function LegalDocumentsTab() {
  const [documents] = useState<LegalDocument[]>([
    {
      id: '1',
      name: 'Certificado de Inscripción RUT',
      type: 'RUT',
      uploadDate: '2024-01-10',
      fileUrl: '#',
    },
    {
      id: '2',
      name: 'Certificado DGI',
      type: 'Tributario',
      uploadDate: '2024-01-10',
      fileUrl: '#',
    },
    {
      id: '3',
      name: 'Habilitación Sanitaria',
      type: 'Sanitario',
      uploadDate: '2023-11-15',
      expiryDate: '2024-11-15',
      fileUrl: '#',
    },
    {
      id: '4',
      name: 'Póliza de Seguro',
      type: 'Seguro',
      uploadDate: '2024-02-01',
      expiryDate: '2025-02-01',
      fileUrl: '#',
    },
    {
      id: '5',
      name: 'Poder Legal - Representante',
      type: 'Legal',
      uploadDate: '2023-08-20',
      fileUrl: '#',
    },
  ]);

  const documentTypes = [
    { value: 'rut', label: 'RUT' },
    { value: 'tributario', label: 'Documento Tributario' },
    { value: 'sanitario', label: 'Habilitación Sanitaria' },
    { value: 'seguro', label: 'Póliza de Seguro' },
    { value: 'legal', label: 'Documento Legal' },
    { value: 'contrato', label: 'Contrato' },
    { value: 'otro', label: 'Otro' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Documentación Legal</h2>
          <p className="text-muted-foreground">
            Almacena y gestiona los documentos legales de tu empresa
          </p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Subir Documento
        </Button>
      </div>

      {/* Document Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-2xl font-bold text-blue-900">{documents.length}</p>
              <p className="text-sm text-blue-700">Documentos Totales</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-green-600 mb-2" />
              <p className="text-2xl font-bold text-green-900">
                {documents.filter(d => !d.expiryDate || new Date(d.expiryDate) > new Date()).length}
              </p>
              <p className="text-sm text-green-700">Vigentes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <FileText className="h-8 w-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-2xl font-bold text-yellow-900">
                {documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 90*24*60*60*1000)).length}
              </p>
              <p className="text-sm text-yellow-700">Por Vencer (90 días)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.map((doc) => (
          <Card key={doc.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{doc.name}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {doc.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Subido: {new Date(doc.uploadDate).toLocaleDateString('es-UY')}
                      </span>
                      {doc.expiryDate && (
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Vence: {new Date(doc.expiryDate).toLocaleDateString('es-UY')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
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

      {/* Upload Area */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-8">
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Arrastra archivos aquí</h3>
            <p className="text-sm text-muted-foreground mb-4">
              o haz clic para seleccionar archivos desde tu computadora
            </p>
            <Button variant="outline">
              Seleccionar Archivos
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Formatos aceptados: PDF, PNG, JPG (máx. 10MB por archivo)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
