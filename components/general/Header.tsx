"use client"

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import SideNav from '@/components/general/SideNav'

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

interface NavItem {
  label: string
  items: string[]
}

const navItems: NavItem[] = [
  { label: 'Home', items: ['Dashboard', 'Analytics', 'Reports'] },
  { label: 'Section', items: ['Projects', 'Tasks', 'Teams'] },
  { label: 'Current Page', items: ['Overview', 'Details', 'Settings'] },
]

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [setIsMobileMenuOpen])

  return (
    <header className="bg-background border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SideNav 
              isMobile={true} 
              onClose={handleCloseMobileMenu} 
              isCollapsed={false}
            />
          </SheetContent>
        </Sheet>
        
        <nav className="hidden md:flex space-x-2">
          {navItems.map((item) => (
            <DropdownMenu key={item.label}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`text-sm ${activeDropdown === item.label ? 'bg-accent' : ''}`}
                  onClick={() => setActiveDropdown(item.label)}
                  aria-label={`${item.label} menu`}
                >
                  {item.label} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {item.items.map((subItem) => (
                  <DropdownMenuItem key={subItem}>
                    <Link href="#" className="w-full">
                      {subItem}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}