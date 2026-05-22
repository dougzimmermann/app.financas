"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { TransactionList } from "@/components/transactions/TransactionList";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { Button } from "@/components/ui/button";
import { TransactionFilters as Filters, TransactionInsert } from "@/types";
import { getCurrentMonthRange } from "@/lib/utils";

export default function TransactionsPage() {
  const { start, end } = getCurrentMonthRange();
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    type: "all",
    category: "",
    dateFrom: start,
    dateTo: end,
  });

  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } =
    useTransactions(filters);

  async function handleAdd(data: TransactionInsert): Promise<boolean> {
    return addTransaction(data);
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {loading ? "Carregando..." : `${transactions.length} transaç${transactions.length === 1 ? "ão" : "ões"} encontrada${transactions.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nova transação</span>
        </Button>
      </div>

      <TransactionFilters filters={filters} onFiltersChange={setFilters} />

      <TransactionList
        transactions={transactions}
        loading={loading}
        onUpdate={updateTransaction}
        onDelete={deleteTransaction}
      />

      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={handleAdd}
      />
    </div>
  );
}
