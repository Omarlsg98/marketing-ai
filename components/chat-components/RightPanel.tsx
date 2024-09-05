import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from 'react';

interface PersonaInfo {
  name: string;
  whoTheyAre: string;
  needs: string;
  challenges: string;
}

const personas: PersonaInfo[] = [
  {
    name: "Small to Medium Enterprises (SMEs)",
    whoTheyAre: "Business owners or IT managers from companies with 10-200 employees.",
    needs: "Easy-to-deploy infrastructure, cost efficiency, control over data.",
    challenges: "Limited IT resources, budget constraints, and need for scalability.",
  },
  {
    name: "Enterprise Corporations",
    whoTheyAre: "CIOs, CTOs, and IT directors from large companies with 1000+ employees.",
    needs: "Robust security, compliance adherence, integration capabilities.",
    challenges: "Complex legacy systems, data migration, and regulatory requirements.",
  },
  {
    name: "Startups",
    whoTheyAre: "Founders and technical leads from newly established companies.",
    needs: "Rapid deployment, flexible infrastructure, pay-as-you-go models.",
    challenges: "Fast growth management, limited funding, and technical expertise gaps.",
  },
];

interface EditableFieldProps {
  label: string;
  oldValue: string;
  newValue: string;
  onEdit: (value: string) => void;
}

function EditableField({ label, oldValue, newValue, onEdit }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(newValue);

  return (
    <div className="space-y-2">
      <h4 className="font-semibold">{label}</h4>
      {isEditing ? (
        <Input
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
            onEdit(currentValue);
          }}
          autoFocus
        />
      ) : (
        <div
          className="p-2 border rounded cursor-text"
          onClick={() => setIsEditing(true)}
        >
          <span className="line-through text-red-500">{oldValue}</span>{' '}
          <span className="text-green-500">{newValue}</span>
        </div>
      )}
    </div>
  );
}

export function RightPanel() {
  const [activeTab, setActiveTab] = useState("all-personas");
  const [personaFields, setPersonaFields] = useState([
    { label: "Name", oldValue: "John Doe", newValue: "Jane Smith" },
    { label: "Age", oldValue: "30", newValue: "35" },
    { label: "Occupation", oldValue: "Software Developer", newValue: "Product Manager" },
    { label: "Interests", oldValue: "Coding, Gaming", newValue: "Hiking, Photography" },
  ]);

  const handleEdit = (index: number, value: string) => {
    setPersonaFields(prev => 
      prev.map((field, i) => 
        i === index ? { ...field, newValue: value } : field
      )
    );
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all-personas">All Personas</TabsTrigger>
        <TabsTrigger value="persona">Persona</TabsTrigger>
        <TabsTrigger value="customer-journey">Customer Journey</TabsTrigger>
        <TabsTrigger value="about-me">About Me</TabsTrigger>
        <TabsTrigger value="profile-image">Profile Image</TabsTrigger>
      </TabsList>

      <TabsContent value="all-personas">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {personas.map((persona, index) => (
            <Card 
              key={index} 
              className="cursor-pointer transition-all duration-300 hover:bg-secondary hover:scale-105"
            >
              <CardContent className="p-4">
                <h3 className="font-bold mb-2">{persona.name}</h3>
                <p className="text-sm mb-2"><strong>Who they are:</strong> {persona.whoTheyAre}</p>
                <p className="text-sm mb-2"><strong>Needs:</strong> {persona.needs}</p>
                <p className="text-sm"><strong>Challenges:</strong> {persona.challenges}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="persona">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Persona Details</h3>
            <p className="mb-4">Edit the suggested changes for this persona</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {personaFields.map((field, index) => (
                <EditableField
                  key={index}
                  label={field.label}
                  oldValue={field.oldValue}
                  newValue={field.newValue}
                  onEdit={(value) => handleEdit(index, value)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="customer-journey">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-4">Customer Journey</h3>
            <div className="flex flex-wrap justify-between">
              {['Discovery', 'Consideration', 'Purchase', 'Renewal'].map((stage) => (
                <div key={stage} className="text-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-2">
                    {stage[0]}
                  </div>
                  <p>{stage}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="about-me">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Persona Name</h3>
            <Textarea className="w-full h-40" placeholder="Enter information about the persona" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="profile-image">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-bold mb-2">Profile Image</h3>
            <Input className="mb-4" placeholder="Enter image generation prompt" />
            <div className="w-full h-64 bg-muted flex items-center justify-center mb-4">
              Generated Image Placeholder
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}