"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PersonaListOutRecord } from "@/types/api/persona";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface CustomerPersonaCardProps {
  persona: PersonaListOutRecord;
}

export default function Component({ persona }: CustomerPersonaCardProps) {
  const progressValue = persona.chat_progress;

  const getProgressNote = (value: number) => {
    if (value < 33) return "Just started";
    if (value < 66) return "In progress";
    if (value < 100) return "Almost complete";
    return "Complete";
  };

  return (
    <div className="p-4" key={persona.id}>
      <Card className="w-full max-w-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
        <CardHeader className="flex flex-col items-center space-y-4 px-8 pt-8">
          <Avatar className="h-32 w-32">
            <AvatarImage
              src={ persona.image_url || "/placeholder.svg?height=400&width=400"}
              alt={persona.name}
            />
            <AvatarFallback>BB</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-2xl font-bold">{persona.name}</h2>
            <p className="text-muted-foreground">
              Persona: {persona.short_description}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <div className="space-y-2">
            <Progress value={progressValue} className="w-full" />
            <p
              className="text-sm text-muted-foreground text-right"
              aria-live="polite"
            >
              Status: {getProgressNote(progressValue)}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Primary Goal
            </h3>
            <p>{persona.primaryGoal || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Key Challenge
            </h3>
            <p>{persona.keyChallenge || "N/A"}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-semibold uppercase text-muted-foreground">
              Main Buying Motivation
            </h3>
            <p>{persona.mainBuyingMotivation || "N/A"}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start px-8 pb-8 pt-6">
          <Separator className="w-full" />
          <div className="mt-6 flex h-full">
            <div className="w-1/2 flex flex-col justify-center">
              <Link
                href={
                  (persona.finished && `/my/personas/${persona.id}`) ||
                  `/my/personas/chat/${persona.id}`
                }
                className="group flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80 active:text-primary/70"
              >
                {(persona.finished && "View details") || "Continue Questionary"}
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="w-1/2 flex flex-col justify-center">
            {!persona.finished && (
              <Link
                href={`/my/personas/${persona.id}`}
                className="group flex items-center text-sm font-medium text-primary transition-colors hover:text-primary/80 active:text-primary/70"
              >
                Preview details
                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )
            }
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
