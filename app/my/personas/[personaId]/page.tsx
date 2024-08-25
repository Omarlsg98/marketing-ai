'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Upload } from 'lucide-react'
import React, { useRef, useState } from 'react'

import CustomerJourneyDiscovery from '@/components/customer-journey/CustomerJourneyDiscovery'
import CustomerJourneyEvaluation from '@/components/customer-journey/CustomerJourneyEvaluation'
import CustomerJourneyPostPurchase from '@/components/customer-journey/CustomerJourneyPostPurchase'
import CustomerJourneyProfile from '@/components/customer-journey/CustomerJourneyProfile'
import CustomerJourneyPurchase from '@/components/customer-journey/CustomerJourneyPurchase'

type TabName = 'profile' | 'pre-purchase' | 'purchase' | 'post-purchase'

export default function Component() {
  const [personaImage, setPersonaImage] = useState("/placeholder.svg?height=400&width=400")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabName>('profile')
  const [imageGenOptions, setImageGenOptions] = useState({
    ethnicity: '',
    style: 'realistic'
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateNewImage = async () => {
    setIsGeneratingImage(true)
    console.log("Generating image with options:", imageGenOptions)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setPersonaImage(`/placeholder.svg?height=400&width=400&text=New+AI+Generated+Image&time=${Date.now()}`)
    setIsGeneratingImage(false)
    setIsImagePopupOpen(false)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setPersonaImage(imageUrl)
    }
  }

  const tabContent: Record<TabName, React.ReactNode> = {
    profile: <CustomerJourneyProfile />,
    'pre-purchase': (
      <>
        <CustomerJourneyDiscovery />
        <CustomerJourneyEvaluation />
      </>
    ),
    purchase: <CustomerJourneyPurchase />,
    'post-purchase': <CustomerJourneyPostPurchase />,
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-lg">
      <div className="p-6">
        <div className="mb-6 flex flex-col lg:flex-row gap-6">
          {/* Left column: Persona's image and info */}
          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="mb-4 overflow-hidden rounded-lg shadow">
              <img
                src={personaImage}
                alt="Persona portrait"
                className="h-96 w-full object-cover"
              />
            </div>
            <div className="flex gap-4 mb-6">
              <Button 
                className="flex-1"
                onClick={() => setIsImagePopupOpen(true)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New Image
              </Button>
              <Button 
                variant="secondary"
                className="flex-1"
                onClick={handleUploadClick}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="mb-2 text-2xl font-bold">John Doe</h2>
              <p className="mb-4 text-sm text-muted-foreground">Tech Enthusiast</p>
              <div className="space-y-2">
                <p><strong>Gender:</strong> Male</p>
                <p><strong>Ethnicity:</strong> Caucasian</p>
                <p><strong>Location:</strong> San Francisco, USA</p>
                <p><strong>Occupation:</strong> Software Engineer</p>
              </div>
            </div>
          </div>

          {/* Right column: About Me */}
          <div className="w-full lg:flex-1 lg:min-w-[400px]">
            <div className="h-full p-6 bg-white rounded-lg shadow">
              <h2 className="mb-4 text-2xl font-bold">About Me</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>As a software engineer in the heart of Silicon Valley, I'm always on the lookout for the latest tech gadgets and innovations. I'm passionate about creating efficient, user-friendly software solutions and enjoy staying up-to-date with emerging technologies.</p>
                <p>In my free time, I contribute to open-source projects and attend local tech meetups. I'm particularly interested in AI and machine learning applications in everyday life.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap bg-muted p-1 rounded-lg">
            {(['profile', 'pre-purchase', 'purchase', 'post-purchase'] as TabName[]).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "default" : "ghost"}
                className="flex-grow sm:flex-grow-0"
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Button>
            ))}
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>

      {/* Image Generation Popup */}
      {isImagePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Generate New Persona Image</h2>
            <p className="mb-4 text-muted-foreground">
              Customize the options below to generate a new image for your persona.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="ethnicity" className="block text-sm font-medium mb-1">
                  Ethnicity
                </label>
                <Input
                  id="ethnicity"
                  value={imageGenOptions.ethnicity}
                  onChange={(e) => setImageGenOptions({...imageGenOptions, ethnicity: e.target.value})}
                />
              </div>
              <div>
                <label htmlFor="style" className="block text-sm font-medium mb-1">
                  Style
                </label>
                <Select
                  value={imageGenOptions.style}
                  onValueChange={(value) => setImageGenOptions({...imageGenOptions, style: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <Button 
                variant="outline"
                onClick={() => setIsImagePopupOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={generateNewImage} 
                disabled={isGeneratingImage}
              >
                {isGeneratingImage ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}