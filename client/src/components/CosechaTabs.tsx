import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Package, List } from "lucide-react";
import ChacrasFiltersComponent, { ChacrasFilters } from "./ChacrasFilters";
import ChacrasSelectionTable from "./ChacrasSelectionTable";
import RemitosList from "./RemitosList";
import { Chacra, Remito } from "@shared/schema";

interface CosechaTabsProps {
  chacras: Chacra[];
  remitos: Remito[];
  selectedChacras: string[];
  onChacraSelectionChange: (chacraId: string, selected: boolean) => void;
}

export default function CosechaTabs({ 
  chacras, 
  remitos, 
  selectedChacras, 
  onChacraSelectionChange 
}: CosechaTabsProps) {
  const [activeTab, setActiveTab] = useState<"chacras" | "remitos">("chacras");
  const [chacrasFilters, setChacrasFilters] = useState<ChacrasFilters>({
    establishment: "all",
    area: "all",
    regime: "all"
  });

  const handleChacrasFilterChange = (newFilters: ChacrasFilters) => {
    setChacrasFilters(newFilters);
    console.log("Chacras filters changed:", newFilters);
  };

  const tabs = [
    {
      id: "chacras" as const,
      label: "Lista de Chacras",
      icon: Package,
      count: chacras.length
    },
    {
      id: "remitos" as const,
      label: "Lista de Remitos", 
      icon: List,
      count: remitos.length
    }
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant="ghost"
              className={`px-4 py-2 rounded-none border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`tab-${tab.id}`}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
              <span className="ml-2 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "chacras" && (
          <div className="space-y-6">
            <ChacrasFiltersComponent onFilterChange={handleChacrasFilterChange} />
            <ChacrasSelectionTable
              chacras={chacras}
              filters={chacrasFilters}
              selectedChacras={selectedChacras}
              onChacraSelectionChange={onChacraSelectionChange}
            />
          </div>
        )}

        {activeTab === "remitos" && (
          <RemitosList remitos={remitos} />
        )}
      </div>
    </div>
  );
}