/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { CheckCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

export default function PaymentStatusClient({
  dues,
  host,
  hostId,
}: any) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filtered = dues.filter((d: any) =>
    filter === 'all' ? true : d.status.toLowerCase() === filter
  );

  return (
    <div className="bg-white rounded-xl border">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold mb-4">Payment Status</h2>
        <div className="flex gap-2">
          {['all', 'paid', 'pending', 'overdue'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center">
          <DollarSign className="mx-auto text-gray-400 mb-4" size={40} />
          <p>No matching members</p>
        </div>
      ) : (
        <div className="divide-y">
          {filtered.map((due: any) => {
            const name =
                due.memberId === hostId
                    ? host.name
                    : due.member?.name ?? 'Unknown member';

            return (
              <div key={due.id} className="p-6 flex justify-between">
                <div>
                  <p className="font-semibold">{name}</p>
                  {due.payments[0] && (
                    <p className="text-sm text-gray-600">
                      Paid on {formatDate(due.payments[0].paymentDate)}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {formatCurrency(due.amount)}
                  </p>
                  {due.status === 'PAID' && <Badge color="green" icon={<CheckCircle size={14} />} text="Paid" />}
                  {due.status === 'PENDING' && <Badge color="yellow" icon={<Clock size={14} />} text="Pending" />}
                  {due.status === 'OVERDUE' && <Badge color="red" icon={<AlertCircle size={14} />} text="Overdue" />}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Badge({ color, icon, text }: any) {
  const map: any = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${map[color]}`}>
      {icon}
      {text}
    </span>
  );
}
