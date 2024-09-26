import React from 'react'

export default function PersonaDescription() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Persona Descriptions</h2>
      <p className="text-sm text-muted-foreground">
        Detailed descriptions of each identified persona, including their characteristics, behaviors, and motivations.
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Frugal Francesca: A young professional focused on saving money and making smart financial decisions.</li>
        <li>Busy Becca: A parent juggling work and family responsibilities, always looking for time-saving solutions.</li>
        <li>Trendsetter Tara: An early adopter of new technologies, influencing her peers' purchasing decisions.</li>
      </ul>
    </div>
  )
}