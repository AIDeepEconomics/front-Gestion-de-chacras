import { Wheat, User, Settings, Users, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useUser, MOCK_USERS } from "@/contexts/UserContext";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { currentUser, setCurrentUser } = useUser();

  return (
    <header className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary rounded-md">
            <Wheat className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Portal de Trazabilidad de Arroz
            </h1>
            <p className="text-sm text-muted-foreground">
              Sistema de gestión para productores rurales
            </p>
          </div>
        </div>
        
        {/* User Session Area */}
        <div className="flex items-center space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 h-auto p-2" data-testid="button-user-menu">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{currentUser.name}</span>
                    <Badge variant={currentUser.type === "productor" ? "default" : "secondary"} className="text-xs">
                      {currentUser.type === "productor" ? "Productor" : "Molino"}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{currentUser.email}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Cambiar Usuario Mock
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {Object.values(MOCK_USERS).map((user) => (
                <DropdownMenuItem 
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  data-testid={`menu-switch-user-${user.type}`}
                  className={currentUser.id === user.id ? "bg-accent" : ""}
                >
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.type === "productor" ? "Productor Rural" : user.organization}
                    </div>
                  </div>
                  {currentUser.id === user.id && (
                    <span className="text-xs text-primary">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem data-testid="menu-profile">
                <User className="mr-2 h-4 w-4" />
                <span>Mi Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                data-testid="menu-company"
                onClick={() => window.location.href = '/empresa'}
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>Empresa</span>
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                data-testid="menu-signout"
                onClick={() => window.location.href = '/login'}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}