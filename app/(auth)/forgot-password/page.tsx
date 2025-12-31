"use client"
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { forgotPasswordAction } from '@/lib/actions/user.actions';
import { useActionState } from "react";
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { APP_NAME } from '@/lib/constants';


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <Loader2 size={20} className="animate-spin" />
          Sending...
        </>
      ) : (
        'Send Reset Link'
      )}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [data, formAction] = useActionState(forgotPasswordAction, {
    success: false,
  });

  if (data.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-green-600" size={32} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>

            <p className="text-gray-600 mb-6">
              We&apos;ve sent a password reset link to your email address.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
              <p className="text-sm text-blue-800">
                The reset link will expire in 1 hour.
              </p>
            </div>

            <Link
              href="/reset-password"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
            >
              <ArrowLeft size={20} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
               <Link href='/' className='flex items-center justify-center'>
            <Image
              src='/images/logo.jpeg'
              width={100}
              height={100}
              alt={`${APP_NAME} logo`}
              priority={true}
              className="rounded-r-lg rounded-l-lg"
            />
          </Link>
            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Forgot Password?
            </h1>

            <p className="text-gray-600 mt-2">
              Enter your email address and we&apos;ll send you a reset link.
            </p>
          </div>

          {data.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <p className="text-red-700 text-sm">{data.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <SubmitButton />
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          <p>For support, contact the financial secretary</p>
        </div>
      </div>
    </div>
  );
}


