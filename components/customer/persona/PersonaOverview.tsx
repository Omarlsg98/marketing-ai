import React from 'react'
import PersonaCard from './PersonaCard'

const personas = [
  {
    name: "Frugal Francesca",
    type: "Young Professional",
    coverage: 40,
    avatarSrc: "/placeholder.svg?height=96&width=96",
  },
  { 
    name: "Busy Becca", 
    type: "Busy Parent", 
    coverage: 35,
    avatarSrc: "/placeholder.svg?height=96&width=96",
  },
  {
    name: "Trendsetter Tara",
    type: "Tech-Savvy Enthusiast",
    coverage: 25,
    avatarSrc: "/placeholder.svg?height=96&width=96",
  },
]

export default function PersonaOverview() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Persona Overview
      </h2>
      <p className="text-sm text-muted-foreground">
        Key insights and visualisations for your user personas
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {personas.map((persona, index) => (
          <PersonaCard
            key={index}
            name={persona.name}
            type={persona.type}
            coverage={persona.coverage}
            avatarSrc={persona.avatarSrc}
          />
        ))}
      </div>
    </div>
  )
}