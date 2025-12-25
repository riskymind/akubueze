import Link from 'next/link';
import { auth } from '@/auth';
import { Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { getMeetingsAction } from '@/lib/actions/meeting.action';
import { getDuesAction } from '@/lib/actions/dues.action';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600">You must be signed in to view this page</p>
        <Link href="/sign-in" className="text-green-600 underline">
          Sign in
        </Link>
      </div>
    );
  }

  const [meetingsResult, duesResult] = await Promise.all([
    getMeetingsAction(),
    getDuesAction({ memberId: session.user.id }),
  ]);

  if (!meetingsResult.success || !duesResult.success) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load dashboard data
      </div>
    );
  }

  const meetings = meetingsResult.meetings!;
  const dues = duesResult.dues!;

  const now = new Date();

  const upcomingMeetings = meetings.filter(
    (m) => new Date(m.date) > now
  );

  const paidDues = dues.filter((d) => d.status === 'PAID');
  const unpaidDues = dues.filter((d) => d.status === 'PENDING');
  const overdueDues = dues.filter((d) => d.status === 'OVERDUE');

  const totalAmount = dues.reduce((sum, d) => sum + d.amount, 0);
  const paidAmount = paidDues.reduce((sum, d) => sum + d.amount, 0);

  const stats = {
    totalMeetings: meetings.length,
    upcomingMeetings: upcomingMeetings.length,
    totalDues: dues.length,
    paidDues: paidDues.length,
    unpaidDues: unpaidDues.length,
    overdueDues: overdueDues.length,
    totalAmount,
    paidAmount,
  };

  const recentMeetings = meetings.slice(0, 5);

  const statCards = [
    {
      title: 'Total Meetings',
      value: stats.totalMeetings,
      subtitle: `${stats.upcomingMeetings} upcoming`,
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Paid Dues',
      value: stats.paidDues,
      subtitle: `of ${stats.totalDues} total`,
      icon: CheckCircle,
      color: 'bg-green-500',
    },
    {
      title: 'Unpaid Dues',
      value: stats.unpaidDues,
      subtitle: `${stats.overdueDues} overdue`,
      icon: AlertCircle,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Contribution',
      value: formatCurrency(stats.paidAmount),
      subtitle: `of ${formatCurrency(stats.totalAmount)}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s your Akubueze Age Grade overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {card.subtitle}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.overdueDues > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-red-500" size={24} />
            <div>
              <h3 className="font-semibold text-red-900">Payment Overdue</h3>
              <p className="text-red-700 mt-1">
                You have {stats.overdueDues} overdue payment
                {stats.overdueDues > 1 ? 's' : ''}.
              </p>
              <Link
                href="/dues"
                className="inline-block mt-3 text-sm font-medium text-red-700 underline"
              >
                View overdue payments →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Meetings</h2>
          <Link href="/meetings" className="text-sm text-green-600">
            View all →
          </Link>
        </div>

        <div className="divide-y divide-gray-100">
          {recentMeetings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No meetings yet
            </div>
          ) : (
            recentMeetings.map((meeting) => (
              <Link
                key={meeting.id}
                href={`/meetings/${meeting.id}`}
                className="block p-6 hover:bg-gray-50"
              >
                <h3 className="font-semibold text-gray-900">
                  {meeting.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(meeting.date)} • Host: {meeting.host.name}
                </p>
                {meeting.venue && (
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {meeting.venue}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
