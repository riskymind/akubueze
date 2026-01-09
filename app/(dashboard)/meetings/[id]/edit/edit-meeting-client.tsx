/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Calendar,
  MapPin,
  FileText,
  User,
} from 'lucide-react';
import Link from 'next/link';

import { updateMeetingAction } from '@/lib/actions/meeting.action';
import { updateMeetingSchema } from '@/lib/validations';
import z from 'zod';

export default function EditMeetingClient({
  meeting,
  members,
}: {
  meeting: any;
  members: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const schema = updateMeetingSchema
  type updateInput = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<updateInput>({
    resolver: zodResolver(updateMeetingSchema),
    defaultValues: {
      title: meeting.title,
      date: new Date(meeting.date).toISOString().split('T')[0],
      venue: meeting.venue ?? '',
      description: meeting.description ?? '',
      hostId: meeting.hostId,
    },
  });

  const onSubmit = async (data: updateInput) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    const result = await updateMeetingAction(meeting.id, formData);

    if (result.success) {
      router.push(`/meetings/${meeting.id}`);
    } else {
      setError(result.error ?? 'Failed to update meeting');
    }

    setLoading(false);
  };

  return (
    <>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p className="text-yellow-800 text-sm">
          ⚠️ Changing the host affects who pays ₦5,000 vs ₦1,000.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-600 rounded-xl border p-8 space-y-6"
      >
        {/* TITLE */}
        <Field
          label="Meeting Title"
          error={errors.title?.message}
          icon={<FileText size={20} />}
        >
          <input {...register('title')} />
        </Field>

        {/* DATE */}
        <Field
          label="Meeting Date"
          error={errors.date?.message}
          icon={<Calendar size={20} />}
        >
          <input type="date" {...register('date')} />
        </Field>

        {/* VENUE */}
        <Field label="Venue" icon={<MapPin size={20} />}>
          <input {...register('venue')} />
        </Field>

        {/* HOST */}
        <Field
          label="Host"
          error={errors.hostId?.message}
          icon={<User size={20} />}
        >
          <select {...register('hostId')}>
            <option value="">Select host</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </Field>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea {...register('description')} rows={4} />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg"
          >
            {loading ? 'Updating...' : 'Update Meeting'}
          </button>
          <Link
            href={`/meetings/${meeting.id}`}
            className="flex-1 bg-gray-100 dark:bg-gray-400 text-center py-3 rounded-lg"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}

/* ---------- reusable field ---------- */
function Field({ label, error, icon, children }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
        <div className="pl-10">{children}</div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
