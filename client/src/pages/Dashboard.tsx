import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import MillManagement from "@/components/MillManagement";
import { UserManagement } from "@/components/UserManagement";
import ChacrasManagementProductor from "@/components/ChacrasManagementProductor";
import ChacrasManagementMolino from "@/components/ChacrasManagementMolino";
import EventsManagementProductor from "@/components/EventsManagementProductor";
import EventsManagementMolino from "@/components/EventsManagementMolino";
import CosechaManagementProductor from "@/components/CosechaManagementProductor";
import CosechaManagementMolino from "@/components/CosechaManagementMolino";
import TrazabilidadManagementProductor from "@/components/TrazabilidadManagementProductor";
import TrazabilidadManagementMolino from "@/components/TrazabilidadManagementMolino";
import EmptyStateCard from "@/components/EmptyStateCard";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralInfoTab } from '@/components/company/GeneralInfoTab';
import { CertificationsTab } from '@/components/company/CertificationsTab';
import { LegalDocumentsTab } from '@/components/company/LegalDocumentsTab';
import { AuditTab } from '@/components/company/AuditTab';
import { Building2, Users, FileCheck, FileText, History, Map } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("vista-general");
  const { isProductor, isMolino, currentUser } = useUser();

  const tabs = [
    { id: "vista-general", label: "Vista General" },
    { id: "principal", label: "Permisos" },
    { id: "empresa", label: "Empresa" },
    { id: "chacras", label: "Gestión de Chacras y Polígonos" },
    { id: "eventos", label: "Eventos" },
    { id: "cosecha", label: "Cosecha" },
    { id: "trazabilidad", label: "Trazabilidad" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "vista-general":
        return (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-primary" />
                  Vista General de Chacras
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-12 text-lg text-muted-foreground">
                  <p className="mb-4">
                    Mapa interactivo mostrando todas las chacras (polígonos) con sus nombres y enlaces a sus páginas detalladas.
                  </p>
                  <ul className="text-left list-disc pl-6 space-y-2">
                    <li>Vista general de todas las chacras simultáneamente</li>
                    <li>Selector de establecimientos (todos seleccionados por defecto)</li>
                    <li>Chacras de establecimientos no seleccionados aparecerán semitransparentes</li>
                    <li>Navegación similar a la pestaña 'Gestión de Chacras' pero con perspectiva general</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "principal":
        if (isProductor) {
          return (
            <div className="max-w-6xl space-y-6">
              <MillManagement />
              <UserManagement />
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
                    Panel de Molino
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
            {isProductor ? <ChacrasManagementProductor /> : <ChacrasManagementMolino />}
          </div>
        );
      case "eventos":
        return (
          <div className="max-w-7xl">
            {isProductor ? <EventsManagementProductor /> : <EventsManagementMolino />}
          </div>
        );
      case "cosecha":
        return (
          <div className="max-w-7xl">
            {isProductor ? <CosechaManagementProductor /> : <CosechaManagementMolino />}
          </div>
        );
      case "trazabilidad":
        return (
          <div className="max-w-7xl">
            {isProductor ? <TrazabilidadManagementProductor /> : <TrazabilidadManagementMolino />}
          </div>
        );
      case "empresa":
        return (
          <div className="max-w-7xl">
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Información General</span>
                  <span className="sm:hidden">General</span>
                </TabsTrigger>
                <TabsTrigger value="certifications" className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Certificaciones</span>
                  <span className="sm:hidden">Cert.</span>
                </TabsTrigger>
                <TabsTrigger value="legal" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Documentación Legal</span>
                  <span className="sm:hidden">Legal</span>
                </TabsTrigger>
                <TabsTrigger value="audit" className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="hidden sm:inline">Auditoría</span>
                  <span className="sm:hidden">Audit.</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <GeneralInfoTab />
              </TabsContent>

              <TabsContent value="certifications">
                <CertificationsTab />
              </TabsContent>

              <TabsContent value="legal">
                <LegalDocumentsTab />
              </TabsContent>

              <TabsContent value="audit">
                <AuditTab />
              </TabsContent>
            </Tabs>
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