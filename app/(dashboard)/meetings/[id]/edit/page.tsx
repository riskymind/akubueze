import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { auth } from '@/auth';
import { getMeetingByIdAction } from '@/lib/actions/meeting.action';
import { getMembersAction } from '@/lib/actions/member.action';
import EditMeetingClient from './edit-meeting-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Update Meeting',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditMeetingPage(props: PageProps) {
  const session = await auth();
  if (!session) redirect('/sign-in');

  const isAdmin =
    session.user.role === 'ADMIN' ||
    session.user.role === 'FINANCIAL_SECRETARY';

  if (!isAdmin) redirect('/meetings');
  const { id } = await props.params;

  const [meetingResult, membersResult] = await Promise.all([
    getMeetingByIdAction(id),
    getMembersAction(),
  ]);

  if (!meetingResult.success || !meetingResult.meeting) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Meeting not found</h2>
        <Link href="/meetings" className="text-green-600">
          ← Back to meetings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/meetings/${id}`}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Meeting</h1>
          <p className="text-gray-600 dark:text-gray-300">Update meeting details</p>
        </div>
      </div>

      <EditMeetingClient
        meeting={meetingResult.meeting}
        members={membersResult.members ?? []}
      />
    </div>
  );
}
