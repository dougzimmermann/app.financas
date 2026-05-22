"use client";

import { ArrowDownCircle, ArrowUpCircle, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  loading?: boolean;
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  colorClass,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
  loading?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            {loading ? (
              <div className="h-7 w-32 bg-muted animate-pulse rounded-md" />
            ) : (
              <p className={cn("text-2xl font-bold tracking-tight tabular-nums", colorClass)}>
                {formatCurrency(value)}
              </p>
            )}
          </div>
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", colorClass === "text-foreground" ? "bg-muted" : colorClass.includes("green") || colorClass.includes("accent") ? "bg-accent/15" : colorClass.includes("red") || colorClass.includes("destructive") ? "bg-destructive/15" : "bg-primary/15")}>
            <Icon className={cn("w-5 h-5", colorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ totalIncome, totalExpenses, balance, loading }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SummaryCard
        title="Receitas"
        value={totalIncome}
        icon={ArrowUpCircle}
        colorClass="text-accent"
        loading={loading}
      />
      <SummaryCard
        title="Despesas"
        value={totalExpenses}
        icon={ArrowDownCircle}
        colorClass="text-destructive"
        loading={loading}
      />
      <SummaryCard
        title="Saldo"
        value={balance}
        icon={Wallet}
        colorClass={balance >= 0 ? "text-primary" : "text-destructive"}
        loading={loading}
      />
    </div>
  );
}
