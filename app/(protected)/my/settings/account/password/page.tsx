'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Clock, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  label: string;
  error: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, value, onChange, show, setShow, label, error }) => (
  <div className="relative">
    <Label htmlFor={id}>{label}</Label>
    <div className="relative">
      <Input 
        id={id} 
        name={id} 
        type={show ? "text" : "password"}
        required 
        value={value}
        onChange={onChange}
        className="mt-1 focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)] pr-10" 
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute inset-y-0 right-0 flex items-center pr-3"
      >
        {show ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
      </button>
    </div>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
)

export default function PasswordResetPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [lastResetTime, setLastResetTime] = useState<Date | null>(null)
  const [timeAgo, setTimeAgo] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    // This effect simulates fetching the last reset time from a backend
    setLastResetTime(new Date(Date.now() - 3600000)) // Example: set to 1 hour ago
  }, [])

  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastResetTime) return

      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - lastResetTime.getTime()) / 1000)

      let message = ""
      if (diffInSeconds < 60) {
        message = "Less than a minute ago"
      } else if (diffInSeconds < 120) {
        message = "1 minute ago"
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        message = `${minutes} minutes ago`
      } else if (diffInSeconds < 7200) {
        message = "1 hour ago"
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        message = `${hours} hours ago`
      } else if (diffInSeconds < 172800) {
        message = "1 day ago"
      } else {
        const days = Math.floor(diffInSeconds / 86400)
        message = `${days} days ago`
      }

      setTimeAgo(message)
    }

    updateTimeAgo()
    const timer = setInterval(updateTimeAgo, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [lastResetTime])

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/
    return regex.test(password)
  }

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setNewPassword(password)
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long and include an uppercase letter, a number, and a symbol.")
    } else {
      setPasswordError("")
    }
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const confirmPwd = e.target.value
    setConfirmPassword(confirmPwd)
    if (confirmPwd !== newPassword) {
      setConfirmError("Passwords do not match.")
    } else {
      setConfirmError("")
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (passwordError || confirmError) {
      alert("Please fix the errors before submitting.")
      return
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.")
      return
    }
    // Here you would typically send the data to your backend
    console.log("Resetting password:", { currentPassword, newPassword, confirmPassword })
    setLastResetTime(new Date())
    setShowSuccessModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-8 sm:p-10">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Reset Password</h1>
          
          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-4 mb-6">
            <div className="flex items-center mb-2">
              <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Changing your password will log you out of all devices.
              </p>
            </div>
            {lastResetTime && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                <p>Last password reset: {timeAgo}</p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
              show={showCurrentPassword}
              setShow={setShowCurrentPassword}
              label="Current Password"
              error=""
            />
            <PasswordInput
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
              show={showNewPassword}
              setShow={setShowNewPassword}
              label="New Password"
              error={passwordError}
            />
            <p className="text-sm text-gray-500 mt-1">Use 8 or more characters with a mix of Uppercase Letter, Numbers and Symbols</p>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              show={showConfirmPassword}
              setShow={setShowConfirmPassword}
              label="Confirm New Password"
              error={confirmError}
            />

            <div className="pt-5">
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-950 hover:bg-blue-900">
                  Reset Password
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Reset Successful</DialogTitle>
            <DialogDescription>
              Your password has been successfully reset. You will be logged out of all devices.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end">
            <Button 
              onClick={() => setShowSuccessModal(false)}
              className="bg-blue-950 hover:bg-blue-900 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}