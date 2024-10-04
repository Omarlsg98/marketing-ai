import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ChatEditColumnComponent,
  ChatEditColumnPersonaSelector,
} from "@/types/components/chatTab";
import { ExtraInfo } from "@/types/interseed/chat";
import { CheckCircle } from "lucide-react";
import { FC, useState } from "react";
import { Button } from "../ui/button";

interface PersonaSelectorTabProps {
  displayInfo: ChatEditColumnComponent;
  handleDone: (message: string, extraInfo: ExtraInfo) => Promise<void>;
  submitting: boolean;
}

const PersonaSelectorTab: FC<PersonaSelectorTabProps> = ({
  displayInfo,
  handleDone,
  submitting,
}) => {
  const currentInfoMultiplePersonas =
    displayInfo.current as ChatEditColumnPersonaSelector;
  const [selectedPersonaId, setSelectedPersona] = useState<string | null>(null);
  
  if (!currentInfoMultiplePersonas) {
    return null;
  }
  const personas = currentInfoMultiplePersonas.personas || [];

  const submitInfo = async () => {
    if (selectedPersonaId) {
      const persona = personas.find((p) => p.id === selectedPersonaId);
      await handleDone(
        `"${persona.title}" sounds promising! Let's go with this one.`,
        {
          idChoice: selectedPersonaId,
          saved: true,
          type: 'multiplePersona',
        }
      );
    }
  };

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Persona Options</CardTitle>
          <p className="mb-1 text-sm text-muted-foreground">
            Choose the persona that you want to create today
          </p>
        </CardHeader>
      </Card>
      <RadioGroup
        value={selectedPersonaId || ""}
        onValueChange={setSelectedPersona}
      >
        <div className="grid grid-cols-1 md:grid-rows-3 gap-4">
          {personas.map((persona, index) => (
            <Card
              key={persona.id}
              onClick={() => setSelectedPersona(persona.id)}
              className={`cursor-pointer transition-all duration-300 hover:bg-secondary ${
                selectedPersonaId === persona.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Label
                    htmlFor={`persona-${index}`}
                    className="font-bold cursor-pointer"
                  >
                    {persona.title}
                  </Label>
                  <RadioGroupItem
                    value={persona.id}
                    id={`persona-${index}`}
                    className="mr-2"
                  />
                </div>
                <p className="text-sm mb-2">
                  <strong>Who they are:</strong> {persona.whoTheyAre}
                </p>
                <p className="text-sm mb-2">
                  <strong>Needs:</strong> {persona.needs}
                </p>
                <p className="text-sm">
                  <strong>Challenges:</strong> {persona.challenges}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
      <div className="flex justify-center mt-6">
        <Button
          onClick={submitInfo}
          disabled={submitting}
          className="px-6 py-2 text-lg"
        >
          {submitting ? "Submitting..." : "Choose"}
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default PersonaSelectorTab;
