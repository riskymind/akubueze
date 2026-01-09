'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, FileText, User } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


import { createMeetingAction } from '@/lib/actions/meeting.action';
import { createMeetingSchema } from '@/lib/validations';
import z from 'zod';


export default function CreateMeetingForm({
  members,
  defaultDate,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  members: any[];
  defaultDate: string;
}) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const schema =  createMeetingSchema
    type createInput = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: defaultDate,
    },
  });

  const onSubmit = async (data: createInput) => {
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('date', data.date);
    formData.append('hostId', data.hostId);

    if (data.venue) formData.append('venue', data.venue);
    if (data.description) formData.append('description', data.description);

    const result = await createMeetingAction(formData);

    if (result.success) {
      router.push('/meetings');
    } else {
      setError(result.error || 'Failed to create meeting');
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-600 rounded-xl shadow-sm border p-8 space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Meeting Title *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('title')}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
            />
          </div>
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">
              {errors.title.message}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Meeting Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              {...register('date')}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
            />
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Venue
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('venue')}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
            />
          </div>
        </div>

        {/* Host */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Meeting Host *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              {...register('hostId')}
              className="w-full pl-10 pr-4 py-3 border rounded-lg"
            >
              <option value="">Select host</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <textarea
          {...register('description')}
          rows={4}
          className="w-full border rounded-lg p-3"
          placeholder="Optional description..."
        />

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg"
          >
            {loading ? 'Creating...' : 'Create Meeting'}
          </button>

          <Link
            href="/meetings"
            className="flex-1 bg-gray-100 text-center py-3 rounded-lg dark:bg-gray-400"
          >
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
