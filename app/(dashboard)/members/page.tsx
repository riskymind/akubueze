import { Users } from 'lucide-react';
import { getMembersAction } from '@/lib/actions/member.action';
import MembersClient from '@/components/members-client';

export default async function MembersPage() {
  const result = await getMembersAction();

  const members = result.success ? result.members! : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-600 mt-1">
          View all Akubueze Age Grade members
        </p>
      </div>

      {/* Client component handles search + filtering */}
      <MembersClient members={members} />
    </div>
  );
}
