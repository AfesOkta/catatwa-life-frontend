'use client';

import SummaryCards from '@/components/dashboard/summary-cards';
import TransactionInput from '@/components/dashboard/transaction-input';
import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const { data: dashboardData, isLoading } = useDashboard();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Ringkasan keuangan hari ini</p>
        </div>

        <SummaryCards data={dashboardData} isLoading={isLoading} />

        <div className="grid gap-8 lg:grid-cols-2">
          <TransactionInput />
        </div>
      </div>
    </main>
  );
}