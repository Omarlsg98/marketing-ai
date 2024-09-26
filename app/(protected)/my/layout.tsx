"use client"

import { ReactNode, useState } from "react"
import SideNav from "@/components/general/SideNav"
import { cn } from "@/lib/utils"

interface LayoutPrivateProps {
  children: ReactNode
}

export default function LayoutPrivate({ children }: LayoutPrivateProps) {
  const [menuState, setMenuState] = useState<'closed' | 'level1' | 'level2'>('closed')

  const handleMenuStateChange = (newState: 'closed' | 'level1' | 'level2') => {
    setMenuState(newState)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={cn(
          "bg-background border-r transition-all duration-300 ease-in-out",
          menuState === 'closed' && "w-16",
          menuState === 'level1' && "w-64",
          menuState === 'level2' && "w-[320px]"
        )}
      >
        <SideNav onStateChange={handleMenuStateChange} />
      </aside>

      <main 
        className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          menuState === 'closed' && "ml-16",
          menuState === 'level1' && "ml-64",
          menuState === 'level2' && "ml-[320px]"
        )}
      >
        {children}
      </main>
    </div>
  )
}