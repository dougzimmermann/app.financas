"use client";

import { useState } from "react";
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Transaction, TransactionInsert, TransactionUpdate } from "@/types";
import { TransactionModal } from "./TransactionModal";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  onUpdate: (data: TransactionUpdate) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export function TransactionList({
  transactions,
  loading,
  onUpdate,
  onDelete,
}: TransactionListProps) {
  const { toast } = useToast();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);

  async function handleUpdate(data: TransactionInsert): Promise<boolean> {
    if (!editingTransaction) return false;
    return onUpdate({ ...data, id: editingTransaction.id });
  }

  async function handleDelete() {
    if (!deletingTransaction) return;
    const success = await onDelete(deletingTransaction.id);
    if (success) {
      toast({ title: "Transação excluída" });
    } else {
      toast({ variant: "destructive", title: "Erro ao excluir" });
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-4 bg-card border border-border rounded-xl">
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-36 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center bg-card border border-border rounded-xl">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
          <ArrowUpCircle className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">Nenhuma transação encontrada</p>
        <p className="text-xs text-muted-foreground mt-1">
          Tente ajustar os filtros ou adicione uma nova transação
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-border text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Descrição</span>
          <span className="text-right">Categoria</span>
          <span className="text-right">Data</span>
          <span className="text-right">Valor</span>
          <span />
        </div>

        <ul className="divide-y divide-border">
          {transactions.map((t) => (
            <li
              key={t.id}
              className="grid grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_auto_auto_auto_auto] items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-muted/30 transition-colors group"
            >
              {/* Icon */}
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                t.type === "income" ? "bg-accent/15" : "bg-destructive/15"
              )}>
                {t.type === "income" ? (
                  <ArrowUpCircle className="w-4 h-4 text-accent" />
                ) : (
                  <ArrowDownCircle className="w-4 h-4 text-destructive" />
                )}
              </div>

              {/* Description + mobile info */}
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground sm:hidden">
                  {t.category} · {formatDate(t.date)}
                </p>
              </div>

              {/* Category - desktop */}
              <span className="hidden sm:block text-sm text-muted-foreground text-right">
                {t.category}
              </span>

              {/* Date - desktop */}
              <span className="hidden sm:block text-sm text-muted-foreground text-right tabular-nums">
                {formatDate(t.date)}
              </span>

              {/* Amount + actions */}
              <div className="flex items-center gap-2 justify-end">
                <span className={cn(
                  "text-sm font-semibold tabular-nums",
                  t.type === "income" ? "text-accent" : "text-destructive"
                )}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setEditingTransaction(t)}
                    aria-label="Editar"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeletingTransaction(t)}
                    aria-label="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <TransactionModal
        open={!!editingTransaction}
        onOpenChange={(open) => !open && setEditingTransaction(null)}
        onSave={handleUpdate}
        transaction={editingTransaction ?? undefined}
      />

      <DeleteConfirmDialog
        open={!!deletingTransaction}
        onOpenChange={(open) => !open && setDeletingTransaction(null)}
        onConfirm={handleDelete}
        description={deletingTransaction?.description}
      />
    </>
  );
}
