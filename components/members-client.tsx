/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Users, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';


export default function MembersClient({ members }: { members: any[] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center gap-4">
          <Users className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search members by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Members list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            All Members ({filteredMembers.length})
          </h2>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No members found
            </h3>
            <p className="text-gray-600">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'No members have been added yet.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-6 hover:bg-gray-50 transition bg-gray-100 my-4">
                <div className="flex flex-col justify-center items-center  md:flex-row md:items-start md:justify-between">
                 
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Image 
                        src={member.image || "/images/logo.jpeg"}
                        height={48}
                        width={48}
                        className='rounded-full'
                        alt={member.name}/>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {member.name}
                      </h3>

                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={14} />
                          {member.email}
                        </div>

                        {member.phone && (
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            {member.phone}
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          Joined {formatDate(member.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        member.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : member.role === 'FINANCIAL_SECRETARY'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {member.role.replace('_', ' ')}
                    </span>

                    <div className="mt-4 text-sm text-gray-600">
                      <p>
                        {member._count.payments} payment
                        {member._count.payments !== 1 ? 's' : ''}
                      </p>
                      <p>
                        {member._count.hostedMeetings} meeting
                        {member._count.hostedMeetings !== 1 ? 's' : ''} hosted
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
