// app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glass effect card */}
        <div className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl border border-white/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-white/80">Sign in to manage your finances</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Don't have an account?{' '}
              <Link 
                href="/auth/register" 
                className="text-white hover:text-blue-200 font-semibold transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}