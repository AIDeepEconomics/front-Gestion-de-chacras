import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Truck, Sun, Warehouse, Cog, Send, Search, Filter, Grid, List, MapPin, Bell, Scale, FlaskConical, Droplets, Timer, TestTube, AlertCircle, CheckCircle, Clock } from "lucide-react";
import PlantList from "./PlantList";
import PlantDetails from "./PlantDetails";
import { IndustrialPlant, Silo, RiceBatch } from "@shared/schema";

export default function PlantasySilos() {
  const [selectedPlant, setSelectedPlant] = useState<IndustrialPlant | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'process'>('list');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'alert'>('all');

  // Panel de Control de Portería - Cola de camiones
  const truckQueue = [
    {
      id: "ABC123",
      producer: "Juan Pérez",
      remito: "R-2024-001",
      status: "waiting",
      estimatedTonnage: 45.5,
      arrivalTime: "08:30",
      waitTime: "15 min"
    },
    {
      id: "XYZ789",
      producer: "María Gómez",
      remito: "R-2024-002",
      status: "weighing",
      estimatedTonnage: 52.0,
      arrivalTime: "09:00",
      waitTime: "5 min"
    },
    {
      id: "LMN456",
      producer: "Pedro Silva",
      remito: "R-2024-003",
      status: "sampling",
      estimatedTonnage: 38.2,
      arrivalTime: "09:15",
      waitTime: "10 min"
    }
  ];

  // Datos de pozos de descarga
  const dischargePits = [
    {
      id: "pozo-1",
      name: "Pozo 1",
      status: "occupied",
      content: 45,
      origin: ["R-001", "R-002"],
      avgHumidity: 18.5,
      destination: "Secadora S-1"
    },
    {
      id: "pozo-2",
      name: "Pozo 2",
      status: "available",
      content: 0,
      origin: [],
      avgHumidity: 0,
      destination: ""
    }
  ];

  // Datos de Laboratorio - Muestras y Análisis
  const labSamples = [
    {
      id: "M-001",
      lote: "R-001",
      status: "completed",
      results: {
        humidity: 16.0,
        impurities: 2.0,
        brokenGrain: 3.0,
        grade: "Estándar"
      },
      recommendation: "Directo a secadora",
      analyst: "Dr. Martínez",
      completedAt: "09:45"
    },
    {
      id: "M-002",
      lote: "R-002",
      status: "in_progress",
      results: null,
      recommendation: "",
      analyst: "Dra. García",
      estimatedCompletion: "10:30"
    },
    {
      id: "M-003", 
      lote: "R-003",
      status: "pending",
      results: null,
      recommendation: "",
      analyst: "",
      priority: "alta"
    }
  ];

  // Datos de Secadoras
  const dryers = [
    {
      id: "S-1",
      name: "Secadora S-1",
      status: "active",
      currentLot: "LS-2024-045",
      origin: ["R-001", "R-002"],
      tonnage: 85,
      inputHumidity: 18.5,
      targetHumidity: 13.0,
      currentHumidity: 15.2,
      timeRemaining: 4.5,
      progress: 75,
      temperature: 65,
      airFlow: 2500,
      gasConsumption: 45
    },
    {
      id: "S-2",
      name: "Secadora S-2",
      status: "maintenance",
      currentLot: "",
      origin: [],
      tonnage: 0,
      inputHumidity: 0,
      targetHumidity: 0,
      currentHumidity: 0,
      timeRemaining: 0,
      progress: 0,
      temperature: 0,
      airFlow: 0,
      gasConsumption: 0
    }
  ];

  const getSampleStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getSampleStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in_progress": return Clock;
      case "pending": return AlertCircle;
      default: return TestTube;
    }
  };

  const getDryerStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "idle": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      case "maintenance": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default: return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getTruckStatusColor = (status: string) => {
    switch (status) {
      case "waiting": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "weighing": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "sampling": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "discharging": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getTruckStatusText = (status: string) => {
    switch (status) {
      case "waiting": return "Esperando";
      case "weighing": return "En báscula";
      case "sampling": return "Muestreo";
      case "discharging": return "Descargando";
      default: return "Desconocido";
    }
  };

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

      {/* Panel de Control de Portería */}
      {selectedPlant && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Control de Portería - {selectedPlant.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cola de Camiones */}
                <div className="lg:col-span-2">
                  <div className="mb-3">
                    <h4 className="font-medium text-sm">Cola de Camiones en Espera</h4>
                  </div>
                  <div className="border rounded-md">
                    <div className="grid grid-cols-6 gap-2 p-3 bg-muted text-xs font-medium">
                      <div>Camión</div>
                      <div>Productor</div>
                      <div>e-Remito</div>
                      <div>Tonelaje</div>
                      <div>Estado</div>
                      <div>Tiempo</div>
                    </div>
                    <div className="divide-y">
                      {truckQueue.map((truck) => (
                        <div key={truck.id} className="grid grid-cols-6 gap-2 p-3 text-xs items-center">
                          <div className="font-mono">{truck.id}</div>
                          <div>{truck.producer}</div>
                          <div className="font-mono text-blue-600">{truck.remito}</div>
                          <div>{truck.estimatedTonnage} t</div>
                          <div>
                            <Badge className={`text-xs ${getTruckStatusColor(truck.status)}`}>
                              {getTruckStatusText(truck.status)}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground">{truck.waitTime}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Proceso de Pesaje */}
                <div>
                  <div className="mb-3">
                    <h4 className="font-medium text-sm">Proceso Activo</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="border rounded-md p-3 bg-blue-50 dark:bg-blue-950">
                      <div className="flex items-center gap-2 mb-2">
                        <Scale className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">Pesaje en Curso</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Camión: XYZ789</div>
                        <div>Peso bruto: 32,450 kg</div>
                        <div>Tara: 12,200 kg</div>
                        <div className="font-medium">Neto: 20,250 kg</div>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-3 bg-purple-50 dark:bg-purple-950">
                      <div className="flex items-center gap-2 mb-2">
                        <FlaskConical className="h-4 w-4 text-purple-600" />
                        <span className="font-medium text-sm">Análisis Rápido</span>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Humedad:</span>
                          <span className="font-medium">16.8%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Impurezas:</span>
                          <span className="font-medium">2.1%</span>
                        </div>
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            Requiere Secado
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pozos de Descarga */}
      {selectedPlant && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Warehouse className="h-5 w-5" />
                Pozos de Descarga
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dischargePits.map((pit) => (
                  <div key={pit.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{pit.name}</h4>
                      <Badge className={pit.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                        {pit.status === 'occupied' ? 'OCUPADO' : 'DISPONIBLE'}
                      </Badge>
                    </div>
                    
                    {pit.status === 'occupied' && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Contenido:</span>
                          <span className="font-medium">{pit.content} tons</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Origen:</span>
                          <span className="font-mono text-blue-600">{pit.origin.join(", ")}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Humedad promedio:</span>
                          <span className="font-medium flex items-center gap-1">
                            <Droplets className="h-3 w-3 text-blue-500" />
                            {pit.avgHumidity}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Destino:</span>
                          <span className="font-medium">{pit.destination}</span>
                        </div>
                        <div className="mt-3">
                          <Button size="sm" className="w-full">
                            Iniciar Transferencia
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {pit.status === 'available' && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        Listo para recibir carga
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Panel de Laboratorio */}
      {selectedPlant && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Laboratorio - Análisis de Muestras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <div className="grid grid-cols-7 gap-2 p-3 bg-muted text-xs font-medium">
                  <div>Muestra</div>
                  <div>Lote</div>
                  <div>Estado</div>
                  <div>Resultados</div>
                  <div>Recomendación</div>
                  <div>Analista</div>
                  <div>Acción</div>
                </div>
                <div className="divide-y">
                  {labSamples.map((sample) => {
                    const StatusIcon = getSampleStatusIcon(sample.status);
                    return (
                      <div key={sample.id} className="grid grid-cols-7 gap-2 p-3 text-xs items-center">
                        <div className="font-mono text-blue-600">{sample.id}</div>
                        <div className="font-mono">{sample.lote}</div>
                        <div>
                          <Badge className={`text-xs flex items-center gap-1 ${getSampleStatusColor(sample.status)}`}>
                            <StatusIcon className="h-3 w-3" />
                            {sample.status === 'completed' ? 'Completado' : 
                             sample.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                          </Badge>
                        </div>
                        <div>
                          {sample.results ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Droplets className="h-3 w-3 text-blue-500" />
                                <span>Hum: {sample.results.humidity}%</span>
                              </div>
                              <div>Imp: {sample.results.impurities}%</div>
                              <div>Part: {sample.results.brokenGrain}%</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                        <div>
                          {sample.recommendation ? (
                            <Badge variant="outline" className="text-xs">
                              {sample.recommendation}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </div>
                        <div>{sample.analyst || '-'}</div>
                        <div>
                          {sample.status === 'pending' && (
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              Iniciar
                            </Button>
                          )}
                          {sample.status === 'completed' && (
                            <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                              Ver
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Panel de Control de Secadoras */}
      {selectedPlant && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Control de Secadoras
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dryers.map((dryer) => (
                  <div key={dryer.id} className="border rounded-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{dryer.name}</h4>
                      <Badge className={getDryerStatusColor(dryer.status)}>
                        {dryer.status === 'active' ? 'EN PROCESO' : 
                         dryer.status === 'maintenance' ? 'MANTENIMIENTO' : 'INACTIVA'}
                      </Badge>
                    </div>

                    {dryer.status === 'active' && (
                      <div className="space-y-3">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Lote en proceso:</span>
                            <span className="font-mono text-blue-600">{dryer.currentLot}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Origen:</span>
                            <span className="font-mono text-xs">{dryer.origin.join(", ")}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tonelaje:</span>
                            <span className="font-medium">{dryer.tonnage} tons</span>
                          </div>
                        </div>

                        <div className="bg-muted rounded p-3 text-xs space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Progreso:</span>
                            <span className="font-medium">{dryer.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${dryer.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between">
                            <span>Tiempo restante:</span>
                            <span className="font-medium">{dryer.timeRemaining}h</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-background rounded p-2">
                            <div className="font-medium mb-1">Humedad</div>
                            <div>{dryer.inputHumidity}% → {dryer.currentHumidity}% → {dryer.targetHumidity}%</div>
                          </div>
                          <div className="bg-background rounded p-2">
                            <div className="font-medium mb-1">Temperatura</div>
                            <div>{dryer.temperature}°C</div>
                          </div>
                          <div className="bg-background rounded p-2">
                            <div className="font-medium mb-1">Flujo de aire</div>
                            <div>{dryer.airFlow.toLocaleString()} m³/h</div>
                          </div>
                          <div className="bg-background rounded p-2">
                            <div className="font-medium mb-1">Consumo gas</div>
                            <div>{dryer.gasConsumption} m³/h</div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            Pausar
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Ajustar
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            Muestrear
                          </Button>
                        </div>
                      </div>
                    )}

                    {dryer.status === 'maintenance' && (
                      <div className="text-center py-6 text-muted-foreground text-sm">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-500" />
                        <div>Mantenimiento programado</div>
                        <div className="text-xs mt-1">Disponible mañana</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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