import MySectionLayout from '@/components/general/MySectionLayout';
import React from 'react';

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <MySectionLayout>{children}</MySectionLayout>
}