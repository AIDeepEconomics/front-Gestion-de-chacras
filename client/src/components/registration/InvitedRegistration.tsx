import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface InvitedRegistrationProps {
  onBack: () => void;
  onComplete: () => void;
}

export function InvitedRegistration({ onBack, onComplete }: InvitedRegistrationProps) {
  const [step, setStep] = useState<'code' | 'form'>('code');
  const [invitationCode, setInvitationCode] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock validation - accept any code
    alert('Código válido. Empresa: Molino Los Pinos');
    setStep('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    
    alert('¡Registro exitoso! Ya formas parte de la empresa.');
    onComplete();
  };

  if (step === 'code') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Button 
              variant="ghost" 
              className="w-fit mb-2 -ml-2"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <CardTitle className="text-2xl">Código de Invitación</CardTitle>
            <CardDescription>
              Ingresa el código que recibiste de tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Invitación *</Label>
                <Input
                  id="code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  placeholder="ABC-123-XYZ"
                  required
                  className="text-center text-lg tracking-wider"
                />
                <p className="text-xs text-gray-500">
                  El código es sensible a mayúsculas y minúsculas
                </p>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Validar Código
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Completa tu Registro</CardTitle>
          <CardDescription>
            Te unirás a: <strong>Molino Los Pinos</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre Completo *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="María González"
                required
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
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Repite tu contraseña"
                required
                minLength={8}
              />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Completar Registro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
