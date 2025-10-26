import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { RegistrationFlow } from './registration/RegistrationFlow';
import { Phone, Mail, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const username = (e.currentTarget as HTMLFormElement).username.value;
    const password = (e.currentTarget as HTMLFormElement).password.value;
    
    // Mock login - only accept '123' as both username and password
    if (username === '123' && password === '123') {
      navigate('/dashboard');
    } else {
      alert('Credenciales incorrectas. Use usuario: 123 y contraseña: 123');
    }
  };

  if (showRegistration) {
    return <RegistrationFlow />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Login Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" placeholder="Ingrese su usuario" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" placeholder="Ingrese su contraseña" />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Iniciar Sesión
              </Button>
              <div className="text-center mt-4">
                <button 
                  type="button"
                  className="text-sm text-green-600 hover:underline"
                  onClick={() => setShowRegistration(true)}
                >
                  Crear una nueva cuenta
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Support Card */}
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              ¿Necesitas ayuda con tu cuenta?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-orange-900 mb-4">
              Si perdiste acceso o el administrador no está disponible:
            </p>
            
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start border-orange-300 hover:bg-orange-100"
              >
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp: +598 XXXX-XXXX
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start border-orange-300 hover:bg-orange-100"
              >
                <Mail className="h-4 w-4 mr-2" />
                soporte@trazabilidad.com.uy
              </Button>
            </div>
            
            <div className="mt-4 text-xs text-orange-800 bg-orange-100 rounded p-3">
              <p className="font-medium mb-1">Tendrás que verificar:</p>
              <ul className="space-y-1 ml-4">
                <li>• Tu identidad</li>
                <li>• Representación legal de la empresa</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
