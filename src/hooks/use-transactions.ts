import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transactionsApi } from "@/lib/api/transactions";
import {
  CreateTransactionDto,
  CreateBatchTransactionDto,
  AiParseTransactionDto,
} from "@/types/api";
import { toast } from "sonner";

export const useTransactions = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["transactions", page, limit],
    queryFn: () => transactionsApi.getAll(page, limit),
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Transaksi berhasil ditambahkan");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Gagal menambahkan transaksi",
      );
    },
  });
};

export const useCreateBatchTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBatchTransactionDto) =>
      transactionsApi.createBatch(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(`${data.length} transaksi berhasil disimpan`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal menyimpan transaksi");
    },
  });
};

export const useAiParse = () => {
  return useMutation({
    mutationFn: transactionsApi.aiParse,
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Gagal memproses teks");
    },
  });
};
