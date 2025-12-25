import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/auth';
import { getNextMeetingDate } from '@/lib/utils';
// import CreateMeetingForm from './create-meeting-form';
import { getMembersAction } from '@/lib/actions/member.action';
import CreateMeetingForm from './create-meeting-form';

export default async function CreateMeetingPage() {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  const isAdmin =
    session.user.role === 'ADMIN' ||
    session.user.role === 'FINANCIAL_SECRETARY';

  if (!isAdmin) {
    redirect('/meetings');
  }

  const membersResult = await getMembersAction();

  const members = membersResult.success ? membersResult.members! : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/meetings"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Create New Meeting
          </h1>
          <p className="text-gray-600 mt-1">
            Schedule a new age grade meeting
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p className="text-blue-800 text-sm">
          💡 Suggested date is the last Sunday of the month.
          Dues are created automatically (₦1,000 members / ₦5,000 host).
        </p>
      </div>

       <CreateMeetingForm
        members={members}
        defaultDate={getNextMeetingDate()
          .toISOString()
          .split('T')[0]}
      /> 
    </div>
  );
}
