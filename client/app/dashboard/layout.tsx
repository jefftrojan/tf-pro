// app/dashboard/layout.tsx
import { Metadata } from 'next';
import DashboardContainer from '@/components/dashboard/DashboardContainer';

export const metadata: Metadata = {
  title: 'Dashboard - Wallet App',
  description: 'Manage your finances with ease',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardContainer>{children}</DashboardContainer>;
}