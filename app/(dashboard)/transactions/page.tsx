'use client';

import { Suspense, lazy } from 'react';

const TransactionList = lazy(() => import('@/components/transactions/transaction-list'));

export default function TransactionsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Riwayat Transaksi</h1>
          <p className="text-gray-600">Semua transaksi Anda</p>
        </div>
        <Suspense fallback={<div className="h-64 w-full bg-gray-100 animate-pulse rounded-xl" />}>
          <TransactionList />
        </Suspense>
      </div>
    </main>
  );
}