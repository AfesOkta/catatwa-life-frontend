"use client";

import { useState } from "react";
import { useTransactions } from "@/hooks/use-transactions";
import TransactionCard from "@/components/transactions/transaction-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PAGE_SIZE = 10;

export default function TransactionList() {
  const [page, setPage] = useState(1);
  const { data: paginatedData, isLoading, isError } = useTransactions(page, PAGE_SIZE);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Riwayat Transaksi</CardTitle>
          <CardDescription>Transaksi terbaru Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-12 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Riwayat Transaksi</CardTitle>
          <CardDescription>Transaksi terbaru Anda</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-red-500">Gagal memuat transaksi</p>
        </CardContent>
      </Card>
    );
  }

  if (!paginatedData || paginatedData.data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Riwayat Transaksi</CardTitle>
          <CardDescription>Transaksi terbaru Anda</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">Belum ada transaksi</p>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/dashboard")}
          >
            Tambah Transaksi Pertama
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { data: transactions, total, page: currentPage, totalPages } = paginatedData;

  // Render numbers for pagination
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);
    
    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={currentPage === i ? "bg-green-600 hover:bg-green-700" : ""}
          onClick={() => setPage(i)}
        >
          {i}
        </Button>
      );
    }
    
    return buttons;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Riwayat Transaksi</CardTitle>
        <CardDescription>
          Menampilkan {transactions.length} dari {total} transaksi
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Sebelumnya
            </Button>
            
            <div className="hidden sm:flex items-center space-x-2">
              {renderPaginationButtons()}
            </div>
            
            <span className="sm:hidden text-sm text-muted-foreground">
              Hal {currentPage} / {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Selanjutnya
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
