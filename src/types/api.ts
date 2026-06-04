export interface RegisterDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  message: string;
}

export interface User {
  id: number;
  email: string;
}

export interface Transaction {
  id: number;
  userId: number;
  type: "income" | "expense";
  itemName: string;
  qty: number;
  amount: number;
  total: number;
  createdAt: string | Date;
}

export interface CreateTransactionDto {
  type: "income" | "expense";
  itemName: string;
  qty: number;
  amount: number;
}

export interface CreateBatchTransactionDto {
  transactions: CreateTransactionDto[];
}

export interface AiParseTransactionDto {
  text: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  transactionCount: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
  recentTransactions: Transaction[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
