'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'

import { createClient } from '@/lib/client/supabase'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
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
      // Handle form submission
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: 'http://localhost:3000/dashboard'
        }
      });

      if (error) {
        console.error('Error signing up:', error.message)
        throw error;
      }

      console.log('Form submitted')
      router.push('/my/personas');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-md shadow-sm">
        <div className="text-center">
          <Image src="/logo-icon.svg" alt="Logo" width={64} height={64} className="mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-2 text-sm text-gray-600">
            {"Already have an account? "}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
        <div className="border-t border-gray-200"></div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition duration-150 ease-in-out sm:text-sm"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && <p className="mt-2 text-sm text-red-600">{nameError}</p>}
          </div>
          <div>
            <Label htmlFor="email-address" className="block text-sm font-medium text-gray-700">
              Email address
            </Label>
            <Input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition duration-150 ease-in-out sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition duration-150 ease-in-out sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
            {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
          </div>
          <div>
            <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 transition duration-150 ease-in-out sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
            {confirmPasswordError && <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>}
          </div>
          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              disabled={!isFormValid}
            >
              Sign up
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <Button variant="outline" className="w-12 h-12 rounded-full p-0 flex items-center justify-center hover:bg-gray-50 transition duration-150 ease-in-out">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </Button>
            <Button variant="outline" className="w-12 h-12 rounded-full p-0 flex items-center justify-center hover:bg-gray-50 transition duration-150 ease-in-out">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.486 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.34-3.369-1.34-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </Button>
            <Button variant="outline" className="w-12 h-12 rounded-full p-0 flex items-center justify-center hover:bg-gray-50 transition duration-150 ease-in-out">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Button>
            <Button variant="outline" className="w-12 h-12 rounded-full p-0 flex items-center justify-center hover:bg-gray-50 transition duration-150 ease-in-out">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}