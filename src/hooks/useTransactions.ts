"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Transaction, TransactionFilters, TransactionInsert, TransactionUpdate } from "@/types";

export function useTransactions(filters?: TransactionFilters) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();

    let query = supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (filters?.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }
    if (filters?.category) {
      query = query.eq("category", filters.category);
    }
    if (filters?.dateFrom) {
      query = query.gte("date", filters.dateFrom);
    }
    if (filters?.dateTo) {
      query = query.lte("date", filters.dateTo);
    }

    const { data, error: fetchError } = await query;

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  }, [filters?.type, filters?.category, filters?.dateFrom, filters?.dateTo]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  async function addTransaction(input: TransactionInsert): Promise<boolean> {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    const { error } = await supabase.from("transactions").insert({
      ...input,
      user_id: userData.user.id,
    });

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchTransactions();
    return true;
  }

  async function updateTransaction(input: TransactionUpdate): Promise<boolean> {
    const supabase = createClient();
    const { id, ...rest } = input;
    const { error } = await supabase
      .from("transactions")
      .update(rest)
      .eq("id", id);

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchTransactions();
    return true;
  }

  async function deleteTransaction(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);

    if (error) {
      setError(error.message);
      return false;
    }

    await fetchTransactions();
    return true;
  }

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
