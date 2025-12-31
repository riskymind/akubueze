/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { auth, signIn, signOut } from "@/auth"
import { isRedirectError } from "next/dist/client/components/redirect-error"
import { loginSchema, resetPasswordSchema, updateUserSchema, forgotPasswordSchema, updateProfileSchema } from "../validations"
import { prisma } from "../prisma";
import { formatError } from "../utils";
import { revalidatePath } from "next/cache";
import z from "zod";
import { Prisma } from "../generated/prisma/client";
import { PAGE_SIZE } from "../constants";
import crypto from 'crypto';
import bcrypt from "bcryptjs";

export type ForgotPasswordState = {
  success?: boolean;
  error?: string;
};

// Sign in user with credentials
export async function signInWithCredentials(prevState: unknown, formData: FormData) {
    try {
        const user = loginSchema.parse({
            email: formData.get("email"),
            password: formData.get("password")
        });
        await signIn("credentials", user);
        return {success: true, message: "Signed in successfully"}
    } catch (error) {
        if(isRedirectError(error)) {
            throw error;
        }
        return {success: false, message: "Invalid email or password"}       
    }
}

// Sign user out
export async function signOutUser() {
    await signOut();
}

// Get user by the ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });
  if (!user) throw new Error('User not found');
  return user;
}

// Get all the users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}

// Delete a user
export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update a user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update the user profile
export async function updateProfile(user: z.infer<typeof updateProfileSchema>) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
        image: user.image
      },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function requestPasswordResetAction(email: string) {
  try {
    if (!email) {
      return { error: 'Email is required' };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if user exists or not for security
    if (!user) {
      // Still return success to prevent email enumeration
      return { 
        success: true, 
        message: 'If an account exists with this email, you will receive a password reset link.' 
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Token expires in 1 hour
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    // Save token to database
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: hashedToken,
        resetTokenExpiry,
      },
    });

    // In production, send email with reset link
    // For now, we'll log it (you should integrate email service)
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('Password Reset Link:', resetUrl);
    console.log('Reset Token:', resetToken);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, user.name, resetUrl);

    return { 
      success: true, 
      message: 'Password reset link has been sent to your email',
      // In development, include the token for testing
      ...(process.env.NODE_ENV === 'development' && { resetToken, resetUrl })
    };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { error: 'Failed to process password reset request' };
  }
}

export async function resetPasswordWithTokenAction(token: string, newPassword: string) {
  try {
    if (!token || !newPassword) {
      return { error: 'Missing required fields' };
    }

    if (newPassword.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    // Hash the token to compare with database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: hashedToken,
        resetTokenExpiry: {
          gt: new Date(), // Token not expired
        },
      },
    });

    if (!user) {
      return { error: 'Invalid or expired reset token' };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Password Changed',
        message: 'Your password has been successfully changed. If you did not make this change, please contact an administrator immediately.',
        type: 'SECURITY',
      },
    });

    return { 
      success: true, 
      message: 'Password reset successfully. You can now login with your new password.' 
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error: 'Failed to reset password' };
  }
}

export async function resetPasswordAction(formData: FormData) {
  try {
    const rawData = {
      email: formData.get('email') as string,
      newPassword: formData.get('newPassword') as string,
      token: formData.get('token') as string,
    };

    const validatedData = resetPasswordSchema.parse(rawData);

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    if (validatedData.token && user.resetToken !== validatedData.token) {
      return { error: 'Invalid reset token' };
    }

    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      return { error: 'Reset token has expired' };
    }

    const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

    await prisma.user.update({
      where: { email: validatedData.email },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { success: true, message: 'Password reset successfully' };
  } catch (error: any) {
    if (error.errors) {
      return { error: error.errors[0].message };
    }
    console.error('Password reset error:', error);
    return { error: 'Failed to reset password' };
  }
}

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
) {
  const email = formData.get('email');

  const parsed = forgotPasswordSchema.safeParse({ email });

  if (!parsed.success) {
    return {
      error: parsed.error.message || 'Invalid email',
    };
  }

  const result = await requestPasswordResetAction(parsed.data.email);

  if (!result) {
    return {
      error: result || 'Failed to send reset link',
    };
  }

  return { success: true };
}