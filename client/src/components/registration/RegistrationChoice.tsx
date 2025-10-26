import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, UserPlus } from 'lucide-react';

interface RegistrationChoiceProps {
  onSelectFounder: () => void;
  onSelectInvited: () => void;
}

export function RegistrationChoice({ onSelectFounder, onSelectInvited }: RegistrationChoiceProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Bienvenido al Portal de Trazabilidad de Arroz
          </h1>
          <p className="text-gray-600">
            Selecciona cómo deseas registrarte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Founder Registration */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelectFounder}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-700" />
                </div>
                <CardTitle className="text-xl">Fundar una Empresa</CardTitle>
              </div>
              <CardDescription className="text-base">
                Crea una nueva organización y conviértete en el administrador principal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>✓ Configura tu empresa desde cero</li>
                <li>✓ Serás el Super Administrador</li>
                <li>✓ Invita a otros usuarios</li>
                <li>✓ Control total de permisos</li>
              </ul>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Comenzar como Fundador
              </Button>
            </CardContent>
          </Card>

          {/* Invited User Registration */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelectInvited}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <UserPlus className="h-6 w-6 text-blue-700" />
                </div>
                <CardTitle className="text-xl">Tengo un Código de Invitación</CardTitle>
              </div>
              <CardDescription className="text-base">
                Únete a una empresa existente con un código de invitación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>✓ Registro rápido y sencillo</li>
                <li>✓ Empresa ya configurada</li>
                <li>✓ Acceso inmediato</li>
                <li>✓ Permisos predefinidos</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Usar Código de Invitación
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
