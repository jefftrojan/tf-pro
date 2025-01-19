'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, User, Mail, Lock } from 'lucide-react';
import Input from '@/components/ui/Input';
import { auth } from '@/lib/api';
import Link from 'next/link';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await auth.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        label="Full Name"
        name="name"
        required
        icon={<User className="h-5 w-5" />}
        placeholder="Enter your full name"
        value={formData.name}
        onChange={handleChange}
      />

      <Input
        label="Email"
        name="email"
        type="email"
        required
        icon={<Mail className="h-5 w-5" />}
        placeholder="Enter your email"
        value={formData.email}
        onChange={handleChange}
      />

      <div className="space-y-4">
        <Input
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          icon={<Lock className="h-5 w-5" />}
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? 'text' : 'password'}
          required
          icon={<Lock className="h-5 w-5" />}
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-white/60 hover:text-white text-sm flex items-center gap-2"
        >
          {showPassword ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide passwords
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show passwords
            </>
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>

      <p className="text-sm text-white/60 text-center">
        By signing up, you agree to our{' '}
        <Link href="#/terms" className="text-white hover:text-blue-200">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#/privacy" className="text-white hover:text-blue-200">
          Privacy Policy
        </Link>
      </p>
    </form>
  );
}