import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Map, Plus } from "lucide-react";

interface Establishment {
  id: string;
  name: string;
}

interface MapTabsProps {
  establishments: Establishment[];
  onAddEstablishment?: () => void;
}

export default function MapTabs({ establishments, onAddEstablishment }: MapTabsProps) {
  const [activeTab, setActiveTab] = useState(establishments[0]?.id || "new");

  const tabs = [
    ...establishments,
    { id: "new", name: "Nuevo Establecimiento" }
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-border">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            className={`px-4 py-2 rounded-none border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setActiveTab(tab.id);
              if (tab.id === "new" && onAddEstablishment) {
                console.log("Add new establishment clicked");
                onAddEstablishment();
              }
            }}
            data-testid={`tab-establishment-${tab.id}`}
          >
            {tab.id === "new" && <Plus className="h-4 w-4 mr-2" />}
            {tab.name}
          </Button>
        ))}
      </div>

      {/* Map Display */}
      <Card className="w-full h-80">
        <CardContent className="flex items-center justify-center h-full p-0">
          <div className="text-center space-y-4">
            <div className="p-4 bg-muted rounded-full inline-block">
              <Map className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {activeTab === "new" 
                  ? "Nuevo Establecimiento" 
                  : tabs.find(t => t.id === activeTab)?.name
                }
              </h3>
              <p className="text-muted-foreground">
                Mapa del establecimiento
              </p>
              {activeTab !== "new" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Mostrando polígonos y chacras del establecimiento
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}