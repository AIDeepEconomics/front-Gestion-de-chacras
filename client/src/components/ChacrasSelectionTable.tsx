import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Chacra } from "@shared/schema";
import { ChacrasFilters } from "./ChacrasFilters";

type SortField = "name" | "area" | "regime" | "establishmentName";
type SortDirection = "asc" | "desc";

interface ChacrasSelectionTableProps {
  chacras: Chacra[];
  filters: ChacrasFilters;
  selectedChacras: string[];
  onChacraSelectionChange: (chacraId: string, selected: boolean) => void;
}

const regimeColors = {
  "propiedad": "bg-primary text-primary-foreground",
  "arrendamiento": "bg-secondary text-secondary-foreground", 
  "gestionando para terceros": "bg-accent text-accent-foreground"
};

export default function ChacrasSelectionTable({ 
  chacras, 
  filters, 
  selectedChacras, 
  onChacraSelectionChange 
}: ChacrasSelectionTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  // Apply filters
  const filteredChacras = useMemo(() => {
    return chacras.filter(chacra => {
      // Establishment filter
      if (filters.establishment !== "all") {
        const establishmentMatch = chacra.establishmentName.toLowerCase().includes(
          filters.establishment.replace("-", " ")
        );
        if (!establishmentMatch) return false;
      }

      // Regime filter
      if (filters.regime !== "all" && chacra.regime !== filters.regime) {
        return false;
      }

      return true;
    });
  }, [chacras, filters]);

  // Sort filtered chacras
  const sortedAndFilteredChacras = useMemo(() => {
    let result = [...filteredChacras];

    // Apply area sorting from filters first
    if (filters.area === "asc" || filters.area === "desc") {
      result.sort((a, b) => {
        const aArea = parseFloat(a.area);
        const bArea = parseFloat(b.area);
        return filters.area === "asc" ? aArea - bArea : bArea - aArea;
      });
      return result;
    }

    // Apply manual sorting
    return result.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "area":
          aValue = parseFloat(a.area);
          bValue = parseFloat(b.area);
          break;
        default:
          aValue = a[sortField].toLowerCase();
          bValue = b[sortField].toLowerCase();
          break;
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredChacras, filters.area, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    // Don't allow manual area sorting if filter area sorting is active
    if (field === "area" && filters.area !== "all") return;

    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    console.log(`Sorting by ${field} in ${sortDirection === "asc" ? "desc" : "asc"} order`);
  };

  const handleSelectAll = (checked: boolean) => {
    sortedAndFilteredChacras.forEach((chacra) => {
      if (checked !== selectedChacras.includes(chacra.id)) {
        onChacraSelectionChange(chacra.id, checked);
      }
    });
  };

  const isAllSelected = sortedAndFilteredChacras.length > 0 && 
    sortedAndFilteredChacras.every(chacra => selectedChacras.includes(chacra.id));
  const isSomeSelected = sortedAndFilteredChacras.some(chacra => selectedChacras.includes(chacra.id));

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isAreaWithFilter = field === "area" && filters.area !== "all";
    
    return (
      <Button
        variant="ghost"
        className={`h-auto p-0 font-semibold justify-start hover:bg-transparent ${
          isAreaWithFilter ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={() => handleSort(field)}
        disabled={isAreaWithFilter}
        data-testid={`sort-${field}`}
      >
        {children}
        {isAreaWithFilter && (
          <span className="ml-2 text-xs text-muted-foreground">(filtrado)</span>
        )}
        {!isAreaWithFilter && (
          <div className="ml-2 flex flex-col">
            <ChevronUp 
              className={`h-3 w-3 ${
                sortField === field && sortDirection === "asc" 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`} 
            />
            <ChevronDown 
              className={`h-3 w-3 -mt-1 ${
                sortField === field && sortDirection === "desc" 
                  ? "text-primary" 
                  : "text-muted-foreground"
              }`} 
            />
          </div>
        )}
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">
            Lista de Chacras
          </h3>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="select-all-chacras"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              data-testid="checkbox-select-all-chacras"
            />
            <label htmlFor="select-all-chacras" className="text-sm text-muted-foreground cursor-pointer">
              Seleccionar todas
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {selectedChacras.length > 0 && (
            <Badge variant="default" className="text-sm">
              {selectedChacras.filter(id => sortedAndFilteredChacras.find(c => c.id === id)).length} seleccionadas
            </Badge>
          )}
          <Badge variant="secondary" className="text-sm">
            {sortedAndFilteredChacras.length} de {chacras.length} chacras
          </Badge>
          {(filters.establishment !== "all" || filters.regime !== "all" || filters.area !== "all") && (
            <Badge variant="outline" className="text-sm">
              Filtros activos
            </Badge>
          )}
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12">
                {/* Selection column header */}
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="name">Nombre</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="area">Área (ha)</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="regime">Régimen</SortButton>
              </TableHead>
              <TableHead className="font-semibold">
                <SortButton field="establishmentName">Establecimiento</SortButton>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredChacras.map((chacra) => (
              <TableRow 
                key={chacra.id} 
                className="hover:bg-muted/50"
                data-testid={`row-chacra-${chacra.id}`}
              >
                <TableCell>
                  <Checkbox
                    id={`chacra-select-${chacra.id}`}
                    checked={selectedChacras.includes(chacra.id)}
                    onCheckedChange={(checked) => onChacraSelectionChange(chacra.id, checked as boolean)}
                    data-testid={`checkbox-chacra-${chacra.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{chacra.name}</TableCell>
                <TableCell>{chacra.area}</TableCell>
                <TableCell>
                  <Badge 
                    className={regimeColors[chacra.regime as keyof typeof regimeColors]}
                    variant="secondary"
                  >
                    {chacra.regime}
                  </Badge>
                </TableCell>
                <TableCell>{chacra.establishmentName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedAndFilteredChacras.length === 0 && (
        <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-md">
          <p>No se encontraron chacras que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
}