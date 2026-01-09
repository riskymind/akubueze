/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import {
  User,
  ArrowLeft,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatCurrency } from '@/lib/utils';
import { updateDueStatusAction } from '@/lib/actions/dues.action';
import StatusBadge from './status-badge';


export default function MeetingDetailClient({ meeting, isAdmin }: any) {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [updatingDue, setUpdatingDue] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filteredDues = meeting.dues.filter((due: any) => {
    if (filter === 'all') return true;
    return due.status.toLowerCase() === filter;
  });

  const stats = {
    total: meeting.dues.length,
    paid: meeting.dues.filter((d: any) => d.status === 'PAID').length,
    pending: meeting.dues.filter((d: any) => d.status === 'PENDING').length,
    overdue: meeting.dues.filter((d: any) => d.status === 'OVERDUE').length,
    totalAmount: meeting.dues.reduce((s: number, d: any) => s + d.amount, 0),
    collectedAmount: meeting.dues
      .filter((d: any) => d.status === 'PAID')
      .reduce((s: number, d: any) => s + d.amount, 0),
  };

  async function handleStatusChange(dueId: string, newStatus: string) {
    setUpdatingDue(dueId);
    setOpenDropdown(null);

     await updateDueStatusAction(dueId, newStatus);

    // if (result.success) {
      // meeting.dues = meeting.dues.map((d: any) =>
      //   d.id === dueId ? { ...d, status: newStatus } : d
      // );
    // }

    setUpdatingDue(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/meetings" className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{meeting.title}</h1>
            <p className="text-gray-600">Meeting details & payments</p>
          </div>
        </div>

        {isAdmin && (
          <Link
            href={`/meetings/${meeting.id}/edit`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            <Edit size={18} />
            Edit
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{stats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <User className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.paid}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{stats.overdue}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <AlertCircle className="text-white" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Total Collected</p>
            <p className="text-3xl font-bold mt-1">{formatCurrency(stats.collectedAmount)}</p>
            <p className="text-green-100 text-sm mt-1">of {formatCurrency(stats.totalAmount)}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold opacity-50">
              {Math.round((stats.collectedAmount / stats.totalAmount) * 100)}%
            </div>
            <p className="text-green-100 text-sm mt-1">Collected</p>
          </div>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-3">
          <div
            className="bg-white rounded-full h-3 transition-all"
            style={{ width: `${(stats.collectedAmount / stats.totalAmount) * 100}%` }}
          />
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-xl border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">Payment Status</h2>

          <div className="flex gap-2 flex-wrap">
            {['all', 'paid', 'pending', 'overdue'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y">
          {filteredDues.map((due: any) => {
            const memberName =
              due.member?.name ||
              (due.memberId === meeting.hostId ? meeting.host.name : 'Member');

            return (
              <div key={due.id} className="p-6 flex justify-between">
                <div>
                  <p className="font-semibold dark:text-gray-600">{memberName}</p>
                  {due.payments[0] && (
                    <p className="text-sm text-gray-600 dark:text-gray-600">
                      Paid on {formatDate(due.payments[0].paymentDate)}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-bold dark:text-gray-600">{formatCurrency(due.amount)}</p>
                  <StatusBadge
                    due={due}
                    isAdmin={isAdmin}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    updatingDue={updatingDue}
                    onChange={handleStatusChange}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
