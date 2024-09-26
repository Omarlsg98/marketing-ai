"use client"

import { ReactNode, useState } from "react"
import { cn } from "@/lib/utils"
import SideNav from "@/components/general/SideNav"
import Header from "@/components/general/Header"

interface LayoutPrivateProps {
  children: ReactNode
}

export default function LayoutPrivate({ children }: LayoutPrivateProps) {
  const [menuState, setMenuState] = useState<'closed' | 'level1' | 'level2'>('closed')

  const handleMenuStateChange = (newState: 'closed' | 'level1' | 'level2') => {
    setMenuState(newState)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <div className="fixed inset-y-0 left-0 z-50">
        <SideNav onStateChange={handleMenuStateChange} isCollapsed={menuState === 'closed'} />
      </div>
      <div className="flex flex-col flex-1">
        <div className={cn(
          "fixed top-0 right-0 z-40 transition-all duration-300 ease-in-out",
          menuState === 'closed' && "left-16",
          menuState === 'level1' && "left-80",
          menuState === 'level2' && "left-[384px]"
        )}>
          <Header />
        </div>
        <main 
          className={cn(
            "flex-1 overflow-auto pt-16 transition-all duration-300 ease-in-out",
            menuState === 'closed' && "ml-16",
            menuState === 'level1' && "ml-80",
            menuState === 'level2' && "ml-[384px]"
          )}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}