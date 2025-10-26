import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, User, Calendar, FileEdit, Download, Search } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  section: string;
  details: string;
  ipAddress: string;
}

export function AuditTab() {
  const [auditLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-10-26T15:30:00',
      user: 'Juan Pérez',
      action: 'Actualización',
      section: 'Información General',
      details: 'Modificó el teléfono de contacto',
      ipAddress: '192.168.1.100',
    },
    {
      id: '2',
      timestamp: '2024-10-25T10:15:00',
      user: 'María González',
      action: 'Creación',
      section: 'Certificaciones',
      details: 'Agregó certificación BPS',
      ipAddress: '192.168.1.105',
    },
    {
      id: '3',
      timestamp: '2024-10-24T14:20:00',
      user: 'Juan Pérez',
      action: 'Eliminación',
      section: 'Documentación Legal',
      details: 'Eliminó documento vencido',
      ipAddress: '192.168.1.100',
    },
    {
      id: '4',
      timestamp: '2024-10-23T09:45:00',
      user: 'Pedro Rodríguez',
      action: 'Actualización',
      section: 'Facturación',
      details: 'Actualizó datos bancarios',
      ipAddress: '192.168.1.110',
    },
    {
      id: '5',
      timestamp: '2024-10-22T16:00:00',
      user: 'Juan Pérez',
      action: 'Actualización',
      section: 'Información General',
      details: 'Modificó la descripción de la empresa',
      ipAddress: '192.168.1.100',
    },
  ]);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Creación':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Actualización':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Eliminación':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Registro de Auditoría
        </h2>
        <p className="text-muted-foreground mt-1">
          Historial completo de cambios realizados en la configuración de la empresa
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Buscar en logs..." className="pl-9" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Usuario</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los usuarios</SelectItem>
                  <SelectItem value="juan">Juan Pérez</SelectItem>
                  <SelectItem value="maria">María González</SelectItem>
                  <SelectItem value="pedro">Pedro Rodríguez</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Acción</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las acciones</SelectItem>
                  <SelectItem value="create">Creación</SelectItem>
                  <SelectItem value="update">Actualización</SelectItem>
                  <SelectItem value="delete">Eliminación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sección</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las secciones</SelectItem>
                  <SelectItem value="general">Información General</SelectItem>
                  <SelectItem value="cert">Certificaciones</SelectItem>
                  <SelectItem value="legal">Documentación Legal</SelectItem>
                  <SelectItem value="billing">Facturación</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Reporte
        </Button>
      </div>

      {/* Audit Logs */}
      <div className="space-y-3">
        {auditLogs.map((log) => (
          <Card key={log.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className={getActionColor(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="font-semibold">{log.section}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {log.details}
                  </p>

                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {log.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(log.timestamp).toLocaleString('es-UY', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileEdit className="h-3 w-3" />
                      IP: {log.ipAddress}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="text-blue-600">ℹ️</div>
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-1">Retención de Logs</p>
              <p>
                Los registros de auditoría se mantienen por 2 años para cumplir con requisitos de trazabilidad.
                Puedes exportar reportes en cualquier momento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
