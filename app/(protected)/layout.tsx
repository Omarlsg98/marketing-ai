import React from 'react';
import { ReactNode } from "react"

interface LayoutPrivateProps {
  children: ReactNode
}

function LayoutPrivate({ children }: LayoutPrivateProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <LayoutPrivate>{children}</LayoutPrivate>
}