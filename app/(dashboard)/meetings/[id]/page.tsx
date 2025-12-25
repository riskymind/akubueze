import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { getMeetingByIdAction } from '@/lib/actions/meeting.action';
import MeetingDetailClient from './meeting-detail-client';


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MeetingDetailPage(props: PageProps) {
  const session = await auth();
  if (!session) redirect('/sign-in');

  const isAdmin =
    session.user.role === 'ADMIN' ||
    session.user.role === 'FINANCIAL_SECRETARY';

    const { id } = await props.params;

  const result = await getMeetingByIdAction(id);

  if (!result.success || !result.meeting) {
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
    <MeetingDetailClient
      meeting={result.meeting}
      isAdmin={isAdmin}
    />
  );
}
