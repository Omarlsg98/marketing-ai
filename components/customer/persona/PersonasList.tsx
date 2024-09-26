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

export default function PersonasList() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-foreground">All Personas</h1>
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