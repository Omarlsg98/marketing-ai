'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      setIsFormValid(false)
    } else {
      setEmailError('')
      setIsFormValid(!!email)
    }
  }, [email])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      console.log('Form submitted with email:', email)
      setIsSubmitted(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 relative mb-4 mx-auto">
            <Image
              src="/logo.png"
              alt="Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to reset your password
          </p>
        </div>
        <div className="border-t border-border"></div>
        {!isSubmitted ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="mt-2 text-sm text-destructive">{emailError}</p>}
            </div>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={`w-full ${isFormValid ? 'bg-blue-950 hover:bg-blue-900' : ''}`}
                disabled={!isFormValid}
              >
                Submit
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-green-600 font-medium">
              If an account exists for {email}, you will receive a password reset link shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}