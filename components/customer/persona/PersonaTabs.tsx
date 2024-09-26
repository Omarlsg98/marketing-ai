"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import PersonaOverview from './PersonaOverview'
import PersonaDescription from './PersonaDescription'
import PersonaTargeting from './PersonaTargeting'
import PersonaDemographics from './PersonaDemographics'

type TabName =
  | "overview"
  | "description"
  | "targeting"
  | "demographics"

export default function PersonaTabs() {
  const [activeTab, setActiveTab] = useState<TabName>("overview")

  const tabContent: Record<TabName, React.ReactNode> = {
    overview: <PersonaOverview />,
    description: <PersonaDescription />,
    targeting: <PersonaTargeting />,
    demographics: <PersonaDemographics />,
  }

  return (
    <Card className="w-full bg-card">
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-2 bg-secondary/50 p-1 rounded-lg mb-4">
          {(Object.keys(tabContent) as TabName[]).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab)}
              variant={activeTab === tab ? "default" : "ghost"}
              className={`rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:bg-secondary-foreground/10"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>
        <div className="text-card-foreground">
          {tabContent[activeTab]}
        </div>
      </CardContent>
    </Card>
  )
}