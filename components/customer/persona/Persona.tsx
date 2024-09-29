"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FullPersona } from "@/types/components/persona";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Heart,
  Search,
  ShoppingCart,
  Star,
} from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";

interface PersonaProfileUIProps {
  persona: FullPersona;
}

const PersonaProfileUI: FC<PersonaProfileUIProps> = ({ persona }) => {
  const [isJourneyExpanded, setIsJourneyExpanded] = useState(false);

  const customerJourneySections: {
    stage:
      | "awareness"
      | "consideration"
      | "purchase"
      | "retention"
      | "advocacy";
    Icon: typeof AlertCircle;
  }[] = [
    { stage: "awareness", Icon: AlertCircle },
    { stage: "consideration", Icon: Search },
    { stage: "purchase", Icon: ShoppingCart },
    { stage: "retention", Icon: Heart },
    { stage: "advocacy", Icon: Star },
  ];

  return (
    <div className="container mx-auto p-6 bg-background">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {persona.name || "Unnamed Persona"}
        </h1>
        {!persona.isFinished && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline">In Progress</Badge>
            <Button size="sm">Let's Finish it</Button>
          </div>
        )}
      </div>
      <div className="h-[calc(100vh-100px)] overflow-y-auto pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left Column */}
          <div className="space-y-6">
            {persona.image_url ? (
              <Image
                src={
                  persona.image_url || "/placeholder.svg?height=400&width=400"
                }
                alt={persona.name || "Persona"}
                width={300}
                height={300}
                className="rounded-lg mx-auto"
              />
            ) : (
              <div className="w-[300px] h-[300px] bg-muted rounded-lg mx-auto flex items-center justify-center">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
            <div className="space-y-4">
              <p className="text-center text-lg">
                {persona.shortDescription || "No description available"}
              </p>
              <h2 className="text-xl font-semibold">Title: {persona.title}</h2>
              <div className="space-y-2">
                <p>
                  <strong>Who They Are:</strong>{" "}
                  {persona.shortInformation.whoTheyAre}
                </p>
                <p>
                  <strong>Needs:</strong> {persona.shortInformation.needs}
                </p>
                <p>
                  <strong>Challenges:</strong>{" "}
                  {persona.shortInformation.challenges}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="about" className="w-1/2">
                About Me
              </TabsTrigger>
              <TabsTrigger value="details" className="w-1/2">
                Details
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="prose">
                    {persona.aboutMe ||
                      "About me information is not available. Finish it with Ethan!"}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {persona.details ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold">Demographics</h3>
                        <ul className="list-disc pl-5">
                          {persona.details.demographics.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold">Psychographics</h3>
                        <ul className="list-disc pl-5">
                          {persona.details.psychographics.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold">Behavior</h3>
                        <ul className="list-disc pl-5">
                          {persona.details.behavior.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold">Needs</h3>
                        <ul className="list-disc pl-5">
                          {persona.details.needs.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <p>No detailed information available.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Customer Journey Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Customer Journey</h2>
            <Separator className="flex-grow mx-4" />
          </div>

          <Collapsible
            open={isJourneyExpanded}
            onOpenChange={setIsJourneyExpanded}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full flex justify-between items-center"
              >
                <span>Journey Summary</span>
                {isJourneyExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">
                    {persona.customerJourney?.summary ||
                      "No customer journey summary available."}
                  </p>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {customerJourneySections.map(({ stage, Icon }) => (
              <Card key={stage} className="flex flex-col">
                <CardHeader className="flex-row items-center space-y-0 gap-2">
                  <Icon className="h-5 w-5" />
                  <CardTitle className="capitalize">{stage}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {persona.customerJourney && persona.customerJourney[stage] ? (
                    <div className="space-y-2">
                      <p>
                        <strong>
                          {stage === "awareness"
                            ? "Trigger"
                            : stage === "consideration"
                              ? "Research"
                              : stage === "purchase"
                                ? "Decision"
                                : stage === "retention"
                                  ? "Engagement"
                                  : "Satisfaction"}
                          :
                        </strong>{" "}
                        {persona.customerJourney[stage]["main"] as any}
                      </p>
                      <p>
                        <strong>Touchpoints:</strong>{" "}
                        {persona.customerJourney[stage].touchpoints}
                      </p>
                      <p>
                        <strong>Action:</strong>{" "}
                        {persona.customerJourney[stage].action}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No information available for this stage.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaProfileUI;