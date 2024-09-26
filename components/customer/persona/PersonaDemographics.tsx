import React from 'react'

export default function PersonaDemographics() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Persona Demographics</h2>
      <p className="text-sm text-muted-foreground">
        Key demographic information for each persona, including age range, income level, education, and occupation.
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Frugal Francesca: 25-35 years old, entry to mid-level professional, college educated, urban dweller.</li>
        <li>Busy Becca: 30-45 years old, mid-career professional or stay-at-home parent, suburban resident.</li>
        <li>Trendsetter Tara: 20-40 years old, varied occupations, tech-savvy, active on social media.</li>
      </ul>
    </div>
  )
}