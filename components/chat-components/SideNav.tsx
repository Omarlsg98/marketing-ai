'use client'

import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, ClipboardList, Eye, Laptop, Moon, PlusCircle, Sun, User, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface SideNavProps {
  isCollapsed: boolean
  isMobile?: boolean
  onClose?: () => void
}

export default function SideNav({ isCollapsed, isMobile = false }: SideNavProps) {
  const [isInsightsExpanded, setIsInsightsExpanded] = useState(true)
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system')

  const toggleTheme = () => {
    setThemeMode(current => {
      if (current === 'light') return 'dark'
      if (current === 'dark') return 'system'
      return 'light'
    })
  }

  const menuItems = [
    { 
      icon: <Users className="w-5 h-5" />, 
      text: 'Customer Insights', 
      submenu: [
        { icon: <PlusCircle className="w-4 h-4" />, text: 'Create Persona', link: '/my/personas/create' },
        { icon: <ClipboardList className="w-4 h-4" />, text: 'Insights', link: '/my/personas' },
        { icon: <Eye className="w-4 h-4" />, text: 'View All', link: '/my/personas' },
      ]
    }
  ]

  return (
    <div className="flex flex-col h-full">
      <Link href="/my/personas" className="flex items-center justify-center h-[72px] border-b border-border">
        {isCollapsed || isMobile ? (
          <Image src="/logo-icon.svg" alt="Logo" width={40} height={40} />
        ) : (
          <Image src="/logo-full.svg" alt="Logo" width={160} height={40} />
        )}
      </Link>
      <nav className="flex-1 mt-6">
        {menuItems.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setIsInsightsExpanded(!isInsightsExpanded)}
              className={`w-full text-left py-3 px-4 flex items-center transition-colors duration-200 bg-secondary text-secondary-foreground ${
                isCollapsed && !isMobile ? 'justify-center' : 'justify-between'
              }`}
            >
              <div className="flex items-center">
                {item.icon}
                {(!isCollapsed || isMobile) && <span className="ml-3 text-base">{item.text}</span>}
              </div>
              {(!isCollapsed || isMobile) && (
                isInsightsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
              )}
            </button>
            {(!isCollapsed || isMobile) && isInsightsExpanded && (
              <div className="mt-1">
                {item.submenu.map((subItem, subIndex) => (
                  <button 
                    key={subIndex} 
                    className="w-full text-left py-2 pl-11 pr-4 flex items-center text-muted-foreground hover:text-secondary-foreground relative group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute left-3 top-0 bottom-0 w-[calc(100%-12px)] bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Link href={subItem.link} >
                        <span className="relative flex items-center text-sm">
                        {subItem.icon}
                        <span className="ml-3">{subItem.text}</span>
                        </span>
                    </Link>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="border-t border-border mt-auto py-4">
        <div className={`px-4 py-2 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
          {(!isCollapsed || isMobile) && <span>Theme</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-md"
          >
            {themeMode === 'light' && <Sun className="h-4 w-4" />}
            {themeMode === 'dark' && <Moon className="h-4 w-4" />}
            {themeMode === 'system' && <Laptop className="h-4 w-4" />}
          </Button>
        </div>
        <button className={`w-full text-left py-2 px-4 flex items-center text-muted-foreground hover:text-secondary-foreground hover:bg-secondary mt-2 ${
          isCollapsed && !isMobile ? 'justify-center' : ''
        }`}>
          <User className="w-5 h-5" />
          {(!isCollapsed || isMobile) && <span className="ml-3">Account</span>}
        </button>
      </div>
    </div>
  )
}