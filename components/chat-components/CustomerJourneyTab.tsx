import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChatEditColumnComponent,
  ChatEditColumnCustomerJourney,
} from "@/types/components/chatTab";
import { FC, useState } from "react";

import { CardHeader, CardTitle } from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { ExtraInfo } from "@/types/interseed/chat";
import { CheckCircle } from "lucide-react";
import { Button } from "../ui/button";

interface JourneyStageProps {
  title: string;
  data: {
    [key: string]: string;
  };
  onEdit: (field: string, value: string) => void;
}

const JourneyStage: React.FC<JourneyStageProps> = ({ title, data, onEdit }) => {
  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-4">
            <Label
              htmlFor={`${title}-${key}`}
              className="text-sm font-medium w-24"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Label>
            <Input
              id={`${title}-${key}`}
              value={value}
              onChange={(e) => onEdit(key, e.target.value)}
              className="flex-grow"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

interface CustomerJourneyTabProps {
  displayInfo: ChatEditColumnComponent;
  handleDone: (message: string, extraInfo: ExtraInfo) => Promise<void>;
  submitting: boolean;
}

const CustomerJourneyTab: FC<CustomerJourneyTabProps> = ({
  displayInfo,
  handleDone,
  submitting,
}) => {
  const currentInfoJourney =
    displayInfo.current as ChatEditColumnCustomerJourney;
  if (!currentInfoJourney) {
    return null;
  }
  const [journey, setJourney] = useState(currentInfoJourney);
  const [hasChanges, setHasChanges] = useState(false);

  type Stage =
    | "awareness"
    | "consideration"
    | "purchase"
    | "retention"
    | "advocacy";

  const handleEditCJ = (stage: Stage, field: string, value: string) => {
    setJourney((prev) => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSummaryEdit = (value: string) => {
    setJourney((prev) => ({ ...prev, summary: value }));
    setHasChanges(true);
  };

  const submitInfo = async () => {
    if (!hasChanges) {
      await handleDone("The Customer Journey looks good! Let's continue.", {
        saved: true,
      });
    } else {
      await handleDone("What do you think about these changes?", {
        edited: true,
        modifications: journey,
      });
    }
  };

  const stages = [
    "awareness",
    "consideration",
    "purchase",
    "retention",
    "advocacy",
  ];

  return (
    <div className="space-y-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Customer Journey Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Edit the summary and each stage of the customer journey below. Click
            on each stage to expand and modify its details.
          </p>
          <Label
            htmlFor="journey-summary"
            className="text-sm font-medium mb-2 block"
          >
            Journey Summary
          </Label>
          <Textarea
            id="journey-summary"
            value={journey.summary}
            onChange={(e) => handleSummaryEdit(e.target.value)}
            rows={4}
            className="w-full"
          />
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        {stages.map((stage: Stage, index) => (
          <AccordionItem
            value={stage}
            key={stage}
            className="border rounded-lg mb-4"
          >
            <AccordionTrigger className="text-lg font-semibold px-4 py-2 hover:bg-muted/50">
              {index + 1}. {stage.charAt(0).toUpperCase() + stage.slice(1)}
            </AccordionTrigger>
            <AccordionContent className="px-4 py-2">
              <JourneyStage
                title={stage.charAt(0).toUpperCase() + stage.slice(1)}
                data={
                  journey[stage as keyof typeof journey] as {
                    [key: string]: string;
                  }
                }
                onEdit={(field, value) => handleEditCJ(stage, field, value)}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex justify-center mt-6">
        <Button
          onClick={submitInfo}
          disabled={submitting}
          className="px-6 py-2 text-lg"
        >
          {submitting
            ? "Submitting..."
            : hasChanges
              ? "Submit Changes"
              : "Done"}
          <CheckCircle className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default CustomerJourneyTab;
