'use client'

import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import LogoutModal from './LogoutModal'

export default function LogoutButton() {
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <>
      <Button 
        variant="ghost" 
        className="w-full text-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={() => setShowLogoutModal(true)}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
      <LogoutModal isOpen={showLogoutModal} setIsOpen={setShowLogoutModal} />
    </>
  )
}