import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function UserRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [otherRole, setOtherRole] = useState('');

  const roles = [
    { id: 'owner', label: 'Soy el propietario/dueño' },
    { id: 'manager', label: 'Soy gerente/administrador' },
    { id: 'technician', label: 'Soy técnico/agrónomo' },
    { id: 'admin', label: 'Soy empleado administrativo' },
    { id: 'other', label: 'Otro' },
  ];

  const handleComplete = () => {
    alert('¡Registro completado exitosamente! Bienvenido a la plataforma.');
    navigate('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">¿Cuál es tu función principal?</CardTitle>
          <CardDescription>
            Esto nos ayudará a personalizar tu experiencia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={role.id} id={role.id} />
                <Label htmlFor={role.id} className="flex-1 cursor-pointer text-base">
                  {role.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedRole === 'other' && (
            <div className="space-y-2 ml-6">
              <Label htmlFor="otherRole">Especifica tu función</Label>
              <Input
                id="otherRole"
                value={otherRole}
                onChange={(e) => setOtherRole(e.target.value)}
                placeholder="Ej: Encargado de logística"
              />
            </div>
          )}

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-900">
              <p className="font-medium mb-1">Serás el Super Administrador de esta empresa</p>
              <p>Podrás agregar otros usuarios y asignar permisos posteriormente.</p>
            </div>
          </div>

          <Button
            onClick={handleComplete}
            disabled={!selectedRole || (selectedRole === 'other' && !otherRole)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Completar Registro
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
