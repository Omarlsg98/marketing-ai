"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog"

export default function LogoutModal({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error logging out:', error)
      } else {
        router.push('/auth/login')
      }
    } catch (error) {
      console.error('Unexpected error during logout:', error)
    } finally {
      setIsLoggingOut(false)
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[360px] bg-[#1F2937] text-white rounded-lg shadow-xl border-0 p-0">
        <div className="relative p-6">
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <h2 className="text-xl font-semibold mb-4 text-center">Confirm Logout</h2>
          <div className="bg-[#374151] rounded-md p-4 mb-4">
            <div className="flex justify-center mb-3">
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="Logout icon"
                width={48}
                height={48}
                className="text-blue-400"
              />
            </div>
            <p className="text-sm text-center">
              Are you sure you want to logout?<br />
              You will be redirected to the login page.
            </p>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoggingOut}
              className="w-[120px] px-4 py-2 text-sm font-medium bg-transparent border border-gray-600 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-[120px] px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
          <div className="text-center text-gray-400 text-sm mt-4">
            <p>Thank you for using our application.</p>
            <p>We hope to see you again soon.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}