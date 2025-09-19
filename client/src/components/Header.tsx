import { Wheat } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary rounded-md">
          <Wheat className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Portal de Trazabilidad de Arroz
          </h1>
          <p className="text-sm text-muted-foreground">
            Sistema de gestión para productores rurales
          </p>
        </div>
      </div>
    </header>
  );
}