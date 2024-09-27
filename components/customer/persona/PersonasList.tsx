import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PersonaList } from "@/types/components/persona"

interface PersonasGridProps {
  personas: PersonaList;
}

export default function PersonasGrid({ personas }: PersonasGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {personas.map((persona) => (
        <PersonaCard
          key={persona.id}
          name={persona.name}
          type={persona.title}
          coverage={30} // You might want to replace this with actual data
          avatarSrc={persona.image_url}
        />
      ))}
    </div>
  )
}

interface PersonaCardProps {
  name: string;
  type: string;
  coverage: number;
  avatarSrc: string | null;
}

function PersonaCard({ name, type, coverage, avatarSrc }: PersonaCardProps) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center space-x-4">
        <Avatar className="h-12 w-12">
          {avatarSrc ? (
            <AvatarImage src={avatarSrc} alt={name} />
          ) : (
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">{type}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Coverage</p>
        <div className="w-full bg-secondary rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${coverage}%` }}
          ></div>
        </div>
        <p className="text-sm text-right">{coverage}%</p>
      </div>
    </div>
  )
}