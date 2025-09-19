import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SalesOrderStep1 from "./SalesOrderStep1";
import SalesOrderStep2 from "./SalesOrderStep2";
import SalesOrderStep3 from "./SalesOrderStep3";

interface SalesOrderWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrderCreated?: (newOrder: any) => void; // TODO: Use proper SalesOrder type
}

export interface OrderGeneralData {
  clientName: string;
  destination: string;
  totalTonnage: string;
  qualityRequirements: {
    variety?: string;
    moisture?: string;
    purity?: string;
    certifications?: string[];
  };
  estimatedDeliveryDate: string;
  notes: string;
}

export interface BatchAssignment {
  siloId: string;
  siloName: string;
  riceBatchId: string;
  remitoId: string;
  chacraName: string;
  variety: string;
  assignedTonnage: number;
  availableTonnage: number;
}

export interface TraceabilitySummary {
  chacraBreakdown: {
    chacraName: string;
    producer: string;
    variety: string;
    percentage: number;
    tonnage: number;
  }[];
  sustainabilityMetrics: {
    carbonFootprintPerTon: number;
    waterUsagePerTon: number;
    energyUsagePerTon: number;
  };
}

export default function SalesOrderWizard({ open, onOpenChange, onOrderCreated }: SalesOrderWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderGeneralData>({
    clientName: "",
    destination: "",
    totalTonnage: "",
    qualityRequirements: {},
    estimatedDeliveryDate: "",
    notes: "",
  });
  const [batchAssignments, setBatchAssignments] = useState<BatchAssignment[]>([]);
  const [traceabilitySummary, setTraceabilitySummary] = useState<TraceabilitySummary>({
    chacraBreakdown: [],
    sustainabilityMetrics: {
      carbonFootprintPerTon: 0,
      waterUsagePerTon: 0,
      energyUsagePerTon: 0,
    },
  });

  const steps = [
    { number: 1, title: "Datos Generales" },
    { number: 2, title: "Asignación de Lotes" },
    { number: 3, title: "Resumen y Confirmación" },
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Reset wizard state
    setCurrentStep(1);
    setOrderData({
      clientName: "",
      destination: "",
      totalTonnage: "",
      qualityRequirements: {},
      estimatedDeliveryDate: "",
      notes: "",
    });
    setBatchAssignments([]);
    setTraceabilitySummary({
      chacraBreakdown: [],
      sustainabilityMetrics: {
        carbonFootprintPerTon: 0,
        waterUsagePerTon: 0,
        energyUsagePerTon: 0,
      },
    });
    onOpenChange(false);
  };

  const handleOrderCreated = (newOrder: any) => {
    onOrderCreated?.(newOrder);
    handleClose();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SalesOrderStep1
            data={orderData}
            onDataChange={setOrderData}
            onNext={handleNext}
            onCancel={handleClose}
          />
        );
      case 2:
        return (
          <SalesOrderStep2
            orderData={orderData}
            assignments={batchAssignments}
            onAssignmentsChange={setBatchAssignments}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <SalesOrderStep3
            orderData={orderData}
            assignments={batchAssignments}
            summary={traceabilitySummary}
            onSummaryChange={setTraceabilitySummary}
            onOrderCreated={handleOrderCreated}
            onPrevious={handlePrevious}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Crear Nueva Orden de Venta - {steps[currentStep - 1]?.title}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center space-x-2 ${
                  step.number === currentStep
                    ? "text-primary font-medium"
                    : step.number < currentStep
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                    step.number === currentStep
                      ? "bg-primary text-primary-foreground"
                      : step.number < currentStep
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.number}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="flex-1">
          {renderCurrentStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}