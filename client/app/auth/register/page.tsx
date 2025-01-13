'use client';

import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-lg bg-white/30 p-8 rounded-2xl shadow-xl border border-white/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-white/80">Start managing your finances today</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Already have an account?{' '}
              <Link 
                href="/auth/login" 
                className="text-white hover:text-blue-200 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}