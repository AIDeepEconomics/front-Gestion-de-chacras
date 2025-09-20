import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Truck, Sun, Warehouse, Cog, Send, Search, Filter, Grid, List, MapPin, Bell } from "lucide-react";
import PlantList from "./PlantList";
import PlantDetails from "./PlantDetails";
import { IndustrialPlant, Silo, RiceBatch } from "@shared/schema";

export default function PlantasySilos() {
  const [selectedPlant, setSelectedPlant] = useState<IndustrialPlant | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'process'>('list');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'alert'>('all');

  // Panel de control - métricas operativas
  const operationalMetrics = {
    receivingQueue: 3,
    activeDrying: { silo: "C-2", timeRemaining: "2h" },
    pendingOrders: { count: 5, tonnage: 450 },
    qualityAlerts: 1,
    alertSilo: "A-1"
  };

  // Estados del flujo de proceso
  const processFlow = [
    { 
      stage: "Recepción", 
      icon: Truck, 
      count: 2, 
      status: "active",
      description: "Camiones en cola"
    },
    { 
      stage: "Secado", 
      icon: Sun, 
      count: 1, 
      status: "active",
      description: "Proceso activo"
    },
    { 
      stage: "Almacenamiento", 
      icon: Warehouse, 
      count: 5, 
      status: "normal",
      description: "Silos ocupados"
    },
    { 
      stage: "Molienda", 
      icon: Cog, 
      count: 0, 
      status: "idle",
      description: "En espera"
    },
    { 
      stage: "Despacho", 
      icon: Send, 
      count: 3, 
      status: "normal",
      description: "Órdenes listas"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "alert": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "idle": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  // TODO: remove mock functionality - comprehensive mock data for plants
  const mockPlants: IndustrialPlant[] = [
    {
      id: "1",
      name: "Planta Industrial SAMAN",
      location: "Treinta y Tres",
      silos: ["Silo A-1", "Silo A-2", "Silo A-3", "Silo B-1", "Silo B-2"]
    },
    {
      id: "2",
      name: "Molino San Fernando",
      location: "Rocha", 
      silos: ["Silo Norte", "Silo Sur", "Silo Centro"]
    },
    {
      id: "3",
      name: "Cooperativa Arrocera del Este",
      location: "Cerro Largo",
      silos: ["Silo 1", "Silo 2", "Silo 3", "Silo 4"]
    },
    {
      id: "4",
      name: "Planta Industrial del Norte",
      location: "Tacuarembó",
      silos: ["Silo Principal", "Silo Secundario"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Gestión de Plantas y Silos
        </h2>
        
        {/* Sistema de Notificaciones */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-bold">2</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            2 alertas activas
          </div>
        </div>
      </div>
      
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex items-center justify-between gap-4 mb-6 p-4 border rounded-lg bg-muted/30">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar plantas o silos..."
              className="w-full pl-10 pr-4 py-2 border rounded-md bg-background text-sm"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              className="border rounded-md px-3 py-2 bg-background text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="alert">Con Alertas</option>
            </select>
          </div>
        </div>
        
        {/* Selectores de Vista */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'process' ? 'default' : 'ghost'}
            className="h-8 px-3"
            onClick={() => setViewMode('process')}
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Panel de Control de Operaciones */}
      {selectedPlant && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Panel de Control</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1">
              <div className="text-foreground">📦 Cola recepción: {operationalMetrics.receivingQueue} camiones</div>
              <div className="text-foreground">🔥 Secado activo: {operationalMetrics.activeDrying.silo} ({operationalMetrics.activeDrying.timeRemaining})</div>
              <div className="text-foreground">📋 Órdenes pendientes: {operationalMetrics.pendingOrders.count} ({operationalMetrics.pendingOrders.tonnage} t)</div>
              {operationalMetrics.qualityAlerts > 0 && (
                <div className="text-red-600 font-medium">⚠️ Alerta calidad: Silo {operationalMetrics.alertSilo}</div>
              )}
            </CardContent>
          </Card>
          
          {/* Flujo Visual de Proceso */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Flujo de Proceso - {selectedPlant.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-2">
                  {processFlow.map((step, index) => (
                    <div key={step.stage} className="flex items-center gap-2">
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`p-2 rounded-lg ${getStatusColor(step.status)}`}>
                          <step.icon className="h-4 w-4" />
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-medium">{step.stage}</div>
                          <Badge variant="secondary" className="text-xs px-1 py-0">
                            {step.count}
                          </Badge>
                          <div className="text-xs text-muted-foreground mt-1">{step.description}</div>
                        </div>
                      </div>
                      {index < processFlow.length - 1 && (
                        <ArrowRight className="h-3 w-3 text-muted-foreground mt-[-20px]" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Panel Izquierdo: Lista de Plantas */}
        <div className="lg:col-span-1">
          <PlantList
            plants={mockPlants}
            selectedPlant={selectedPlant}
            onPlantSelect={setSelectedPlant}
          />
        </div>
        
        {/* Panel Derecho: Detalles y Silos de la Planta */}
        <div className="lg:col-span-2">
          <PlantDetails
            selectedPlant={selectedPlant}
          />
        </div>
      </div>
    </div>
  );
}