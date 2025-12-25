import Link from 'next/link';
import { auth } from '@/auth';
import { Calendar, MapPin, User, Plus } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import { getMeetingsAction } from '@/lib/actions/meeting.action';
import DeleteMeetingButton from '@/components/delete-meeting-button';

type Filter = 'all' | 'upcoming' | 'past';

interface PageProps {
  searchParams: Promise<{
    filter?: Filter;
  }>;
}

export default async function MeetingsPage({ searchParams }: PageProps) {
  const session = await auth();

  if (!session) {
    return (
      <div className="text-center py-20">
        <p>You must be signed in</p>
        <Link href="/sign-in" className="text-green-600 underline">
          Sign in
        </Link>
      </div>
    );
  }

  const isAdmin =
    session.user.role === 'ADMIN' ||
    session.user.role === 'FINANCIAL_SECRETARY';

   const { filter = 'all' } = await searchParams;

  const result = await getMeetingsAction();

  if (!result.success) {
    return (
      <div className="text-center py-20 text-red-600">
        Failed to load meetings
      </div>
    );
  }

  const now = new Date();

  const meetings = result.meetings!.filter((meeting) => {
    const meetingDate = new Date(meeting.date);
    if (filter === 'upcoming') return meetingDate > now;
    if (filter === 'past') return meetingDate <= now;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="text-gray-600 mt-1">
            View and manage age grade meetings
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/meetings/create"
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Plus size={20} />
            Create Meeting
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 border-b border-gray-200">
        {(['all', 'upcoming', 'past'] as Filter[]).map((tab) => (
          <Link
            key={tab}
            href={`/meetings?filter=${tab}`}
            className={`px-4 py-2 font-medium border-b-2 ${
              filter === tab
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Link>
        ))}
      </div>

      {/* Meetings */}
      {meetings.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No meetings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {meetings.map((meeting) => {
            const totalDues = meeting.dues.length;
            const paidDues = meeting.dues.filter(d => d.status === 'PAID');
            const totalAmount = meeting.dues.reduce((s, d) => s + d.amount, 0);
            const paidAmount = paidDues.reduce((s, d) => s + d.amount, 0);

            return (
              <div
                key={meeting.id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md"
              >
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{meeting.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <Calendar size={16} />
                        {formatDate(meeting.date)}
                      </div>
                    </div>

                    {isAdmin && (
                      <div className="flex gap-2">
                        <Link
                          href={`/meetings/${meeting.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          Edit
                        </Link>
                        <DeleteMeetingButton meetingId={meeting.id} />
                      </div>
                    )}
                  </div>

                  {meeting.venue && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin size={16} />
                      {meeting.venue}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <User size={16} />
                    Host: {meeting.host.name}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span>{paidDues.length}/{totalDues} members</span>
                      <span>
                        {formatCurrency(paidAmount)} / {formatCurrency(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/meetings/${meeting.id}`}
                  className="block bg-gray-50 text-center py-3 text-sm hover:bg-gray-100"
                >
                  View Details →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
