"use server"
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { changePasswordSchema, updateMemberSchema } from '../validations';

export async function getMembersAction() {
  try {
    const session = await auth();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    const members = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            payments: true,
            hostedMeetings: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return { success: true, members };
  } catch (error) {
    console.error('Error fetching members:', error);
    return { error: 'Failed to fetch members' };
  }
}

export async function getMemberByIdAction(memberId: string) {
  try {
    const session = await auth();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    if (!memberId) {
      return { error: 'Member ID is required' };
    }

    const member = await prisma.user.findUnique({
      where: { id: memberId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
        payments: {
          include: {
            due: {
              include: {
                meeting: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        hostedMeetings: {
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!member) {
      return { error: 'Member not found' };
    }

    return { success: true, member };
  } catch (error) {
    console.error('Error fetching member:', error);
    return { error: 'Failed to fetch member' };
  }
}

export async function updateMemberAction(memberId: string, formData: FormData) {
  try {
    const session = await auth();

    if (!session || (session.user.role !== 'ADMIN' && session.user.id !== memberId)) {
      return { error: 'Unauthorized' };
    }

    if (!memberId) {
      return { error: 'Member ID is required' };
    }

    const rawData = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      role: formData.get('role') as string,
    };

    // Filter out empty values
    const dataToValidate = Object.fromEntries(
      Object.entries(rawData).filter(([_, v]) => v !== null && v !== '')
    );

    // Validate with Zod
    const validatedData = updateMemberSchema.parse(dataToValidate);

    // Only allow admin to change roles
    if (validatedData.role && session.user.role !== 'ADMIN') {
      delete validatedData.role;
    }

    const member = await prisma.user.update({
      where: { id: memberId },
      data: validatedData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    revalidatePath('/members');
    return { success: true, member };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    console.error('Error updating member:', error);
    return { error: 'Failed to update member' };
  }
}

export async function deleteMemberAction(memberId: string) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    if (!memberId) {
      return { error: 'Member ID is required' };
    }

    if (memberId === session.user.id) {
      return { error: 'You cannot delete your own account' };
    }

    await prisma.user.delete({
      where: { id: memberId },
    });

    revalidatePath('/members');
    return { success: true, message: 'Member deleted successfully' };
  } catch (error) {
    console.error('Error deleting member:', error);
    return { error: 'Failed to delete member' };
  }
}

export async function changePasswordAction(formData: FormData) {
  try {
    const session = await auth();

    if (!session) {
      return { error: 'Unauthorized' };
    }

    const rawData = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Validate with Zod
    const validatedData = changePasswordSchema.parse(rawData);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return { error: 'Current password is incorrect' };
    }

    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password changed successfully' };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    console.error('Error changing password:', error);
    return { error: 'Failed to change password' };
  }
}