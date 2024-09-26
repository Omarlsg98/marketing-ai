import React from 'react'
import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface PersonaCardProps {
  name: string
  type: string
  coverage: number
  avatarSrc: string
}

export default function PersonaCard({ name, type, coverage, avatarSrc }: PersonaCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('')

  return (
    <Card className="w-full p-6 flex flex-col h-[300px] bg-card text-card-foreground">
      <div className="grid grid-cols-2 gap-4 items-center flex-grow">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Persona Coverage</h2>
          <div className="text-4xl font-bold">{coverage}%</div>
          <p className="text-lg text-muted-foreground">Of Customer Base</p>
        </div>
        <div className="flex flex-col items-center space-y-2 border-l border-border pl-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={avatarSrc} alt={name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-muted-foreground">Persona: {type}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Link href="#" className="text-primary hover:text-primary/80 flex items-center space-x-1">
          <span>View details</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Card>
  )
}