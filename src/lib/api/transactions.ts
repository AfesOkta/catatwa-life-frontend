import api from "./client";
import {
  Transaction,
  CreateTransactionDto,
  CreateBatchTransactionDto,
  AiParseTransactionDto,
  ApiResponse,
  PaginatedResponse,
} from "@/types/api";

export const transactionsApi = {
  getAll: async (
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Transaction>>>(`/transactions?page=${page}&limit=${limit}`);
    return response.data.data;
  },
  
  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post<ApiResponse<Transaction>>(
      "/transactions",
      data,
    );
    return response.data.data;
  },
  
  createBatch: async (
    data: CreateBatchTransactionDto,
  ): Promise<Transaction[]> => {
    const response = await api.post<ApiResponse<Transaction[]>>(
      "/transactions/batch",
      data,
    );
    return response.data.data;
  },
  
  getSummary: async (): Promise<any> => {
    const response = await api.get<ApiResponse<any>>("/transactions/summary");
    return response.data.data;
  },
  
  aiParse: async (
    data: AiParseTransactionDto,
  ): Promise<CreateTransactionDto[]> => {
    const response = await api.post<ApiResponse<CreateTransactionDto[]>>(
      "/transactions/ai-parse",
      data,
    );
    return response.data.data;
  },
};
