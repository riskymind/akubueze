"use server"

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { makePaymentSchema, verifyPaymentSchema } from '../validations';


export async function makePaymentAction(
  dueId: string,
  amount: number,
  paymentMethod?: string,
  reference?: string
) {
  try {
    const session = await auth();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    // Validate with Zod
    const validatedData = makePaymentSchema.parse({
      dueId,
      amount,
      paymentMethod,
      reference,
    });

    const due = await prisma.due.findUnique({
      where: { id: validatedData.dueId },
    });

    if (!due) {
      return { error: 'Due not found' };
    }

    // Verify user is paying for their own due or has admin access
    const hasAdminAccess = session.user.role === 'ADMIN' || session.user.role === 'FINANCIAL_SECRETARY';
    if (due.memberId !== session.user.id && !hasAdminAccess) {
      return { error: 'Unauthorized to make this payment' };
    }

    // Verify amount matches due amount
    if (validatedData.amount !== due.amount) {
      return { error: `Payment amount must be exactly ${due.amount}` };
    }

    const payment = await prisma.payment.create({
      data: {
        dueId: validatedData.dueId,
        memberId: due.memberId,
        amount: validatedData.amount,
        paymentMethod: validatedData.paymentMethod,
        reference: validatedData.reference,
        verifiedBy: hasAdminAccess ? session.user.id : null,
      },
    });

    await prisma.due.update({
      where: { id: validatedData.dueId },
      data: { status: 'PAID' },
    });

    revalidatePath('/dues');
    revalidatePath('/dashboard');
    revalidatePath('/meetings');
    
    return { success: true, payment };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    console.error('Error creating payment:', error);
    return { error: 'Failed to create payment' };
  }
}

export async function getPaymentsAction(memberId?: string) {
  try {
    const session = await auth();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    const hasAdminAccess = session.user.role === 'ADMIN' || session.user.role === 'FINANCIAL_SECRETARY';
    
    const where = memberId
      ? { memberId }
      : hasAdminAccess
      ? {}
      : { memberId: session.user.id };

    const payments = await prisma.payment.findMany({
      where,
      include: {
        due: {
          include: {
            meeting: {
              select: {
                title: true,
                date: true,
              },
            },
          },
        },
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, payments };
  } catch (error) {
    console.error('Error fetching payments:', error);
    return { error: 'Failed to fetch payments' };
  }
}

export async function verifyPaymentAction(paymentId: string) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'FINANCIAL_SECRETARY')) {
      return { error: 'Unauthorized' };
    }

    // Validate with Zod
    const validatedData = verifyPaymentSchema.parse({ paymentId });

    const payment = await prisma.payment.findUnique({
      where: { id: validatedData.paymentId },
    });

    if (!payment) {
      return { error: 'Payment not found' };
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: validatedData.paymentId },
      data: {
        verifiedBy: session.user.id,
      },
    });

    revalidatePath('/dues');
    revalidatePath('/dashboard');
    
    return { success: true, payment: updatedPayment };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    console.error('Error verifying payment:', error);
    return { error: 'Failed to verify payment' };
  }
}