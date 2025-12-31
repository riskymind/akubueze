import { getMembersAction } from '@/lib/actions/member.action';
import MembersClient from '@/components/members-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Members',
};

export default async function MembersPage() {
  const result = await getMembersAction();

  const members = result.success ? result.members! : [];

  return (
    <div className="space-y-6">
      <div className='flex items-center gap-2'>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">Members:</h1>
        <p className="text-gray-600 mt-1 dark:text-gray-200">
          View all Akubueze Age Grade members
        </p>
      </div>

      {/* Client component handles search + filtering */}
      <MembersClient members={members} />
    </div>
  );
}
