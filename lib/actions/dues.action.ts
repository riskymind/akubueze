/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { updateDueStatusSchema } from '../validations';
import { Role } from '../generated/prisma/enums';

export async function getDuesAction(filters?: {
  memberId?: string;
  meetingId?: string;
  status?: string;
}) {
  try {
    const session = await auth();

    if (!session) {
      return { error: 'Unauthorized' };
    }


    const where: any = {};

    if (filters?.memberId) {
      where.memberId = filters.memberId;
    } else if (session.user.role === Role.MEMBER) {
      where.memberId = session.user.id;
    }

    if (filters?.meetingId) {
      where.meetingId = filters.meetingId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const dues = await prisma.due.findMany({
      where,
      include: {
        meeting: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
          },
        },
        payments: {
          select: {
            id: true,
            amount: true,
            paymentDate: true,
            paymentMethod: true,
            reference: true,
          },
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    return { success: true, dues };
  } catch (error) {
    console.error('Error fetching dues:', error);
    return { error: 'Failed to fetch dues' };
  }
}

export async function updateDueStatusAction(dueId: string, status: string) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.FINANCIAL_SECRETARY)) {
      return { error: 'Unauthorized' };
    }

    // Validate with Zod
    const validatedData = updateDueStatusSchema.parse({ dueId, status });

    const due = await prisma.due.findUnique({
      where: { id: validatedData.dueId },
    });

    if (!due) {
      return { error: 'Due not found' };
    }

    const updatedDue = await prisma.due.update({
      where: { id: validatedData.dueId },
      data: { status: validatedData.status },
    });

    revalidatePath('/dues');
    revalidatePath('/dashboard');
    return { success: true, due: updatedDue };

  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    console.error('Error updating due:', error);
    return { error: 'Failed to update due' };
  }
}

export async function processOverdueDuesAction() {
  try {
    const session = await auth();

    if (!session || (session.user.role !== Role.ADMIN && session.user.role !== Role.FINANCIAL_SECRETARY)) {
      return { error: 'Unauthorized' };
    }

    const today = new Date();

    const overdueDues = await prisma.due.findMany({
      where: {
        status: 'PENDING',
        dueDate: {
          lt: today,
        },
      },
      include: {
        meeting: true,
      },
    });

    if (overdueDues.length === 0) {
      return {
        success: true,
        message: 'No overdue dues to process',
        count: 0,
      };
    }

    await prisma.due.updateMany({
      where: {
        id: {
          in: overdueDues.map(d => d.id),
        },
      },
      data: {
        status: 'OVERDUE',
      },
    });

    const notifications = overdueDues.map(due => ({
      userId: due.memberId,
      title: 'Overdue Payment',
      message: `Your payment for ${due.meeting.title} is overdue. Please make payment of ₦${due.amount.toLocaleString()} as soon as possible.`,
      type: 'OVERDUE',
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    revalidatePath('/dues');
    revalidatePath('/dashboard');
    
    return {
      success: true,
      message: `${overdueDues.length} overdue dues processed and notifications sent`,
      count: overdueDues.length,
    };
  } catch (error) {
    console.error('Error processing overdue dues:', error);
    return { error: 'Failed to process overdue dues' };
  }
}