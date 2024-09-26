import React from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Bell, ChevronDown, Search } from 'lucide-react'

interface NavItem {
  label: string
  items: string[]
}

const navItems: NavItem[] = [
  { label: 'Home', items: ['Dashboard', 'Analytics', 'Reports'] },
  { label: 'Section', items: ['Projects', 'Tasks', 'Teams'] },
  { label: 'Current Page', items: ['Overview', 'Details', 'Settings'] },
]

export default function Header() {
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)

  return (
    <header className="bg-background w-full h-16 flex items-center relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[1px] after:bg-border">
      <div className="flex-1 flex items-center justify-between px-4 md:px-6">
        <nav className="flex space-x-2">
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
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}