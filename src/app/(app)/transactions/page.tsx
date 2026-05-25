"use client";

import { useState } from "react";
import { Plus, Download } from "lucide-react";
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

  function handleExportCSV() {
    const headers = ["Data", "Tipo", "Categoria", "Descrição", "Valor"];
    const rows = transactions.map((t) => [
      t.date,
      t.type === "income" ? "Receita" : "Despesa",
      t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2).replace(".", ","),
    ]);

    const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transacoes_${filters.dateFrom ?? "todas"}_${filters.dateTo ?? ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            disabled={loading || transactions.length === 0}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova transação</span>
          </Button>
        </div>
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
