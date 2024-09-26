import React from 'react'
import { Button } from "@/components/ui/button"
import PersonaStats from './PersonaStats'
import PersonaTabs from './PersonaTabs'

export default function Persona() {
  return (
    <div className="bg-background text-foreground w-full h-full overflow-auto">
      <div className="p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Customer Insights
            </h1>
            <p className="text-sm text-muted-foreground">Understand your customer personas</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              View All Personas
            </Button>
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground">
              Create Persona
            </Button>
          </div>
        </div>

        <PersonaStats />

        <PersonaTabs />
      </div>
    </div>
  )
}