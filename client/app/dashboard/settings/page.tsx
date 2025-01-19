'use client';

import { useState, useEffect } from 'react';
import { User, Loader2, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auth } from '@/lib/api';

interface UserProfile {
  name: string;
  email: string;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();

  // Fetch current user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await auth.getMe();
      return response.data;
    },
  });

  // Form state
  const [formData, setFormData] = useState<UserProfile>({
    name: '',
    email: '',
  });

  // Update form data when user data loads
  useEffect(() => {
    if (userData?.data) {
      setFormData({
        name: userData.data.name,
        email: userData.data.email,
      });
    }
  }, [userData]);

  const updateProfile = useMutation({
    mutationFn: async (data: UserProfile) => {
      const response = await auth.updateDetails(data); // Changed from updateProfile to updateDetails
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: (error: any) => {
      console.error('Failed to update profile:', error);
      setSaveStatus('idle');
    }
  });

  // Save status for UI feedback
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      return; // Add proper validation feedback if needed
    }
    setSaveStatus('saving');
    try {
      await updateProfile.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setSaveStatus('idle');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-white/60">Manage your profile</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={updateProfile.isPending || saveStatus === 'saved'}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors disabled:opacity-50"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              Saved
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>

      {/* Profile Settings */}
      <div className="backdrop-blur-lg bg-white/5 rounded-xl border border-white/10 p-6">
        <div className="flex items-center gap-4 mb-6">
          <User className="h-6 w-6 text-white/50" />
          <h2 className="text-xl font-semibold text-white">Profile Details</h2>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm text-white/60 mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              placeholder="Your name"
              disabled={updateProfile.isPending}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-white/60 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
              placeholder="Your email"
              disabled={updateProfile.isPending}
              required
            />
          </div>
        </form>
      </div>
    </div>
  );
}