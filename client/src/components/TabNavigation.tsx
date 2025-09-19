import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Tab {
  id: string;
  label: string;
  isActive?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="border-b border-border bg-white">
      <div className="flex space-x-8 px-6">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            data-testid={`tab-${tab.id}`}
            className={`relative px-0 py-4 text-sm font-medium rounded-none border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  );
}