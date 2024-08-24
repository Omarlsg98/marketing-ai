'use client'

import '@/app/globals.css'
import Header from '@/components/chat-components/Header'
import SideNav from '@/components/chat-components/SideNav'
import { ReactNode, useState } from 'react'

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <div className="flex h-screen w-screen overflow-hidden p-4">
          {/* Sidebar - hidden on mobile */}
          <aside 
            className={`bg-card text-card-foreground transition-all duration-300 ease-in-out hidden md:block h-full rounded-lg mr-4 ${
              isSidebarCollapsed ? 'w-16' : 'w-64'
            }`}
            onMouseEnter={() => setIsSidebarCollapsed(false)}
            onMouseLeave={() => setIsSidebarCollapsed(true)}
          >
            <SideNav isCollapsed={isSidebarCollapsed} />
          </aside>

          {/* Main content */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <Header 
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />

            {/* Content area */}
            <div className="flex-1 overflow-y-auto bg-card rounded-lg">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}