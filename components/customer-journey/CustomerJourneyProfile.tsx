import { PersonaInformation } from "@/types/persona";

export default function CustomerJourneyProfile(
  personaInformation: {
    personaInformation: PersonaInformation['v1'] 
  } 
) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Customer Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Demographics</h3>
          <ul className="list-disc list-inside">
            <li>Age: 30-40</li>
            <li>Gender: Male</li>
            <li>Location: Urban areas</li>
            <li>Income: $75,000 - $100,000</li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Psychographics</h3>
          <ul className="list-disc list-inside">
            <li>Tech-savvy</li>
            <li>Early adopter</li>
            <li>Values efficiency and innovation</li>
            <li>Environmentally conscious</li>
          </ul>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold">Goals and Pain Points</h3>
        <ul className="list-disc list-inside">
          <li>Seeking cutting-edge technology solutions</li>
          <li>Wants to increase productivity</li>
          <li>Concerned about data privacy and security</li>
          <li>Struggles with information overload</li>
        </ul>
      </div>
    </div>
  )
}