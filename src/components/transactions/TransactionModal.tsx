"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Transaction, TransactionInsert, TransactionType } from "@/types";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: TransactionInsert) => Promise<boolean>;
  transaction?: Transaction;
}

const today = new Date().toISOString().split("T")[0];

export function TransactionModal({
  open,
  onOpenChange,
  onSave,
  transaction,
}: TransactionModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(today);

  const isEditing = !!transaction;
  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (open) {
      if (transaction) {
        setType(transaction.type);
        setAmount(String(transaction.amount));
        setDescription(transaction.description);
        setCategory(transaction.category);
        setDate(transaction.date);
      } else {
        setType("expense");
        setAmount("");
        setDescription("");
        setCategory("");
        setDate(today);
      }
    }
  }, [open, transaction]);

  // Reset category when type changes
  useEffect(() => {
    setCategory("");
  }, [type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({ variant: "destructive", title: "Valor inválido", description: "Informe um valor maior que zero." });
      return;
    }
    if (!category) {
      toast({ variant: "destructive", title: "Selecione uma categoria" });
      return;
    }

    setLoading(true);
    const success = await onSave({
      type,
      amount: parsedAmount,
      description: description.trim(),
      category,
      date,
    });
    setLoading(false);

    if (success) {
      toast({
        title: isEditing ? "Transação atualizada" : "Transação adicionada",
        variant: "success" as "default",
      });
      onOpenChange(false);
    } else {
      toast({ variant: "destructive", title: "Erro ao salvar transação" });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType("expense")}
                className={cn(
                  "py-2.5 rounded-lg text-sm font-medium transition-all border cursor-pointer",
                  type === "expense"
                    ? "bg-destructive/20 border-destructive text-destructive"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                className={cn(
                  "py-2.5 rounded-lg text-sm font-medium transition-all border cursor-pointer",
                  type === "income"
                    ? "bg-accent/20 border-accent text-accent"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                Receita
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              inputMode="decimal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Almoço, Salário..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              max={today}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Salvando...
                </>
              ) : isEditing ? (
                "Salvar alterações"
              ) : (
                "Adicionar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
