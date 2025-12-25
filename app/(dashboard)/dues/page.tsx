import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { DollarSign, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { getDuesAction } from '@/lib/actions/dues.action';
import DuesClient from '@/components/dues-client';

export default async function DuesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const result = await getDuesAction({
    memberId: session.user.id,
  });

  const dues = result.success ? result.dues! : [];

  const stats = {
    total: dues.length,
    paid: dues.filter(d => d.status === 'PAID').length,
    pending: dues.filter(d => d.status === 'PENDING').length,
    overdue: dues.filter(d => d.status === 'OVERDUE').length,
    totalAmount: dues.reduce((sum, d) => sum + d.amount, 0),
    paidAmount: dues
      .filter(d => d.status === 'PAID')
      .reduce((sum, d) => sum + d.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dues</h1>
        <p className="text-gray-600 mt-1">View and manage your meeting dues</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat title="Total Dues" value={stats.total} icon={<DollarSign />} />
        <Stat title="Paid" value={stats.paid} icon={<CheckCircle />} color="green" />
        <Stat title="Pending" value={stats.pending} icon={<Clock />} color="yellow" />
        <Stat title="Overdue" value={stats.overdue} icon={<AlertCircle />} color="red" />
      </div>

      {/* Progress */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <p className="text-sm text-green-100">Total Contributed</p>
        <p className="text-3xl font-bold">{formatCurrency(stats.paidAmount)}</p>
        <p className="text-sm text-green-100">
          of {formatCurrency(stats.totalAmount)}
        </p>
      </div>

      {/* Client component for interactivity */}
      <DuesClient dues={dues} />
    </div>
  );
}

function Stat({
  title,
  value,
  icon,
  color = 'blue',
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-2`}>
            {value}
          </p>
        </div>
        <div className={`bg-${color}-500 p-3 rounded-lg text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
