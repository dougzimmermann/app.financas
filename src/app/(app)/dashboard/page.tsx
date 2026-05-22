"use client";

import { useMemo, useState } from "react";
import { format, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { Button } from "@/components/ui/button";
import { CategoryData } from "@/types";
import { CATEGORY_COLORS } from "@/lib/utils";

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);

  const monthStart = format(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    "yyyy-MM-dd"
  );
  const monthEnd = format(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    "yyyy-MM-dd"
  );

  const { transactions, loading, addTransaction } = useTransactions({
    dateFrom: monthStart,
    dateTo: monthEnd,
  });

  const { totalIncome, totalExpenses, balance, expenseByCategory } = useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenseMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expenseMap[t.category] = (expenseMap[t.category] || 0) + Number(t.amount);
      });

    const expenseByCategory: CategoryData[] = Object.entries(expenseMap)
      .map(([name, value]) => ({
        name,
        value,
        color: CATEGORY_COLORS[name] || "#6B7280",
      }))
      .sort((a, b) => b.value - a.value);

    return { totalIncome, totalExpenses, balance: totalIncome - totalExpenses, expenseByCategory };
  }, [transactions]);

  const monthLabel = format(currentDate, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5 capitalize">{monthLabel}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setCurrentDate((d) => subMonths(d, 1))}
              className="px-2.5 py-2 hover:bg-muted transition-colors cursor-pointer"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-sm font-medium capitalize border-x border-border">
              {format(currentDate, "MMM yyyy", { locale: ptBR })}
            </span>
            <button
              onClick={() => setCurrentDate((d) => addMonths(d, 1))}
              className="px-2.5 py-2 hover:bg-muted transition-colors cursor-pointer"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nova transação</span>
          </Button>
        </div>
      </div>

      <SummaryCards
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
        loading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ExpenseChart data={expenseByCategory} loading={loading} />
        <RecentTransactions transactions={transactions} loading={loading} />
      </div>

      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={addTransaction}
      />
    </div>
  );
}
