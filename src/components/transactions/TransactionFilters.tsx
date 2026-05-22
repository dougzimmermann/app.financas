"use client";

import { TransactionFilters as Filters, TransactionType } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/utils";

interface TransactionFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const ALL_CATEGORIES = Array.from(
  new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])
).sort();

export function TransactionFilters({ filters, onFiltersChange }: TransactionFiltersProps) {
  const hasActiveFilters =
    (filters.type && filters.type !== "all") ||
    filters.category ||
    filters.dateFrom ||
    filters.dateTo;

  function clearFilters() {
    onFiltersChange({ type: "all", category: "", dateFrom: "", dateTo: "" });
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Tipo</Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(v) =>
              onFiltersChange({ ...filters, type: v as TransactionType | "all" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Receitas</SelectItem>
              <SelectItem value="expense">Despesas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Categoria</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(v) =>
              onFiltersChange({ ...filters, category: v === "all" ? "" : v })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {ALL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dateFrom" className="text-xs text-muted-foreground">
            Data inicial
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateFrom: e.target.value })
            }
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dateTo" className="text-xs text-muted-foreground">
            Data final
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, dateTo: e.target.value })
            }
          />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-border">
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-7 px-2 text-xs">
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
