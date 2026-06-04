'use client';

import { CheckCircle2, LucideProps, X } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { Transaction } from '@/types/api';

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const date = transaction.createdAt instanceof Date 
    ? transaction.createdAt 
    : new Date(transaction.createdAt);
  
  const formattedDate = format(date, "dd MMM yyyy HH:mm", { locale: id });
  const formattedAmount = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(transaction.amount);
  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(transaction.total);

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start space-x-3">
        {transaction.type === 'income' ? (
          <>
            <span className="sr-only">Pemasukan: </span>
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 shrink-0" aria-hidden="true" />
          </>
        ) : (
          <>
            <span className="sr-only">Pengeluaran: </span>
            <X className="h-4 w-4 text-red-600 mt-1 shrink-0" aria-hidden="true" />
          </>
        )}
        <div className="flex-1 space-y-1">
          <p className="font-medium">{transaction.itemName}</p>
          <p className="text-sm text-muted-foreground">
            {transaction.qty} x {formattedAmount}
          </p>
          <p className="text-xs text-muted-foreground">
            {formattedDate}
          </p>
        </div>
      </div>
      <div className="mt-2 text-right">
        <span className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {transaction.type === 'income' ? '+ ' : '- '}{formattedTotal}
        </span>
      </div>
    </div>
  );
}