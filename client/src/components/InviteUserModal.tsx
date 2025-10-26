import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Copy, Check, Wheat, Factory } from 'lucide-react';

interface InviteUserModalProps {
  onClose: () => void;
}

export function InviteUserModal({ onClose }: InviteUserModalProps) {
  const [inviteMethod, setInviteMethod] = useState<'email' | 'code'>('email');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    entity: '',
    entityType: '',
    role: '',
  });

  const handleGenerateCode = () => {
    const code = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setGeneratedCode(code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = () => {
    alert(`Invitación enviada a ${formData.email}`);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Invitar Nuevo Usuario</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invite Method Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setInviteMethod('email')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                inviteMethod === 'email' 
                  ? 'border-green-600 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <Mail className="h-6 w-6 mb-2 text-green-600" />
              <h3 className="font-semibold mb-1">Por Email</h3>
              <p className="text-sm text-gray-600">
                Envía una invitación directa al correo del usuario
              </p>
            </button>

            <button
              onClick={() => setInviteMethod('code')}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                inviteMethod === 'code' 
                  ? 'border-blue-600 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <Copy className="h-6 w-6 mb-2 text-blue-600" />
              <h3 className="font-semibold mb-1">Código de Invitación</h3>
              <p className="text-sm text-gray-600">
                Genera un código para compartir manualmente
              </p>
            </button>
          </div>

          {inviteMethod === 'email' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: María González"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maria@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="entityType">Tipo de Entidad *</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value) => setFormData({ ...formData, entityType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="establecimiento">
                      <div className="flex items-center gap-2">
                        <Wheat className="h-4 w-4" />
                        Establecimiento Rural
                      </div>
                    </SelectItem>
                    <SelectItem value="molino">
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4" />
                        Molino
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.entityType === 'establecimiento' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="entity">Establecimiento *</Label>
                    <Select
                      value={formData.entity}
                      onValueChange={(value) => setFormData({ ...formData, entity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar establecimiento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="el-retiro">El Retiro</SelectItem>
                        <SelectItem value="san-jose">San José</SelectItem>
                        <SelectItem value="la-esperanza">La Esperanza</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rol en Establecimiento *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin Establecimiento</SelectItem>
                        <SelectItem value="tecnico">Técnico</SelectItem>
                        <SelectItem value="operario">Operario</SelectItem>
                        <SelectItem value="resp-cosecha">Responsable Cosecha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {formData.entityType === 'molino' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="entity">Molino *</Label>
                    <Select
                      value={formData.entity}
                      onValueChange={(value) => setFormData({ ...formData, entity: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar molino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="molino-central">Molino Central</SelectItem>
                        <SelectItem value="molino-norte">Molino Norte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rol en Molino *</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin Molino</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="resp-cosecha">Responsable Cosecha</SelectItem>
                        <SelectItem value="operario">Operario</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button 
                onClick={handleSendInvite}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!formData.email || !formData.name || !formData.role}
              >
                Enviar Invitación
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {!generatedCode ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    Genera un código de invitación que podrás compartir por cualquier medio
                  </p>
                  <Button 
                    onClick={handleGenerateCode}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Generar Código
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Código de Invitación</p>
                    <p className="text-3xl font-mono font-bold text-blue-900 mb-4">
                      {generatedCode}
                    </p>
                    <Button
                      onClick={handleCopyCode}
                      variant="outline"
                      className="border-blue-300"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar Código
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-900">
                    <p className="font-medium mb-2">⚠️ Importante:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• Este código es válido por 7 días</li>
                      <li>• Solo puede ser usado una vez</li>
                      <li>• El usuario deberá completar su registro</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
