"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { hasProperty } from "@/lib/utils";
import { PersonaInformation } from "@/types/interseed/persona";

import {
  Activity,
  BarChart,
  BookOpen,
  Brain,
  CheckCircle,
  Edit2,
  FileText,
  Heart,
  Info,
  MessageCircle,
  Minus,
  Plus,
  Scale,
  Search
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import { CustomerJourneyInfoInterface } from "@/lib/constants/personaConstants";

interface ListItemProps {
  term: string;
  description: React.ReactNode;
}

const ListItem: React.FC<ListItemProps> = React.memo(
  ({ term, description }) => (
    <div>
      <dt className="font-semibold text-muted-foreground mb-2">{term}:</dt>
      <dd>{description}</dd>
    </div>
  )
);

const getIcon = (icon: CustomerJourneyInfoInterface['sections'][0]['icon']) => {
  switch (icon) {
    case "search":
      return <Search className="h-5 w-5" />;
    case "book":
      return <BookOpen className="h-5 w-5" />;
    case "chat":
      return <MessageCircle className="h-5 w-5" />;
    case "star":
      return <CheckCircle className="h-5 w-5" />;
    case "chart-bar":
      return <BarChart className="h-5 w-5" />;
    case "file":
      return <FileText className="h-5 w-5" />;
    case "brain":
      return <Brain className="h-5 w-5" />;
    case "heart":
      return <Heart className="h-5 w-5" />;
    case "user":
      return <CheckCircle className="h-5 w-5" />;
    case "balance-scale":
      return <Scale className="h-5 w-5" />;
    default:
      return <Activity className="h-5 w-5" />;
    }
}

ListItem.displayName = "ListItem";

interface CardData {
  title: string;
  description: string;
  icon: CustomerJourneyInfoInterface['sections'][0]['icon'];
  content: string[];
}

interface ProfileCardProps {
  title: string;
  icon: React.ReactNode;
  tooltipContent: string;
  explanation: string;
  children: React.ReactNode;
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = React.memo(
  ({ title, icon, tooltipContent, explanation, children, onEdit }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {icon}
            <Separator orientation="vertical" className="h-6" />
            <CardTitle>{title}</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <span className="sr-only">
                      More information about {title}
                    </span>
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="start" className="max-w-xs">
                  <p>{explanation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label={`Edit ${title}`}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="pt-2 pb-6">{children}</CardContent>
    </Card>
  )
);

ProfileCard.displayName = "ProfileCard";

interface CustomerJourneyTabProps {
  currentTabInfo: CustomerJourneyInfoInterface;
  personaInformation: PersonaInformation["v1"];
}

const sectionToCardData = (
  sections: CustomerJourneyInfoInterface["sections"],
  personaInformation: PersonaInformation["v1"],
  dataFieldName: CustomerJourneyInfoInterface["dataFieldName"]
): CardData[] => {
  return sections.map((section) => {
    const content =
      hasProperty(personaInformation, dataFieldName) &&
      hasProperty(personaInformation[dataFieldName], section.dataFieldName)
        ? (personaInformation[dataFieldName][section.dataFieldName] as string[])
        : [];
    return {
      title: section.title,
      description: section.description,
      icon: section.icon,
      content,
    };
  })
}

export default function CustomerJourneyTabComponent({
  currentTabInfo,
  personaInformation,
}: CustomerJourneyTabProps) {
  const [currentTab, setCurrentTab] = useState(currentTabInfo);
  const [tabDataFieldName, setTabDataFieldName] = useState(
    currentTab.dataFieldName
  );
  const [cardData, setCardData] = useState<CardData[]>(
    sectionToCardData(currentTab.sections, personaInformation, tabDataFieldName)
  );
  const [editingCard, setEditingCard] = useState<number | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  useEffect(() => {
    setCurrentTab(currentTabInfo);
    setTabDataFieldName(currentTabInfo.dataFieldName);
    setCardData(
      sectionToCardData(
        currentTabInfo.sections,
        personaInformation,
        currentTabInfo.dataFieldName
      )
    );
  }, [currentTabInfo, personaInformation]);


  const handleEdit = useCallback(
    (cardIndex: number) => {
      setEditingCard(cardIndex);
      setEditingData(JSON.parse(JSON.stringify(cardData[cardIndex].content)));
    },
    [cardData]
  );

  const handleSave = useCallback(() => {
    if (editingCard) {
      setCardData((prevData) =>
        prevData.map((item, index) =>
          index === editingCard ? { ...item, content: editingData } : item
        )
      );
      setEditingCard(null);
    }
  }, [editingCard, editingData]);

  const handleInputChange = useCallback((key: string, value: any) => {
    setEditingData((prevData: any) => ({
      ...prevData,
      [key]: value,
    }));
  }, []);

  const handleArrayInputChange = useCallback(
    (key: string, index: number, value: string) => {
      setEditingData((prevData: any) => {
        if (Array.isArray(prevData)) {
          return prevData.map((item, i) => (i === index ? value : item));
        } else if (
          typeof prevData === "object" &&
          Array.isArray(prevData[key])
        ) {
          return {
            ...prevData,
            [key]: prevData[key].map((item: any, i: number) =>
              i === index
                ? typeof item === "string"
                  ? value
                  : { ...item, text: value }
                : item
            ),
          };
        }
        return prevData;
      });
    },
    []
  );

  const handleAddArrayItem = useCallback((key?: string) => {
    setEditingData((prevData: any) => {
      if (Array.isArray(prevData)) {
        return [...prevData, ""];
      } else if (
        typeof prevData === "object" &&
        key &&
        Array.isArray(prevData[key])
      ) {
        return {
          ...prevData,
          [key]: [...prevData[key], ""],
        };
      }
      return prevData;
    });
  }, []);

  const handleRemoveArrayItem = useCallback((key: string, index: number) => {
    setEditingData((prevData: any) => {
      if (Array.isArray(prevData)) {
        return prevData.filter((_, i) => i !== index);
      } else if (typeof prevData === "object" && Array.isArray(prevData[key])) {
        return {
          ...prevData,
          [key]: prevData[key].filter((_: any, i: number) => i !== index),
        };
      }
      return prevData;
    });
  }, []);

  const renderEditFields = () => {
    if (!editingCard || !editingData) return null;

    return (
      <>
        <p className="text-sm text-muted-foreground mb-6">
          {cardData[editingCard].description}
        </p>
        {Array.isArray(editingData) ? (
          <div className="space-y-4">
            {editingData.map((item: string, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) =>
                      handleArrayInputChange("", index, e.target.value)
                    }
                    className="flex-grow transition-shadow duration-200 hover:shadow-md focus:shadow-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveArrayItem("", index)}
                  >
                    <span className="sr-only">Remove item</span>
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={() => handleAddArrayItem()}
              variant="outline"
              className="flex items-center space-x-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add more</span>
            </Button>
          </div>
        ) : (
          Object.entries(editingData).map(([key, value]) => (
            <div key={key} className="space-y-4">
              <Label htmlFor={key} className="text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              <Input
                id={key}
                value={value as string}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full transition-shadow duration-200 hover:shadow-md focus:shadow-md"
              />
            </div>
          ))
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cardData.map((section, index) => (
          <ProfileCard
            key={index}
            title={section.title}
            icon={getIcon(section.icon)}
            tooltipContent={section.description}
            explanation={section.description}
            onEdit={() => handleEdit(index)}
          >
            <ul className="list-disc pl-5 space-y-2">
              {section.content.map((content, i) => (
                <li key={i}>{content}</li>
              ))}
            </ul>
          </ProfileCard>
        ))}
      </div>

      <Dialog
        open={editingCard !== null}
        onOpenChange={(open) => !open && setEditingCard(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader className="mb-6">
            <DialogTitle>Edit {editingCard}</DialogTitle>
          </DialogHeader>
          <Separator className="mb-6" />
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 px-4 pb-6">{renderEditFields()}</div>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
