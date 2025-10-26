import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Building2, 
  Wheat, 
  Factory
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InviteUserModal } from '@/components/InviteUserModal';
import { useUser } from '@/contexts/UserContext';

interface UserRole {
  entity: 'empresa' | 'establecimiento' | 'molino';
  entityName: string;
  role: string;
}

interface SystemUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  status: 'active' | 'pending';
  isSuperAdmin?: boolean;
}

export function UserManagement() {
  const { currentUser } = useUser();
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  // Mock users data
  const [users] = useState<SystemUser[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@email.com',
      isSuperAdmin: true,
      status: 'active',
      roles: [
        { entity: 'empresa', entityName: 'Arrocera Los Pinos S.A.', role: 'Super Admin' },
        { entity: 'establecimiento', entityName: 'El Retiro', role: 'Admin' },
        { entity: 'molino', entityName: 'Molino Central', role: 'Admin' },
      ]
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria@email.com',
      status: 'active',
      roles: [
        { entity: 'establecimiento', entityName: 'El Retiro', role: 'Técnico' },
        { entity: 'establecimiento', entityName: 'San José', role: 'Técnico' },
      ]
    },
    {
      id: '3',
      name: 'Pedro Rodríguez',
      email: 'pedro@email.com',
      status: 'active',
      roles: [
        { entity: 'establecimiento', entityName: 'El Retiro', role: 'Operario' },
      ]
    },
    {
      id: '4',
      name: 'Ana Martínez',
      email: 'ana@email.com',
      status: 'pending',
      roles: [
        { entity: 'molino', entityName: 'Molino Central', role: 'Comercial' },
      ]
    },
  ]);

  const getRoleIcon = (entity: string) => {
    switch (entity) {
      case 'empresa':
        return <Building2 className="h-3 w-3" />;
      case 'establecimiento':
        return <Wheat className="h-3 w-3" />;
      case 'molino':
        return <Factory className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    if (role.includes('Admin')) return 'bg-purple-100 text-purple-800 border-purple-300';
    if (role.includes('Técnico')) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (role.includes('Operario')) return 'bg-green-100 text-green-800 border-green-300';
    if (role.includes('Comercial')) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* User Management Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Usuarios de {currentUser.organization || 'la Empresa'}</CardTitle>
            </div>
            <Button 
              onClick={() => setShowInviteModal(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invitar Usuario
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div 
                key={user.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base">{user.name}</h3>
                      {user.isSuperAdmin && (
                        <Badge className="bg-purple-600">
                          <Shield className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                      )}
                      {user.status === 'pending' && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                          Invitación pendiente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                    
                    {/* Roles */}
                    <div className="flex flex-wrap gap-2">
                      {user.roles.map((role, idx) => (
                        <Badge 
                          key={idx}
                          variant="outline"
                          className={`${getRoleColor(role.role)} flex items-center gap-1`}
                        >
                          {getRoleIcon(role.entity)}
                          <span className="text-xs">
                            {role.entityName} ({role.role})
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Editar roles</DropdownMenuItem>
                      <DropdownMenuItem>Ver permisos</DropdownMenuItem>
                      {user.status === 'pending' && (
                        <DropdownMenuItem>Reenviar invitación</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-red-600">
                        Revocar acceso
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current User Permissions Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Estás viendo como:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-purple-900">Super Administrador</span>
            </div>
            
            <div className="space-y-2 text-sm">
              <p className="font-medium text-blue-900">Puedes:</p>
              <ul className="space-y-1 text-blue-800">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Crear y editar todo
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Gestionar usuarios y permisos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Administrar establecimientos y molinos
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  Acceso completo a trazabilidad
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      {showInviteModal && (
        <InviteUserModal 
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}
