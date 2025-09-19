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
import { ChevronUp, ChevronDown } from "lucide-react";
import { Chacra } from "@shared/schema";

type SortField = "name" | "area" | "regime" | "establishmentName";
type SortDirection = "asc" | "desc";

interface ChacrasTableProps {
  chacras: Chacra[];
}

const regimeColors = {
  "propiedad": "bg-primary text-primary-foreground",
  "arrendamiento": "bg-secondary text-secondary-foreground", 
  "gestionando para terceros": "bg-accent text-accent-foreground"
};

export default function ChacrasTable({ chacras }: ChacrasTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    console.log(`Sorting by ${field} in ${sortDirection === "asc" ? "desc" : "asc"} order`);
  };

  const sortedChacras = useMemo(() => {
    return [...chacras].sort((a, b) => {
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
  }, [chacras, sortField, sortDirection]);

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      className="h-auto p-0 font-semibold justify-start hover:bg-transparent"
      onClick={() => handleSort(field)}
      data-testid={`sort-${field}`}
    >
      {children}
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
    </Button>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Lista de Chacras
        </h3>
        <Badge variant="secondary" className="text-sm">
          {chacras.length} chacras registradas
        </Badge>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
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
            {sortedChacras.map((chacra) => (
              <TableRow 
                key={chacra.id} 
                className="hover:bg-muted/50"
                data-testid={`row-chacra-${chacra.id}`}
              >
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

      {chacras.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No hay chacras registradas aún.</p>
        </div>
      )}
    </div>
  );
}