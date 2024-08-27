"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PersonaInformation } from "@/types/persona"
import { BookOpen, Briefcase, Edit2, Heart, Info, MessageCircle, Minus, Plus, Target, User } from "lucide-react"
import React, { useCallback, useState } from 'react'

interface ListItemProps {
  term: string
  description: React.ReactNode
}

const ListItem: React.FC<ListItemProps> = React.memo(({ term, description }) => (
  <div>
    <dt className="font-semibold text-muted-foreground mb-2">{term}:</dt>
    <dd>{description}</dd>
  </div>
))

interface CardData {
  customerGoals: string[];
  customerThoughts: string[];
  customerActions: string[];
  touchpoints: string[];
  customerResponse: string[];
  recommendations: string[];
}

interface ProfileCardProps {
  title: string;
  icon: React.ReactNode;
  tooltipContent: string;
  explanation: string;
  children: React.ReactNode;
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = React.memo(({ 
  title, 
  icon, 
  tooltipContent, 
  explanation,
  children, 
  onEdit 
}) => (
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
    <CardContent className="pt-2 pb-6">
      {children}
    </CardContent>
  </Card>
))

export default function CustomerJourneyEvaluation(  
  personaInformation: PersonaInformation['v1'] 
) {
  const [cardData, setCardData] = useState<CardData>({
    customerGoals: [
      "Compare different products or services.",
      "Understand the pros and cons of each option.",
      "Narrow down choices to a shortlist of viable options."
    ],
    customerThoughts: [
      "Which product offers the best value for money?",
      "What are the specific differences between options A and B?",
      "Have other customers had positive experiences with these products?"
    ],
    customerActions: [
      "Reading detailed product reviews and testimonials.",
      "Using comparison tools or charts.",
      "Consulting with friends or family for recommendations.",
      "Contacting customer service for additional information."
    ],
    touchpoints: [
      "Product review sites and user testimonials.",
      "Comparison tools on websites.",
      "FAQs and detailed product descriptions.",
      "Customer service interactions (chat, phone)."
    ],
    customerResponse: [
      "Confusion due to numerous options.",
      "Reassurance from positive reviews.",
      "Growing confidence as they progress in their decision-making process."
    ],
    recommendations: [
      "Offer detailed comparison tools on your website to facilitate easy and informative comparisons.",
      "Highlight user testimonials and case studies to build trust and offer real-world insights.",
      "Train customer service to provide detailed and empathetic responses tailored to specific inquiries.",
      "Create comprehensive FAQ sections to address common concerns and questions.",
      "Use visual content like charts and infographics to make comparisons intuitive and easy to understand.",
      "Encourage past customers to leave detailed reviews and testimonials.",
      "Use email marketing to send personalized recommendations based on user behavior.",
      "Hold webinars or live Q&A sessions to address product comparisons and answer potential customer questions directly."
    ]
  });

  const [editingCard, setEditingCard] = useState<keyof CardData | null>(null);
  const [editingData, setEditingData] = useState<any>(null);

  const handleEdit = useCallback((cardName: keyof CardData) => {
    setEditingCard(cardName);
    setEditingData(JSON.parse(JSON.stringify(cardData[cardName])));
  }, [cardData]);

  const handleSave = useCallback(() => {
    if (editingCard) {
      setCardData(prevData => ({
        ...prevData,
        [editingCard]: editingData
      }));
      setEditingCard(null);
    }
  }, [editingCard, editingData]);

  const handleInputChange = useCallback((key: string, value: any) => {
    setEditingData((prevData: any) => ({
      ...prevData,
      [key]: value
    }));
  }, []);

  const handleArrayInputChange = useCallback((key: string, index: number, value: string) => {
    setEditingData((prevData: any) => {
      if (Array.isArray(prevData)) {
        return prevData.map((item, i) => i === index ? value : item);
      } else if (typeof prevData === 'object' && Array.isArray(prevData[key])) {
        return {
          ...prevData,
          [key]: prevData[key].map((item: any, i: number) => 
            i === index ? (typeof item === 'string' ? value : { ...item, text: value }) : item
          )
        };
      }
      return prevData;
    });
  }, []);

  const handleAddArrayItem = useCallback((key?: string) => {
    setEditingData((prevData: any) => {
      if (Array.isArray(prevData)) {
        return [...prevData, ''];
      } else if (typeof prevData === 'object' && key && Array.isArray(prevData[key])) {
        return {
          ...prevData,
          [key]: [...prevData[key], '']
        };
      }
      return prevData;
    });
  }, []);

  const handleRemoveArrayItem = useCallback((key: string, index: number) => {
    setEditingData((prevData: any) => {
      if (Array.isArray(prevData)) {
        return prevData.filter((_, i) => i !== index);
      } else if (typeof prevData === 'object' && Array.isArray(prevData[key])) {
        return {
          ...prevData,
          [key]: prevData[key].filter((_: any, i: number) => i !== index)
        };
      }
      return prevData;
    });
  }, []);

  const renderEditFields = () => {
    if (!editingCard || !editingData) return null;

    const explanations = {
      customerGoals: "Define the customer's objectives during the Evaluation/Comparison phase.",
      customerThoughts: "Capture the questions and considerations in the customer's mind.",
      customerActions: "List the actions customers take to compare and evaluate options.",
      touchpoints: "Identify the various points of contact between the customer and your brand.",
      customerResponse: "Describe the overall emotional response of customers during this phase.",
      recommendations: "Suggest strategies to improve the customer's experience in this phase."
    };

    return (
      <>
        <p className="text-sm text-muted-foreground mb-6">
          {explanations[editingCard as keyof typeof explanations]}
        </p>
        {Array.isArray(editingData) ? (
          <div className="space-y-4">
            {editingData.map((item: string, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={item}
                    onChange={(e) => handleArrayInputChange('', index, e.target.value)}
                    className="flex-grow transition-shadow duration-200 hover:shadow-md focus:shadow-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveArrayItem('', index)}
                  >
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
          <Input
            value={editingData}
            onChange={(e) => handleInputChange('', e.target.value)}
            className="w-full transition-shadow duration-200 hover:shadow-md focus:shadow-md"
          />
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard 
          title="Customer Goals" 
          icon={<Target className="h-5 w-5" />}
          tooltipContent="Objectives customers aim to achieve during the Evaluation/Comparison phase."
          explanation="Edit to refine the goals customers typically have when comparing options."
          onEdit={() => handleEdit('customerGoals')}
        >
          <ul className="list-disc pl-5 space-y-2">
            {cardData.customerGoals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </ProfileCard>

        <ProfileCard 
          title="Customer Thoughts" 
          icon={<MessageCircle className="h-5 w-5" />}
          tooltipContent="Questions and considerations in the customer's mind during comparison."
          explanation="Edit to update the typical thoughts and questions customers have while comparing options."
          onEdit={() => handleEdit('customerThoughts')}
        >
          <ul className="list-disc pl-5 space-y-2">
            {cardData.customerThoughts.map((thought, index) => (
              <li key={index}>{thought}</li>
            ))}
          </ul>
        </ProfileCard>

        <ProfileCard 
          title="Customer Actions" 
          icon={<User className="h-5 w-5" />}
          tooltipContent="Actions taken by customers to compare and evaluate options."
          explanation="Edit to update the list of actions customers typically take during their evaluation."
          onEdit={() => handleEdit('customerActions')}
        >
          <ul className="list-disc pl-5 space-y-2">
            {cardData.customerActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </ProfileCard>

        <ProfileCard 
          title="Touchpoints" 
          icon={<Briefcase className="h-5 w-5" />}
          tooltipContent="Points of contact between the customer and your brand during comparison."
          explanation="Edit to refine the list of touchpoints where customers interact with your brand during evaluation."
          onEdit={() => handleEdit('touchpoints')}
        >
          <ul className="list-disc pl-5 space-y-2">
            {cardData.touchpoints.map((touchpoint, index) => (
              <li key={index}>{touchpoint}</li>
            ))}
          </ul>
        </ProfileCard>

        <ProfileCard 
          title="Overall Customer Response" 
          icon={<Heart className="h-5 w-5" />}
          tooltipContent="Emotional response of customers during the Evaluation/Comparison phase."
          explanation="Edit to update the typical emotional responses customers experience during comparison."
          onEdit={() => handleEdit('customerResponse')}
        >
          <ul className="list-disc pl-5 space-y-2">
            {cardData.customerResponse.map((response, index) => (
              <li key={index}>{response}</li>
            ))}
          </ul>
        </ProfileCard>

        <ProfileCard 
          title="Recommendations" 
          icon={<BookOpen className="h-5 w-5" />}
          tooltipContent="Strategies to improve customer experience during the Evaluation/Comparison phase."
          explanation="Edit to refine recommendations for enhancing the customer's comparison experience."
          onEdit={() => handleEdit('recommendations')}
        >
          <ul className="list-disc pl-5 space-y-2">
            {cardData.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </ProfileCard>
      </div>

      <Dialog open={editingCard !== null} onOpenChange={(open) => !open && setEditingCard(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader className="mb-6">
            <DialogTitle>Edit {editingCard}</DialogTitle>
          </DialogHeader>
          <Separator className="mb-6" />
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6 px-4 pb-6">
              {renderEditFields()}
            </div>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}