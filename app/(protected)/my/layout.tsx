import React from 'react';
import LayoutPrivate from "@/components/LayoutPrivate"

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <LayoutPrivate>{children}</LayoutPrivate>
}