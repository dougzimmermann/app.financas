"use client";

import Link from "next/link";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
}

export function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base">Últimas Transações</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/transactions" className="text-xs text-muted-foreground hover:text-foreground">
            Ver todas
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="px-6 pb-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="px-6 pb-6 text-center text-muted-foreground text-sm">
            Nenhuma transação registrada
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((t) => (
              <li key={t.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors">
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
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description}</p>
                  <p className="text-xs text-muted-foreground">{t.category} · {formatDate(t.date)}</p>
                </div>
                <span className={cn(
                  "text-sm font-semibold tabular-nums shrink-0",
                  t.type === "income" ? "text-accent" : "text-destructive"
                )}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
