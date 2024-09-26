"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type TabName =
  | "overview"
  | "description"
  | "targeting"
  | "demographics"
  | "visualisation"

export default function CustomerInsights() {
  const [activeTab, setActiveTab] = useState<TabName>("overview")

  const PersonaOverview = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-800">
        Persona Overview
      </h4>
      <p className="text-sm text-gray-600">
        Key insights and visualisations for your user personas
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[
          {
            name: "Frugal Francesca",
            type: "Young Professional",
            coverage: 40,
          },
          { name: "Busy Becca", type: "Busy Parent", coverage: 35 },
          {
            name: "Trendsetter Tara",
            type: "Tech-Savvy Enthusiast",
            coverage: 25,
          },
        ].map((persona, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col h-full">
                <div className="flex-grow space-y-2">
                  <h5 className="text-base font-semibold text-gray-700">
                    Persona Coverage
                  </h5>
                  <div className="text-3xl font-bold text-gray-900">
                    {persona.coverage}%
                  </div>
                  <p className="text-sm text-gray-500">Of Customer Base</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
                  <h6 className="text-sm font-semibold text-gray-900 text-center">
                    {persona.name}
                  </h6>
                  <p className="text-xs text-gray-500 text-center">
                    Persona: {persona.type}
                  </p>
                </div>
                <Button variant="link" className="mt-2 w-full">
                  View details →
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const tabContent: Record<TabName, React.ReactNode> = {
    overview: <PersonaOverview />,
    description: <p>This tab contains detailed descriptions of each persona.</p>,
    targeting: <p>Information about how to target each persona effectively.</p>,
    demographics: <p>Demographic information for each persona.</p>,
    visualisation: <p>Visual representations of persona data and insights.</p>,
  }

  return (
    <div className="bg-white w-full h-full overflow-auto">
      <div className="p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">
              Customer Insights
            </h3>
            <p className="text-sm text-gray-600">Schpiel about personas</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/my/personas/list">
              <Button variant="outline" className="w-full sm:w-auto">
                View All Personas
              </Button>
            </Link>
            <Link href="/my/personas/create">
              <Button className="w-full sm:w-auto bg-[#75C5D5] text-white">
                Create Persona
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Persona Breakdown", value: "3", description: "Identified User Personas" },
            { title: "Survey Responses", value: "527 / 700", description: "Collected Survey Responses" },
            { title: "Persona Coverage", value: "85%", description: "Of Target Customer Base Represented" },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-500">{stat.title}</h4>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.description}</p>
                {index > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-[#8C8CE0] h-2 rounded-full"
                      style={{ width: index === 1 ? "75%" : "85%" }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 bg-[#F0F4FA] p-1 rounded-lg">
            {(Object.keys(tabContent) as TabName[]).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "default" : "ghost"}
                className={`rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-[#2E3650] text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
          <Card className="w-full">
            <CardContent className="p-4">
              {tabContent[activeTab]}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}