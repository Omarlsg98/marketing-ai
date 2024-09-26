'use client'

import React, { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload, X } from "lucide-react"
import Image from "next/image"

export default function AccountPage() {
  const [profilePicture, setProfilePicture] = useState("/logo-white-circle.svg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted")
  }

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml']
      if (validTypes.includes(file.type)) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result
          if (typeof result === 'string') {
            setProfilePicture(result)
          }
        }
        reader.readAsDataURL(file)
      } else {
        alert('Please select a valid image file (PNG, JPEG, or SVG)')
      }
    }
  }

  const handleRemoveProfilePicture = () => {
    setProfilePicture("/logo-white-circle.svg")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-8 sm:p-10">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Profile Settings</h1>
          
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Changes to your profile will apply to all your workspaces.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <Image
                src={profilePicture}
                alt="Profile picture"
                width={128}
                height={128}
                className="rounded-full"
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile Picture</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Click the upload button to change your profile picture
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  size="icon"
                  className="rounded-full bg-blue-950 hover:bg-blue-900"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-full"
                  onClick={handleRemoveProfilePicture}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePictureUpload}
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  type="text" 
                  required 
                  className="mt-1 focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)]" 
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  type="text" 
                  required 
                  className="mt-1 focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)]" 
                />
              </div>
            </div>

            <div className="pt-5">
              <div className="flex justify-end">
                <Button type="button" variant="outline" className="mr-3">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-950 hover:bg-blue-900">Save Changes</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}