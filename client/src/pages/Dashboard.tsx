import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import MillManagement from "@/components/MillManagement";
import ChacrasManagement from "@/components/ChacrasManagement";
import EventsManagement from "@/components/EventsManagement";
import CosechaManagement from "@/components/CosechaManagement";
import PlantasySilos from "@/components/PlantasySilos";
import TrazabilidadManagement from "@/components/TrazabilidadManagement";
import EmptyStateCard from "@/components/EmptyStateCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("principal");

  const tabs = [
    { id: "principal", label: "Principal" },
    { id: "chacras", label: "Gestión de Chacras y Polígonos" },
    { id: "eventos", label: "Eventos" },
    { id: "cosecha", label: "Cosecha" },
    { id: "plantas", label: "Plantas y Silos" },
    { id: "trazabilidad", label: "Trazabilidad" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "principal":
        return (
          <div className="max-w-4xl">
            <MillManagement />
          </div>
        );
      case "chacras":
        return (
          <div className="max-w-6xl">
            <ChacrasManagement />
          </div>
        );
      case "eventos":
        return (
          <div className="max-w-7xl">
            <EventsManagement />
          </div>
        );
      case "cosecha":
        return (
          <div className="max-w-7xl">
            <CosechaManagement />
          </div>
        );
      case "plantas":
        return (
          <div className="max-w-full">
            <PlantasySilos />
          </div>
        );
      case "trazabilidad":
        return (
          <div className="max-w-7xl">
            <TrazabilidadManagement />
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