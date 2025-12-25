'use client';

import { useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { makePaymentAction } from '@/lib/actions/payment.action';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DuesClient({ dues }: { dues: any[] }) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [paying, setPaying] = useState<string | null>(null);

  const filteredDues = dues.filter(due => {
    if (filter === 'all') return true;
    return due.status.toLowerCase() === filter;
  });

  const makePayment = async (dueId: string, amount: number) => {
    if (!confirm(`Confirm payment of ${formatCurrency(amount)}?`)) return;

    setPaying(dueId);
    await makePaymentAction(dueId, amount, 'Online');
    location.reload(); // simplest + safe after payment
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {['all', 'paid', 'pending', 'overdue'].map(tab => (
          <button
            key={tab}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => setFilter(tab as any)}
            className={`px-4 py-2 font-medium border-b-2 ${
              filter === tab
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600'
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Dues list */}
      <div className="space-y-4">
        {filteredDues.map(due => (
          <div key={due.id} className="bg-white p-6 rounded-xl border">
            <h3 className="font-bold">{due.meeting.title}</h3>

            <div className="text-sm text-gray-600 flex gap-3 mt-1">
              <Calendar size={16} />
              {formatDate(due.meeting.date)}
            </div>

            <p className="text-xl font-bold mt-2">
              {formatCurrency(due.amount)}
            </p>

            {due.status !== 'PAID' && (
              <button
                onClick={() => makePayment(due.id, due.amount)}
                disabled={paying === due.id}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                {paying === due.id ? 'Processing...' : 'Pay Now'}
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
