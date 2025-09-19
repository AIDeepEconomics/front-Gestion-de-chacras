import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Eye, Edit, X, FileDown } from "lucide-react";
import { SalesOrder } from "@shared/schema";
import SalesOrderWizard from "./SalesOrderWizard";

export default function TrazabilidadManagement() {
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [showTraceabilityModal, setShowTraceabilityModal] = useState(false);

  // Mock sales orders data - initially load mock data, but allow updates
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([
    {
      id: "so1",
      orderNumber: "OV-2024-001",
      clientName: "Cooperativa Tacuarembó",
      destination: "Montevideo",
      totalTonnage: "500.00",
      qualityRequirements: JSON.stringify({
        variety: "INIA Olimar",
        moisture: "14%",
        purity: "98%"
      }),
      status: "En Proceso",
      orderDate: "2024-09-15T10:00:00.000Z",
      estimatedDeliveryDate: "2024-09-25T10:00:00.000Z",
      notes: "Entrega urgente para exportación",
      createdAt: "2024-09-15T10:00:00.000Z"
    },
    {
      id: "so2", 
      orderNumber: "OV-2024-002",
      clientName: "Molinos del Uruguay SA",
      destination: "Paysandú",
      totalTonnage: "1200.00",
      qualityRequirements: JSON.stringify({
        variety: "El Paso 144",
        moisture: "13.5%",
        purity: "99%"
      }),
      status: "Lista",
      orderDate: "2024-09-12T14:30:00.000Z",
      estimatedDeliveryDate: "2024-09-22T14:30:00.000Z",
      notes: "Cliente preferencial",
      createdAt: "2024-09-12T14:30:00.000Z"
    },
    {
      id: "so3",
      orderNumber: "OV-2024-003", 
      clientName: "Arrocera San José",
      destination: "Canelones",
      totalTonnage: "800.00",
      qualityRequirements: JSON.stringify({
        variety: "INIA Olimar",
        moisture: "14%",
        purity: "97%"
      }),
      status: "Virgen",
      orderDate: "2024-09-18T09:15:00.000Z",
      estimatedDeliveryDate: "2024-09-28T09:15:00.000Z",
      notes: "",
      createdAt: "2024-09-18T09:15:00.000Z"
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "Virgen": { variant: "secondary" as const, className: "bg-gray-100 text-gray-800" },
      "En Proceso": { variant: "default" as const, className: "bg-blue-100 text-blue-800" },
      "Lista": { variant: "default" as const, className: "bg-green-100 text-green-800" },
      "Despachando": { variant: "default" as const, className: "bg-orange-100 text-orange-800" },
      "Despachada": { variant: "default" as const, className: "bg-purple-100 text-purple-800" },
      "Rechazada": { variant: "destructive" as const, className: "bg-red-100 text-red-800" },
      "Cancelada": { variant: "outline" as const, className: "bg-gray-50 text-gray-600" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig["Virgen"];
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-UY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return "-";
    }
  };

  const handleViewTraceability = (order: SalesOrder) => {
    setSelectedOrder(order);
    setShowTraceabilityModal(true);
  };

  const handleEditOrder = (order: SalesOrder) => {
    // TODO: Implement edit functionality
    console.log("Edit order:", order.orderNumber);
  };

  const handleCancelOrder = (order: SalesOrder) => {
    // TODO: Implement cancel functionality
    console.log("Cancel order:", order.orderNumber);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Gestión de Trazabilidad
          </h2>
          <p className="text-muted-foreground mt-1">
            Crear y gestionar órdenes de venta con trazabilidad completa desde chacra hasta cliente
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => setShowCreateWizard(true)}
          data-testid="button-create-sales-order"
        >
          <Plus className="h-4 w-4" />
          Crear Nueva Orden de Venta
        </Button>
      </div>

      {/* Tabla de Órdenes de Venta */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Órdenes de Venta</CardTitle>
        </CardHeader>
        <CardContent>
          {salesOrders.length > 0 ? (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Orden</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead className="text-right">Tonelaje Total</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[100px]">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesOrders.map((order) => (
                    <TableRow key={order.id} data-testid={`row-sales-order-${order.id}`}>
                      <TableCell className="font-mono font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.clientName}</TableCell>
                      <TableCell>{order.destination}</TableCell>
                      <TableCell className="text-right font-mono">
                        {parseFloat(order.totalTonnage || "0").toLocaleString()} t
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(order.orderDate || "")}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status || "Virgen")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-actions-${order.id}`}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewTraceability(order)}
                              data-testid={`menu-view-traceability-${order.id}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Trazabilidad Completa
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditOrder(order)}
                              data-testid={`menu-edit-order-${order.id}`}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleCancelOrder(order)}
                              className="text-destructive"
                              data-testid={`menu-cancel-order-${order.id}`}
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancelar Orden
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FileDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No hay órdenes de venta</h3>
              <p className="mb-4">Comience creando su primera orden de venta con trazabilidad completa.</p>
              <Button 
                onClick={() => setShowCreateWizard(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Crear Primera Orden
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sales Order Creation Wizard */}
      <SalesOrderWizard
        open={showCreateWizard}
        onOpenChange={setShowCreateWizard}
        onOrderCreated={(newOrder) => {
          // Add the new order to the existing orders list
          setSalesOrders(prevOrders => [...prevOrders, newOrder]);
        }}
      />

      {/* TODO: Implement Traceability Modal */}
      {showTraceabilityModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg max-w-md">
            <h3 className="text-lg font-semibold mb-4">Trazabilidad Completa</h3>
            <p className="text-muted-foreground mb-4">
              Orden: {selectedOrder.orderNumber}<br />
              Cliente: {selectedOrder.clientName}
            </p>
            <Button onClick={() => setShowTraceabilityModal(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}