import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import MillManagement from "@/components/MillManagement";
import ChacrasManagement from "@/components/ChacrasManagement";
import EventsManagement from "@/components/EventsManagement";
import EmptyStateCard from "@/components/EmptyStateCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("principal");

  const tabs = [
    { id: "principal", label: "Principal" },
    { id: "chacras", label: "Gestión de Chacras y Polígonos" },
    { id: "eventos", label: "Eventos" },
    { id: "cosecha", label: "Cosecha" },
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
          <EmptyStateCard
            title="Gestión de Cosecha"
            description="Administre los procesos de cosecha, remitos y envíos a molinos. Esta sección permitirá coordinar directamente con los molinos asociados para el levantamiento del arroz."
          />
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