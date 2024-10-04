"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChevronRight,
  ClipboardList,
  Laptop,
  MessageSquare,
  Moon,
  Settings,
  Sun,
  User,
  Users,
  LogOut
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LogoutButton from '@/components/general/LogoutButton';

const navItems = [
  { icon: MessageSquare, label: "Chats", href: "javascript:void(0);" },
  { icon: Users, label: "Personas", href: "javascript:void(0);" },
  { icon: ClipboardList, label: "Survey Builder", href: "javascript:void(0);" },
];

const settingsItems = [
  {
    id: "account",
    label: "Account",
    icon: User,
    subItems: ["email", "profile", "password"],
  },
];

interface SideNavProps {
  onStateChange: (newState: "closed" | "level1" | "level2") => void;
  isMobile?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
}

export default function SideNav({
  onStateChange,
  isMobile = false,
  onClose,
  isCollapsed = false,
}: SideNavProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [activeSettingsItem, setActiveSettingsItem] = useState<string | null>(null);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const { setTheme, theme, systemTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setCurrentTheme(theme === "system" ? systemTheme : theme);
  }, [theme, systemTheme]);

  const toggleSubMenu = useCallback(
    (label: string) => {
      setActiveItem((prevActiveItem) => {
        const newActiveItem = prevActiveItem === label ? null : label;
        onStateChange(newActiveItem ? "level1" : "closed");
        return newActiveItem;
      });
      setActiveSettingsItem(null);
      setActiveSubItem(null);
    },
    [onStateChange]
  );

  const toggleSettingsSubMenu = useCallback(
    (id: string) => {
      setActiveSettingsItem((prevActiveSettingsItem) => {
        const newActiveSettingsItem = prevActiveSettingsItem === id ? null : id;
        onStateChange(newActiveSettingsItem ? "level2" : "level1");
        return newActiveSettingsItem;
      });
      setActiveSubItem(null);
    },
    [onStateChange]
  );

  const toggleSettingsSubItem = useCallback((subItem: string) => {
    setActiveSubItem((prevActiveSubItem) => {
      const newActiveSubItem = prevActiveSubItem === subItem ? null : subItem;
      return newActiveSubItem;
    });
  }, []);

  const handleThemeChange = useCallback(
    (value: string) => {
      if (value) {
        setTheme(value);
      }
    },
    [setTheme]
  );

  const handleLinkClick = useCallback(() => {
    setActiveItem(null);
    setActiveSettingsItem(null);
    setActiveSubItem(null);
    onStateChange("closed");
    if (isMobile && onClose) {
      onClose();
    }
  }, [onStateChange, isMobile, onClose]);

  return (
    <div className="flex h-full">
      <nav className="w-16 bg-background border-r border-border flex flex-col items-center">
        <div className="h-16 flex items-center justify-center">
          <Link href="/my/personas">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
          </Link>
        </div>
        <div className="w-full h-px bg-border" />
        <TooltipProvider>
          <div className="flex-grow flex flex-col space-y-4 pt-4 overflow-y-auto">
            {navItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={`w-12 h-12 flex items-center justify-center rounded-md ${activeItem === item.label ? "bg-accent" : "hover:bg-accent/50"}`}
                    onClick={() => toggleSubMenu(item.label)}
                    aria-label={item.label}
                  >
                    <item.icon className="w-5 h-5" />
                  </Link>
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
                  onClick={() => toggleSubMenu("Settings")}
                  className={activeItem === "Settings" ? "bg-accent" : ""}
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
            {activeItem === "Settings" ? (
              <div className="flex flex-col h-full">
                <div className="p-4 space-y-1 flex-grow overflow-y-auto">
                  {settingsItems.map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-between ${activeSettingsItem === item.id ? "bg-accent" : ""}`}
                      onClick={() => toggleSettingsSubMenu(item.id)}
                    >
                      <div className="flex items-center">
                        <item.icon className="w-5 h-5 mr-2" />
                        <span>{item.label}</span>
                      </div>
                      {item.subItems.length > 0 && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  ))}
                </div>
                <div className="mt-auto">
                  <div className="w-full h-px bg-border" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme</span>
                      <ToggleGroup
                        type="single"
                        value={currentTheme}
                        onValueChange={handleThemeChange}
                      >
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
                {activeItem === "Chats" && (
                  <>
                    <li>
                      <Link
                        href="/my/chats/create"
                        className="block w-full text-left px-3 py-2 rounded-md hover:bg-accent"
                        onClick={handleLinkClick}
                      >
                        Chat with Ethan
                      </Link>
                    </li>
                  </>
                )}
                {activeItem === "Personas" && (
                  <>
                    <li>
                      <Link
                        href="/my/personas"
                        className="block w-full text-left px-3 py-2 rounded-md hover:bg-accent"
                        onClick={handleLinkClick}
                      >
                        Personas Insights
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/my/personas/list"
                        className="block w-full text-left px-3 py-2 rounded-md hover:bg-accent"
                        onClick={handleLinkClick}
                      >
                        Persona List
                      </Link>
                    </li>
                  </>
                )}
                {(activeItem === "Account" || activeItem === "Survey Builder") && (
                  <li>
                    <Link
                      href={`/my/${activeItem.toLowerCase().replace(" ", "-")}`}
                      className="block w-full text-left px-3 py-2 rounded-md hover:bg-accent"
                      onClick={handleLinkClick}
                    >
                      Overview
                    </Link>
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
              {settingsItems.find((item) => item.id === activeSettingsItem)?.label}
            </h2>
          </div>
          <div className="w-full h-px bg-border" />
          <div className="flex flex-col h-full">
            <div className="p-4 flex-grow overflow-y-auto">
              <ul className="space-y-2">
                {settingsItems
                  .find((item) => item.id === activeSettingsItem)
                  ?.subItems.map((subItem) => (
                    <li key={subItem}>
                      <Link
                        href={`/my/settings/${activeSettingsItem}/${subItem}`}
                        className={`block w-full text-left px-3 py-2 rounded-md hover:bg-accent ${activeSubItem === subItem ? "bg-accent" : ""}`}
                        onClick={() => {
                          toggleSettingsSubItem(subItem);
                          handleLinkClick();
                        }}
                      >
                        {subItem.charAt(0).toUpperCase() + subItem.slice(1).replace("-", " ")}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="mt-auto p-4">
              <div className="w-full h-px bg-border mb-4" />
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}