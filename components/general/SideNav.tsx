'use client'

import { Button } from "@/components/ui/button"
import { BarChart2, ChevronDown, ChevronRight, ClipboardList, Eye, HelpCircle, Key, Laptop, LogIn, MessageSquare, Moon, PieChart, PlusCircle, Settings, Sun, User, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface SideNavProps {
  isCollapsed: boolean
  isMobile?: boolean
  onClose?: () => void
}

interface MenuItem {
  id: string
  icon: React.ReactNode
  text: string
  href?: string
  submenu?: {
    icon: React.ReactNode
    text: string
    href: string
  }[]
}

export default function Component({ isCollapsed, isMobile = false }: SideNavProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(['customerInsights'])
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const pathname = usePathname()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    }
  }, [])

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    )
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }

  const menuItems: MenuItem[] = [
    {
      id: 'customerInsights',
      icon: <Users className="w-5 h-5" />,
      text: 'Customer Insights',
      submenu: [
        { icon: <PlusCircle className="w-4 h-4" />, text: 'Create Persona', href: '/my/personas/create' },
        { icon: <ClipboardList className="w-4 h-4" />, text: 'Insights', href: '/my/personas' },
        { icon: <Eye className="w-4 h-4" />, text: 'View All', href: '/my/personas/list' },
      ]
    },
    {
      id: 'auth',
      icon: <Key className="w-5 h-5" />,
      text: 'Authentication',
      submenu: [
        { icon: <LogIn className="w-4 h-4" />, text: 'Login', href: '/auth/login' },
        { icon: <UserPlus className="w-4 h-4" />, text: 'Sign Up', href: '/auth/signup' },
        { icon: <Key className="w-4 h-4" />, text: 'Forgot Password', href: '/auth/reset-password' },
      ]
    },
    {
      id: 'competitorAnalysis',
      icon: <BarChart2 className="w-5 h-5" />,
      text: 'Competitor Analysis',
      submenu: [
        { icon: <PieChart className="w-4 h-4" />, text: 'Dashboard', href: '/my/competitors/dashboard' },
        { icon: <Eye className="w-4 h-4" />, text: 'All Competitors', href: '/my/competitors' },
        { icon: <PlusCircle className="w-4 h-4" />, text: 'Add Competitor', href: '/my/competitors/create' },
      ]
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      text: 'Settings',
      href: '/settings'
    },
    {
      id: 'help',
      icon: <HelpCircle className="w-5 h-5" />,
      text: 'Help & Support',
      submenu: [
        { icon: <MessageSquare className="w-4 h-4" />, text: 'FAQ', href: '/help/faq' },
        { icon: <MessageSquare className="w-4 h-4" />, text: 'Contact Us', href: '/help/contact' },
      ]
    }
  ]

  const renderMenuItem = (item: MenuItem) => (
    <div key={item.id} className="mb-1">
      {item.submenu ? (
        <div>
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`w-full text-left py-2 px-4 flex items-center justify-between transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground ${
              expandedItems.includes(item.id) ? 'bg-secondary text-secondary-foreground' : ''
            }`}
            aria-expanded={expandedItems.includes(item.id)}
            aria-controls={`submenu-${item.id}`}
          >
            <div className="flex items-center">
              {item.icon}
              {(!isCollapsed || isMobile) && <span className="ml-3 text-base">{item.text}</span>}
            </div>
            {(!isCollapsed || isMobile) && (
              expandedItems.includes(item.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {(!isCollapsed || isMobile) && expandedItems.includes(item.id) && (
            <div className="mt-1 ml-4" id={`submenu-${item.id}`} role="menu">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className={`w-full text-left py-2 px-4 flex items-center text-muted-foreground hover:text-secondary-foreground hover:bg-secondary/50 relative group ${
                    pathname === subItem.href ? 'bg-secondary text-secondary-foreground' : ''
                  }`}
                  role="menuitem"
                >
                  {subItem.icon}
                  <span className="ml-3 text-sm">{subItem.text}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Link
          href={item.href!}
          className={`w-full text-left py-2 px-4 flex items-center transition-colors duration-200 hover:bg-secondary hover:text-secondary-foreground ${
            pathname === item.href ? 'bg-secondary text-secondary-foreground' : ''
          }`}
        >
          {item.icon}
          {(!isCollapsed || isMobile) && <span className="ml-3 text-base">{item.text}</span>}
        </Link>
      )}
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <Link href="/my/personas" className="flex items-center justify-center h-[72px] border-b border-border">
        {isCollapsed || isMobile ? (
          <Image src="/logo-icon.svg" alt="Logo" width={40} height={40} />
        ) : (
          <Image src="/logo-full.svg" alt="Logo" width={160} height={40} />
        )}
      </Link>
      <nav className="flex-1 mt-4 px-2 overflow-y-auto" role="navigation">
        {menuItems.map(renderMenuItem)}
      </nav>
      <div className="border-t border-border mt-auto py-4 px-2">
        <div className={`px-4 py-2 flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
          {(!isCollapsed || isMobile) && <span>Theme</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-md"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
          >
            {theme === 'light' && <Sun className="h-4 w-4" />}
            {theme === 'dark' && <Moon className="h-4 w-4" />}
            {theme === 'system' && <Laptop className="h-4 w-4" />}
          </Button>
        </div>
        <Link
          href="/account"
          className={`w-full text-left py-2 px-4 flex items-center text-muted-foreground hover:text-secondary-foreground hover:bg-secondary mt-2 rounded-md ${
            isCollapsed && !isMobile ? 'justify-center' : ''
          } ${pathname === '/account' ? 'bg-secondary text-secondary-foreground' : ''}`}
          aria-label="Account"
        >
          <User className="w-5 h-5" />
          {(!isCollapsed || isMobile) && <span className="ml-3">Account</span>}
        </Link>
      </div>
    </div>
  )
}