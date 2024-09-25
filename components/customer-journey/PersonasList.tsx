// Chat.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { PersonaList } from "@/types/components/persona";
import { Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";

interface PersonasGridUIProps {
  personas: PersonaList;
}

const PersonasGrid: FC<PersonasGridUIProps> = ({ personas }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Personas</h1>
      <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4">
        {personas.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-2xl font-bold mb-4">No personas yet</h2>
            <p className="text-muted-foreground mb-6">
              Talk with Ethan the agent to create personas
            </p>
            <Button>
              <Bot size={24} className="pr-1" />
              <Link href="/my/chats/create">Chat with Ethan</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {personas.map((persona) => (
              <Link
                key={persona.id}
                href={
                  !persona.isSuggestion ? `/my/personas/${persona.id}` : "#"
                }
              >
                <Card
                  className={`transition-all duration-300  ${
                    persona.isSuggestion
                      ? "bg-card border-dashed sketch-bg"
                      : "bg-card cursor-pointer hover:shadow-lg"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center md:items-start">
                        <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                          <Image
                            src={persona.image_url || "/placeholder.svg"}
                            alt={persona.name || "Persona"}
                            width={128}
                            height={128}
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                          {persona.title}
                        </p>
                        <CardTitle className="text-center md:text-left mb-2">
                          {persona.name || "Mysterious Persona"}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground text-center md:text-left">
                          {persona.shortDescription ||
                            "This persona is a mystery. Talk to Ethan to unveil their secrets."}
                        </p>
                      </div>
                      <div className="content-center">
                        <dl className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <dt className="font-semibold">Who They Are:</dt>
                            <dd>{persona.whoTheyAre}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Needs:</dt>
                            <dd>{persona.needs}</dd>
                          </div>
                          <div>
                            <dt className="font-semibold">Challenges:</dt>
                            <dd>{persona.challenges}</dd>
                          </div>
                        </dl>
                        {persona.isSuggestion && (
                          <Badge variant="secondary" className="mt-2">
                            Suggested
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
};

export default PersonasGrid;
