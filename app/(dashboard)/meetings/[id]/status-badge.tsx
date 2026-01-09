/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { CheckCircle, Clock, AlertCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface StatusBadgeProps {
  due: any;
  isAdmin: boolean;
  openDropdown: string | null;
  setOpenDropdown: (id: string | null) => void;
  updatingDue: string | null;
  onChange: (dueId: string, newStatus: string) => void;
}

export default function StatusBadge({
  due,
  isAdmin,
  openDropdown,
  setOpenDropdown,
  updatingDue,
  onChange,
}: StatusBadgeProps) {
  const statusConfig: Record<string, any> = {
    PAID: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      label: 'Paid',
    },
    PENDING: {
      icon: Clock,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      label: 'Pending',
    },
    OVERDUE: {
      icon: AlertCircle,
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      label: 'Overdue',
    },
  };

  const config = statusConfig[due.status];
  const Icon = config.icon;

  if (!isAdmin) {
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 ${config.bgColor} ${config.textColor} text-sm font-medium rounded-full`}
      >
        <Icon size={14} />
        {config.label}
      </span>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() =>
          setOpenDropdown(openDropdown === due.id ? null : due.id)
        }
        disabled={updatingDue === due.id}
        className={`inline-flex items-center gap-1 px-3 py-1 ${config.bgColor} ${config.textColor} text-sm font-medium rounded-full hover:opacity-80 transition disabled:opacity-50`}
      >
        <Icon size={14} />
        {updatingDue === due.id ? 'Updating...' : config.label}
        <ChevronDown size={14} />
      </button>

      {openDropdown === due.id && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenDropdown(null)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {Object.entries(statusConfig).map(([key, value]: [string, any]) => {
              const DropdownIcon = value.icon;
              return (
                <button
                  key={key}
                  onClick={() => onChange(due.id, key)}
                  disabled={key === due.status}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 dark:text-gray-600 transition ${
                    key === due.status ? 'bg-gray-50 cursor-not-allowed' : ''
                  }`}
                >
                  <DropdownIcon size={16} className={value.textColor} />
                  <span className={key === due.status ? 'font-medium' : ''}>
                    {value.label}
                  </span>
                  {key === due.status && (
                    <CheckCircle size={14} className="ml-auto text-green-600" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
