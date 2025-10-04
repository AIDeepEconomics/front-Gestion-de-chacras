import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import MillManagement from "@/components/MillManagement";
import ChacrasManagement from "@/components/ChacrasManagement";
import ChacrasManagementMolino from "@/components/ChacrasManagementMolino";
import EventsManagement from "@/components/EventsManagement";
import EventsManagementMolino from "@/components/EventsManagementMolino";
import CosechaManagement from "@/components/CosechaManagement";
import CosechaManagementMolino from "@/components/CosechaManagementMolino";
import TrazabilidadManagement from "@/components/TrazabilidadManagement";
import TrazabilidadManagementMolino from "@/components/TrazabilidadManagementMolino";
import EmptyStateCard from "@/components/EmptyStateCard";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("principal");
  const { isProductor, isMolino, currentUser } = useUser();

  const tabs = [
    { id: "principal", label: "Principal" },
    { id: "chacras", label: "Gestión de Chacras y Polígonos" },
    { id: "eventos", label: "Eventos" },
    { id: "cosecha", label: "Cosecha" },
    { id: "trazabilidad", label: "Trazabilidad" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "principal":
        if (isProductor) {
          return (
            <div className="max-w-4xl">
              <MillManagement />
            </div>
          );
        } else {
          // Vista para usuarios de molino
          return (
            <div className="max-w-4xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Panel de {currentUser.organization}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Como trabajador de molino, aquí puedes gestionar las chacras y eventos de los productores asociados según los permisos otorgados.
                  </div>
                  
                  <div className="border border-muted rounded-lg p-4">
                    <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Productores Asociados
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="font-medium text-sm">Juan Carlos Rodríguez</div>
                          <div className="text-xs text-muted-foreground">3 establecimientos • Acceso: Trazabilidad + Cosecha</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="font-medium text-sm">Pedro Martínez</div>
                          <div className="text-xs text-muted-foreground">1 establecimiento • Acceso: Administración completa</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div>
                          <div className="font-medium text-sm">Ana Fernández</div>
                          <div className="text-xs text-muted-foreground">2 establecimientos • Acceso: Solo trazabilidad</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground italic">
                    Nota: Esta es una vista mock de demostración. En la aplicación real, aquí se mostrarían los productores asociados y sus permisos.
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }
      case "chacras":
        return (
          <div className="max-w-6xl">
            {isProductor ? <ChacrasManagement /> : <ChacrasManagementMolino />}
          </div>
        );
      case "eventos":
        return (
          <div className="max-w-7xl">
            {isProductor ? <EventsManagement /> : <EventsManagementMolino />}
          </div>
        );
      case "cosecha":
        return (
          <div className="max-w-7xl">
            {isProductor ? <CosechaManagement /> : <CosechaManagementMolino />}
          </div>
        );
      case "trazabilidad":
        return (
          <div className="max-w-7xl">
            {isProductor ? <TrazabilidadManagement /> : <TrazabilidadManagementMolino />}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="p-6">
        {renderTabContent()}
      </main>
    </div>
  );
}