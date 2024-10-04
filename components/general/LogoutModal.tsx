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
  const [imageError, setImageError] = useState(false)
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
      <DialogContent className="w-[600px] max-w-[90vw] p-0">
        <div className="bg-base-100 text-base-content rounded-lg shadow-xl">
          <div className="relative p-8">
            <DialogClose className="absolute right-4 top-4 btn btn-sm btn-circle btn-ghost">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
            <h2 className="text-3xl font-semibold mb-4 text-center">Confirm Logout</h2>
            <hr className="border-t border-base-300 mb-6" />
            <div className="bg-base-200 rounded-md p-6 mb-6">
              <div className="flex justify-center mb-6">
                <div className="bg-base-300 p-3 rounded-md">
                  {!imageError ? (
                    <Image
                      src="/assets/empty-state/logout.png"
                      alt="Logout icon"
                      width={800}
                      height={482}
                      className="w-full h-auto"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full aspect-[800/482] bg-base-300 flex items-center justify-center text-base-content">
                      Logout Icon
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xl text-center mt-6">
                Are you sure you want to logout?<br />
                You will be redirected to the login page.
              </p>
            </div>
            <div className="flex justify-center space-x-6">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isLoggingOut}
                className="btn btn-outline w-[140px] text-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="btn btn-primary w-[140px] text-lg"
              >
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </Button>
            </div>
            <div className="text-center text-gray-500 text-base mt-6">
              <p>* Thank you for using our application.</p>
              <p>We hope to see you again soon.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}