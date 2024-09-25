'use client'

import React, { useState, useEffect, FormEvent } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { FaLinkedin, FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/client/supabase'

export default function LogInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isFormValid, setIsFormValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const validatePassword = (password: string) => {
    const re = /^[A-Za-z\d!@#$%^&*()_+]{5,}$/
    return re.test(password)
  }

  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }

    if (password && !validatePassword(password)) {
      setPasswordError('Password must be at least 5 characters long')
    } else {
      setPasswordError('')
    }

    setIsFormValid(validateEmail(email) && validatePassword(password))
  }, [email, password])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      if (error) {
        console.log('Error:', error.message)
        setPasswordError(error.message)
      } else {
        router.push('/my/personas')
      }
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    router.push('/forgot-password')
  }

  const inputClassName = "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)]"

  return (
    <div className="flex min-h-screen">
      {/* Gradient background - on the left */}
      <div className="hidden lg:block lg:w-1/3 bg-gradient-to-b from-[#8DBFBD] to-[#8C8CE0]" />
      
      {/* Form content */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="space-y-1 flex flex-col items-center mb-8">
           <div className="w-16 h-16 relative mb-4">
              <Image
                src="/logo.png"
                alt="Logo"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#5EA3F4] hover:underline">
                Create an account
              </Link>
            </p>
          </div>

          {/* Divider with increased bottom margin */}
          <div className="relative my-8 mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  placeholder="Enter your email" 
                  required 
                  type="email"
                  className={inputClassName}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type={showPassword ? "text" : "password"}
                    className={inputClassName}
                  />
                  <Button
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={togglePasswordVisibility}
                    type="button"
                    variant="ghost"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                <div className="text-right">
                  <a
                    href="#"
                    onClick={handleForgotPassword}
                    className="text-sm text-[#5EA3F4] hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="pt-4">
                <Button 
                  className="w-full bg-[#30364E] hover:bg-[#30364E]/90" 
                  type="submit"
                  disabled={!isFormValid || isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </div>
            </div>
          </form>
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                or log in with
              </span>
            </div>
          </div>
          <div className="flex justify-center space-x-6">
            <Button
              onClick={() => {/* Implement LinkedIn sign-in */}}
              className="w-14 h-14 bg-[#0077B5] text-white rounded-full flex items-center justify-center hover:bg-[#006699] transition-colors"
              disabled={isLoading}
            >
              <FaLinkedin className="h-7 w-7" />
            </Button>
            <Button
              onClick={() => {/* Implement Google sign-in */}}
              className="w-14 h-14 bg-[#DB4437] text-white rounded-full flex items-center justify-center hover:bg-[#C53929] transition-colors"
              disabled={isLoading}
            >
              <FaGoogle className="h-7 w-7" />
            </Button>
            <Button
              onClick={() => {/* Implement Facebook sign-in */}}
              className="w-14 h-14 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:bg-[#166FE5] transition-colors"
              disabled={isLoading}
            >
              <FaFacebook className="h-7 w-7" />
            </Button>
            <Button
              onClick={() => {/* Implement GitHub sign-in */}}
              className="w-14 h-14 bg-[#333] text-white rounded-full flex items-center justify-center hover:bg-[#24292e] transition-colors"
              disabled={isLoading}
            >
              <FaGithub className="h-7 w-7" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}