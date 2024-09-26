"use client"

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, HelpCircle, Settings, User, CreditCard, Bell, Shield, Zap, Sun, Moon, Laptop } from 'lucide-react'
import { useTheme } from "next-themes"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: Users, label: 'Users', href: '/users' },
  { icon: HelpCircle, label: 'Help', href: '/help' },
]

const settingsItems = [
  { id: "account", label: "Account", icon: User },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "team", label: "Team", icon: Users },
  { id: "integrations", label: "Integrations", icon: Zap },
]

interface SideNavProps {
  onStateChange: (newState: 'closed' | 'level1' | 'level2') => void
}

export default function SideNav({ onStateChange }: SideNavProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [activeSettingsItem, setActiveSettingsItem] = useState<string | null>(null)
  const { setTheme, theme, systemTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)
  const pathname = usePathname()

  useEffect(() => {
    setCurrentTheme(theme === 'system' ? systemTheme : theme)
  }, [theme, systemTheme])

  const toggleSubMenu = useCallback((label: string) => {
    setActiveItem(prevActiveItem => {
      const newActiveItem = prevActiveItem === label ? null : label
      onStateChange(newActiveItem ? 'level1' : 'closed')
      return newActiveItem
    })
    setActiveSettingsItem(null)
  }, [onStateChange])

  const toggleSettingsSubMenu = useCallback((id: string) => {
    setActiveSettingsItem(prevActiveSettingsItem => {
      const newActiveSettingsItem = prevActiveSettingsItem === id ? null : id
      onStateChange(newActiveSettingsItem ? 'level2' : 'level1')
      return newActiveSettingsItem
    })
  }, [onStateChange])

  const handleThemeChange = useCallback((value: string) => {
    if (value) {
      setTheme(value)
    }
  }, [setTheme])

  return (
    <div className="flex h-full">
      <nav className="w-16 bg-background border-r border-border flex flex-col items-center flex-shrink-0">
        <div className="h-16 flex items-center justify-center">
          <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="w-10 h-10" />
        </div>
        <div className="w-full h-px bg-border" />
        <TooltipProvider>
          <div className="flex-grow flex flex-col space-y-4 pt-4">
            {navItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleSubMenu(item.label)}
                    className={activeItem === item.label ? 'bg-accent' : ''}
                    aria-label={item.label}
                  >
                    <item.icon className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
          <div className="mt-auto pb-4">
            <div className="w-full h-px bg-border mb-4" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleSubMenu('Settings')}
                  className={activeItem === 'Settings' ? 'bg-accent' : ''}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </nav>
      {activeItem && (
        <div className="w-64 bg-background border-r border-border flex flex-col flex-shrink-0">
          <div className="h-16 flex items-center px-4">
            <h2 className="text-xl font-semibold">{activeItem}</h2>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="flex-grow overflow-y-auto">
            {activeItem === 'Settings' ? (
              <div className="flex flex-col h-full">
                <div className="p-4 space-y-1 flex-grow">
                  {settingsItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-start ${activeSettingsItem === item.id ? 'bg-accent' : ''}`}
                      onClick={() => toggleSettingsSubMenu(item.id)}
                    >
                      <item.icon className="w-5 h-5 mr-2" />
                      <span>{item.label}</span>
                    </Button>
                  ))}
                </div>
                <div className="mt-auto">
                  <div className="w-full h-px bg-border" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme</span>
                      <ToggleGroup type="single" value={currentTheme} onValueChange={handleThemeChange}>
                        <ToggleGroupItem value="light" aria-label="Light mode">
                          <Sun className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark" aria-label="Dark mode">
                          <Moon className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="system" aria-label="System theme">
                          <Laptop className="h-4 w-4" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <ul className="p-4 space-y-2">
                <li>
                  <Link href="#" className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors">Submenu Item 1</Link>
                </li>
                <li>
                  <Link href="#" className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors">Submenu Item 2</Link>
                </li>
                <li>
                  <Link href="#" className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors">Submenu Item 3</Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      )}
      {activeSettingsItem && (
        <div className="w-64 bg-background border-r border-border flex flex-col flex-shrink-0">
          <div className="h-16 flex items-center px-4">
            <h2 className="text-xl font-semibold">
              {settingsItems.find(item => item.id === activeSettingsItem)?.label}
            </h2>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="p-4 flex-grow overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <Link href="#" className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors">Submenu Item 1</Link>
              </li>
              <li>
                <Link href="#" className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors">Submenu Item 2</Link>
              </li>
              <li>
                <Link href="#" className="block py-2 px-3 rounded-lg hover:bg-accent transition-colors">Submenu Item 3</Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}