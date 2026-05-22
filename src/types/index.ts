export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
  created_at: string;
}

export interface TransactionInsert {
  type: TransactionType;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface TransactionUpdate extends TransactionInsert {
  id: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface TransactionFilters {
  type?: TransactionType | "all";
  category?: string;
  dateFrom?: string;
  dateTo?: string;
}
