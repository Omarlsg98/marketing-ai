"use client"

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { User, MessageSquare, Users, ClipboardList, Settings, ChevronRight, Bell, Shield, Palette, Sun, Moon, Laptop } from 'lucide-react'
import { useTheme } from "next-themes"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"

const navItems = [
  { icon: User, label: 'Account', href: '/my/account' },
  { icon: MessageSquare, label: 'Chats', href: '/my/chats' },
  { icon: Users, label: 'Personas', href: '/my/personas' },
  { icon: ClipboardList, label: 'Survey Builder', href: '/my/survey-builder' },
]

const settingsItems = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
]

interface SideNavProps {
  onStateChange: (newState: 'closed' | 'level1' | 'level2') => void
  isMobile?: boolean
  onClose?: () => void
  isCollapsed?: boolean
}

export default function SideNav({ onStateChange, isMobile = false, onClose, isCollapsed = false }: SideNavProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [activeSettingsItem, setActiveSettingsItem] = useState<string | null>(null)
  const { setTheme, theme, systemTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined)
  const pathname = usePathname()
  const router = useRouter()

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

  const handleLinkClick = useCallback((href: string) => {
    router.push(href)
    setActiveItem(null)
    setActiveSettingsItem(null)
    onStateChange('closed')
    if (isMobile && onClose) {
      onClose()
    }
  }, [router, onStateChange, isMobile, onClose])

  return (
    <div className="flex h-full">
      <nav className="w-16 bg-background border-r border-border flex flex-col items-center">
        <div className="h-16 flex items-center justify-center">
          <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="w-10 h-10" />
        </div>
        <div className="w-full h-px bg-border" />
        <TooltipProvider>
          <div className="flex-grow flex flex-col space-y-4 pt-4 overflow-y-auto">
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
        <div className="w-64 bg-background border-r border-border flex flex-col overflow-hidden">
          <div className="h-16 flex items-center px-4">
            <h2 className="text-xl font-semibold">{activeItem}</h2>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="flex-grow overflow-y-auto">
            {activeItem === 'Settings' ? (
              <div className="flex flex-col h-full">
                <div className="p-4 space-y-1 flex-grow overflow-y-auto">
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
                {activeItem === 'Chats' && (
                  <>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleLinkClick('/my/chats')}
                      >
                        All Chats
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleLinkClick('/my/chats/create')}
                      >
                        Create New Chat
                      </Button>
                    </li>
                  </>
                )}
                {activeItem === 'Personas' && (
                  <>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleLinkClick('/my/personas')}
                      >
                        All Personas
                      </Button>
                    </li>
                    <li>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => handleLinkClick('/my/personas/list')}
                      >
                        Persona List
                      </Button>
                    </li>
                  </>
                )}
                {(activeItem === 'Account' || activeItem === 'Survey Builder') && (
                  <li>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleLinkClick(`/my/${activeItem.toLowerCase().replace(' ', '-')}`)}
                    >
                      Overview
                    </Button>
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
      {activeSettingsItem && (
        <div className="w-64 bg-background border-r border-border flex flex-col overflow-hidden">
          <div className="h-16 flex items-center px-4">
            <h2 className="text-xl font-semibold">
              {settingsItems.find(item => item.id === activeSettingsItem)?.label}
            </h2>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="p-4 flex-grow overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleLinkClick('#')}
                >
                  Setting Option 1
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleLinkClick('#')}
                >
                  Setting Option 2
                </Button>
              </li>
              <li>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleLinkClick('#')}
                >
                  Setting Option 3
                </Button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}