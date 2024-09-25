'use client'

import React, { FormEvent, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { FaLinkedin, FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/client/supabase'

export default function CreateAccountPage() {
  const router = useRouter();
  const supabase = createClient();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)

  const validateName = (name: string) => {
    return name.length >= 2
  }

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(String(email).toLowerCase())
  }

  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/
    return re.test(password)
  }

  useEffect(() => {
    if (name && !validateName(name)) {
      setNameError('Name must be at least 2 characters long')
    } else {
      setNameError('')
    }

    if (email && !validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
    }

    if (password && !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters long and include an uppercase letter, a number, and a symbol')
    } else {
      setPasswordError('')
    }

    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
    } else {
      setConfirmPasswordError('')
    }

    setIsFormValid(validateName(name) && validateEmail(email) && validatePassword(password) && password === confirmPassword)
  }, [name, email, password, confirmPassword])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { name: name },
          emailRedirectTo: 'http://localhost:3000/dashboard'
        }
      });

      if (error) {
        console.error('Error signing up:', error.message)
        throw error;
      }

      console.log('Form submitted')
      router.push('/my/personas');
    } else {
      console.error('Form is not valid')
    }
  }

  const inputClassName = "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#8DBFBD] focus:border-[#8DBFBD] hover:shadow-[0_0_6.9px_rgba(141,191,189,0.7)]"

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block lg:w-1/3 bg-gradient-to-b from-[#8DBFBD] to-[#8C8CE0]" />
      
      <div className="w-full lg:w-2/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="space-y-1 flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#5EA3F4] hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          <div className="relative my-8 mb-12">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="Enter your full name" 
                  required 
                  type="text"
                  className={inputClassName}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {nameError && <p className="text-sm text-red-600">{nameError}</p>}
              </div>
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
                {emailError && <p className="text-sm text-red-600">{emailError}</p>}
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
                    onClick={() => setShowPassword(!showPassword)}
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
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                <p className="text-[11px] text-gray-400 mt-1">
                  Use 8 or more characters with a mix of Uppercase Letter, Numbers and Symbols
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    className={inputClassName}
                  />
                  <Button
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    type="button"
                    variant="ghost"
                  >
                    {showConfirmPassword ? (
                      <EyeOffIcon className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {confirmPasswordError && <p className="text-sm text-red-600">{confirmPasswordError}</p>}
              </div>
              <div className="pt-4">
                <Button className="w-full bg-[#30364E] hover:bg-[#30364E]/90" type="submit" disabled={!isFormValid}>
                  Create Account
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
                or continue with
              </span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => {/* Handle LinkedIn sign-up */}}
              className="w-10 h-10 bg-[#0077B5] text-white rounded-full flex items-center justify-center hover:bg-[#006699] transition-colors"
            >
              <FaLinkedin className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => {/* Handle Google sign-up */}}
              className="w-10 h-10 bg-[#DB4437] text-white rounded-full flex items-center justify-center hover:bg-[#C53929] transition-colors"
            >
              <FaGoogle className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => {/* Handle GitHub sign-up */}}
              className="w-10 h-10 bg-[#333] text-white rounded-full flex items-center justify-center hover:bg-[#24292e] transition-colors"
            >
              <FaGithub className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => {/* Handle Facebook sign-up */}}
              className="w-10 h-10 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:bg-[#166FE5] transition-colors"
            >
              <FaFacebook className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}