'use client';

import { Suspense, lazy } from 'react';
import { useDashboard } from '@/hooks/use-dashboard';

const SummaryCards = lazy(() => import('@/components/dashboard/summary-cards'));
const TransactionInput = lazy(() => import('@/components/dashboard/transaction-input'));

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useDashboard();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Ringkasan keuangan hari ini</p>
        </div>

        <Suspense fallback={<div className="h-24 w-full bg-gray-100 animate-pulse rounded-xl" />}>
          <SummaryCards data={dashboardData} isLoading={isLoading} />
        </Suspense>

        <div className="grid gap-8 lg:grid-cols-2">
          <Suspense fallback={<div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-xl" />}>
            <TransactionInput />
          </Suspense>
        </div>
      </div>
    </main>
  );
}