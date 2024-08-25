"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, ShoppingCart, Heart, BookOpen, Briefcase, Target, MessageCircle, Edit2, Plus, Minus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  psychographic: {
    interests: string[];
    values: string[];
    lifestyle: string;
    personalityTraits: string;
  };
  behavioral: {
    buyingHabits: string;
    brandInteractions: string;
    loyalty: string;
  };
  situation: {
    highestPriority: string;
    painPoints: string[];
    motivation: string;
    needs: string;
    objectives: string;
  };
  habits: {
    mediaConsumption: string;
    likes: string;
    habitsAndSkills: string;
    researchMethods: string;
    trustedResources: string;
  };
  decision: {
    reportsTo: string;
    buyingPower: string;
    budget: string;
    keyStakeholders: string;
    purchasingProcess: string[];
  };
  goals: string[];
  customerFeedback: { id: number; text: string }[];
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

export default function CustomerProfileTabComponent() {
  const [cardData, setCardData] = useState<CardData>({
    psychographic: {
      interests: ['Fitness', 'Technology', 'Travel'],
      values: ['Sustainability', 'Innovation', 'Quality'],
      lifestyle: 'Active, Tech-Savvy',
      personalityTraits: 'Adventurous, Detail-Oriented'
    },
    behavioral: {
      buyingHabits: 'Prefers Online Shopping',
      brandInteractions: 'Engages with Brands on Social Media',
      loyalty: 'Brand Loyal'
    },
    situation: {
      highestPriority: 'Get sales',
      painPoints: ['Time Management', 'Marketing Strategy', 'Strapped Budget'],
      motivation: 'Customer Acquisition',
      needs: 'Cost Effective Resources',
      objectives: 'Stay Ahead of Competitors'
    },
    habits: {
      mediaConsumption: 'Reads marketing blogs, attends virtual events',
      likes: 'Being able to quickly implement new information',
      habitsAndSkills: 'Excellent management skills for making good business decisions',
      researchMethods: 'Methodical, analytical and always based on a solid ROI analysis',
      trustedResources: 'Peers, former classmates, networks, LinkedIn Groups'
    },
    decision: {
      reportsTo: 'No One',
      buyingPower: 'Full Authority',
      budget: '£12,000/year',
      keyStakeholders: 'Just her',
      purchasingProcess: ['Research', 'Review', 'Trial']
    },
    goals: [
      'Efficiency in Daily Tasks',
      'Quality Products'
    ],
    customerFeedback: [
      { id: 1, text: 'I love products that save me time and are reliable.' },
      { id: 2, text: 'The customer service is exceptional.' },
      { id: 3, text: 'Great value for money.' }
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
        if (typeof prevData[0] === 'string') {
          return [...prevData, ''];
        } else {
          const newId = Math.max(...prevData.map((item: any) => item.id), 0) + 1;
          return [...prevData, { id: newId, text: '' }];
        }
      } else if (typeof prevData === 'object' && key && Array.isArray(prevData[key])) {
        return {
          ...prevData,
          [key]: [
            ...prevData[key],
            typeof prevData[key][0] === 'string' ? '' : { id: Date.now(), text: '' }
          ]
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
      psychographic: "Dive into the customer's mind! Uncover their passions, values, and quirks that make them tick.",
      behavioral: "Peek into the customer's shopping cart! Discover their buying habits and brand love affairs.",
      situation: "Step into the customer's shoes! Explore their current battles, dreams, and secret weapons.",
      habits: "Become the customer's shadow! Follow their daily rituals and information-seeking adventures.",
      decision: "Enter the customer's war room! Unveil their decision-making process and power plays.",
      goals: "Climb aboard the customer's rocket ship! Chart the course to their wildest aspirations.",
      customerFeedback: "Tune into the customer's frequency! Capture their raw, unfiltered thoughts and feelings."
    };

    return (
      <>
        <p className="text-sm text-muted-foreground mb-6">
          {explanations[editingCard as keyof typeof explanations]}
        </p>
        {Array.isArray(editingData) ? (
          <div className="space-y-4">
            {editingData.map((item: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={typeof item === 'string' ? item : item.text}
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
          Object.entries(editingData).map(([key, value]) => (
            <div key={key} className="space-y-4">
              <Label htmlFor={key} className="text-sm font-medium">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Label>
              {Array.isArray(value) ? (
                <div className="space-y-4">
                  {value.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        id={`${key}-${index}`}
                        value={typeof item === 'string' ? item : item.text}
                        onChange={(e) => handleArrayInputChange(key, index, e.target.value)}
                        className="flex-grow transition-shadow duration-200 hover:shadow-md focus:shadow-md"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveArrayItem(key, index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    onClick={() => handleAddArrayItem(key)} 
                    variant="outline" 
                    className="flex items-center space-x-2 mt-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add more</span>
                  </Button>
                </div>
              ) : (
                <Input
                  id={key}
                  value={value as string}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  className="w-full transition-shadow duration-200 hover:shadow-md focus:shadow-md"
                />
              )}
            </div>
          ))
        )}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard 
          title="Psychographic Information" 
          icon={<User className="h-5 w-5" />}
          tooltipContent="Psychological characteristics of the customer including interests, values, and personality traits."
          explanation="Use this card to understand the customer's mindset. Edit to refine your understanding of their interests, values, lifestyle, and personality traits."
          onEdit={() => handleEdit('psychographic')}
        >
          <dl className="space-y-6">
            <ListItem 
              term="Interests" 
              description={
                <div className="flex flex-wrap gap-2">
                  {cardData.psychographic.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              }
            />
            <ListItem 
              term="Values" 
              description={
                <div className="flex flex-wrap gap-2">
                  {cardData.psychographic.values.map((value, index) => (
                    <Badge key={index} variant="outline">{value}</Badge>
                  ))}
                </div>
              }
            />
            <ListItem term="Lifestyle" description={cardData.psychographic.lifestyle} />
            <ListItem term="Personality Traits" description={cardData.psychographic.personalityTraits} />
          </dl>
        </ProfileCard>

        <ProfileCard 
          title="Behavioral Information" 
          icon={<ShoppingCart className="h-5 w-5" />}
          tooltipContent="Customer's buying habits, brand interactions, and loyalty."
          explanation="This card helps you track customer behavior. Edit to update information on their buying habits, how they interact with brands, and their loyalty status."
          onEdit={() => handleEdit('behavioral')}
        >
          <dl className="space-y-6">
            <ListItem term="Buying Habits" description={cardData.behavioral.buyingHabits} />
            <ListItem term="Brand Interactions" description={cardData.behavioral.brandInteractions} />
            <ListItem term="Loyalty" description={<Badge variant="default">{cardData.behavioral.loyalty}</Badge>} />
          </dl>
        </ProfileCard>

        <ProfileCard 
          title="Situation" 
          icon={<Heart className="h-5 w-5" />}
          tooltipContent="Current circumstances, priorities, and challenges of the customer."
          explanation="Use this to understand the customer's current context. Edit to update their priorities, pain points, motivations, needs, and objectives."
          onEdit={() => handleEdit('situation')}
        >
          <dl className="space-y-6">
            <ListItem term="Highest Priority" description={<Badge variant="destructive">{cardData.situation.highestPriority}</Badge>} />
            <ListItem 
              term="Pain Points" 
              description={
                <ul className="list-disc pl-5 space-y-1">
                  {cardData.situation.painPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              }
            />
            <ListItem term="Motivation" description={cardData.situation.motivation} />
            <ListItem term="Needs" description={cardData.situation.needs} />
            <ListItem term="Objectives" description={cardData.situation.objectives} />
          </dl>
        </ProfileCard>

        <ProfileCard 
          title="Habits" 
          icon={<BookOpen className="h-5 w-5" />}
          tooltipContent="Customer's media consumption, preferences, and research methods."
          explanation="This card tracks the customer's information habits. Edit to update their media consumption, likes, skills, research methods, and trusted resources."
          onEdit={() => handleEdit('habits')}
        >
          <dl className="space-y-6">
            <ListItem term="Media Consumption" description={cardData.habits.mediaConsumption} />
            <ListItem term="Likes" description={cardData.habits.likes} />
            <ListItem term="Habits & Skills" description={cardData.habits.habitsAndSkills} />
            <ListItem term="Research Methods" description={cardData.habits.researchMethods} />
            <ListItem term="Trusted Resources" description={cardData.habits.trustedResources} />
          </dl>
        </ProfileCard>

        <ProfileCard 
          title="Decision" 
          icon={<Briefcase className="h-5 w-5" />}
          tooltipContent="Customer's decision-making process and authority."
          explanation="Use this to understand the customer's decision-making context. Edit to update their reporting structure, buying power, budget, stakeholders, and purchasing process."
          onEdit={() => handleEdit('decision')}
        >
          <dl className="space-y-6">
            <ListItem term="Reports To" description={cardData.decision.reportsTo} />
            <ListItem term="Buying Power" description={cardData.decision.buyingPower} />
            <ListItem term="Budget" description={<Badge variant="secondary">{cardData.decision.budget}</Badge>} />
            <ListItem term="Key Stakeholders" description={cardData.decision.keyStakeholders} />
            <ListItem 
              term="Purchasing Process" 
              description={
                <div className="flex flex-wrap gap-2">
                  {cardData.decision.purchasingProcess.map((step, index) => (
                    <Badge key={index} variant="outline">{step}</Badge>
                  ))}
                </div>
              }
            />
          </dl>
        </ProfileCard>

        <ProfileCard 
          title="Goals" 
          icon={<Target className="h-5 w-5" />}
          tooltipContent="Customer's primary objectives and desired outcomes."
          explanation="This card lists the customer's goals. Edit to add, remove, or modify their objectives to keep your understanding up-to-date."
          onEdit={() => handleEdit('goals')}
        >
          <ul className="list-none space-y-2">
            {cardData.goals.map((goal, index) => (
              <li key={index} className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></span>
                {goal}
              </li>
            ))}
          </ul>
        </ProfileCard>
      </div>

      <ProfileCard 
        title="Customer Quotes/Feedback" 
        icon={<MessageCircle className="h-5 w-5" />}
        tooltipContent="Direct quotes and feedback from the customer."
        explanation="Use this card to record verbatim customer feedback. Edit to add new quotes or update existing ones to track customer sentiment over time."
        onEdit={() => handleEdit('customerFeedback')}
      >
        <div className="space-y-2">
          {cardData.customerFeedback.map((feedback, index) => (
            <div key={feedback.id} className="text-muted-foreground">
              {index + 1}. {feedback.text}
            </div>
          ))}
        </div>
      </ProfileCard>

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