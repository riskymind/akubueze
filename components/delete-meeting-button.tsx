'use client';

import { deleteMeetingAction } from '@/lib/actions/meeting.action';
import { Trash2 } from 'lucide-react';
import { useTransition } from 'react';

export default function DeleteMeetingButton({ meetingId }: { meetingId: string }) {
  const [isPending, startTransition] = useTransition();

  const onDelete = () => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    startTransition(async () => {
      await deleteMeetingAction(meetingId);
    });
  };

  return (
    <button
      onClick={onDelete}
      disabled={isPending}
      className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
    >
      <Trash2 size={18} />
    </button>
  );
}
