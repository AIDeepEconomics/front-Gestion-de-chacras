import { useState } from "react";
import TabNavigation from "../TabNavigation";

export default function TabNavigationExample() {
  const [activeTab, setActiveTab] = useState("principal");

  const tabs = [
    { id: "principal", label: "Principal" },
    { id: "chacras", label: "Gestión de Chacras y Polígonos" },
    { id: "eventos", label: "Eventos" },
    { id: "cosecha", label: "Cosecha" },
  ];

  return (
    <div className="w-full">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div className="p-6">
        <p className="text-muted-foreground">
          Contenido de la pestaña: {tabs.find(t => t.id === activeTab)?.label}
        </p>
      </div>
    </div>
  );
}