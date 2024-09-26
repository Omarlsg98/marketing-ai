import React from 'react'
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { title: "Persona Breakdown", value: "3", description: "Identified User Personas" },
  { title: "Survey Responses", value: "527 / 700", description: "Collected Survey Responses" },
  { title: "Persona Coverage", value: "85%", description: "Of Target Customer Base Represented" },
]

export default function PersonaStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card">
          <CardContent className="p-4 space-y-2">
            <h2 className="text-sm font-medium text-muted-foreground">{stat.title}</h2>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            {index > 0 && (
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: index === 1 ? "75%" : "85%" }}
                ></div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}