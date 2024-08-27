"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PersonaInformation } from '@/types/persona'
import { Activity, BarChart, BookOpen, CheckCircle, Edit2, FileText, Info, MessageCircle, Minus, Plus, Search } from "lucide-react"
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
  overallCustomerResponse: {
    emotions: string;
  };
  painPoints: string[];
  contentTypes: string[];
  metricsTracking: string[];
  successIndicators: string[];
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
                  <span className="sr-only">More information about {title}</span>
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

export default function CustomerJourneyDiscoveryComponent(
  personaInformation: PersonaInformation['v1'] 
) {
  const [cardData, setCardData] = useState<CardData>({
    customerGoals: [
      'Identify potential solutions to their problem.',
      'Gain awareness of available products or services.',
      'Understand the broader category or market.'
    ],
    customerThoughts: [
      'What are the best options available to solve my issue?',
      'How well-known and reputable are the brands or products in this category?',
      'Are there any innovative solutions I haven\'t considered?'
    ],
    customerActions: [
      'Searching online for information or solutions.',
      'Reading blogs, articles, and guides.',
      'Watching videos or tutorials.',
      'Engaging with social media content.'
    ],
    touchpoints: [
      'Online advertisements.',
      'Social media posts and interactions.',
      'Blog articles and thought pieces.',
      'Videos on platforms like YouTube.',
      'Infographics and visual content.'
    ],
    overallCustomerResponse: {
      emotions: 'Excitement about possibilities, curiosity, initial confusion or overwhelm.'
    },
    painPoints: [
      'Information overload from too many sources.',
      'Difficulty in finding credible information.',
      'Unclear differentiation between products.'
    ],
    contentTypes: [
      'Educational Blogs: Detailed articles about the product category and solutions.',
      'Video Tutorials: Step-by-step guides and explanatory videos.',
      'Infographics: Visual content to simplify complex information.'
    ],
    metricsTracking: [
      'Track website traffic and bounce rates.',
      'Monitor engagement metrics on social media (likes, shares, comments).',
      'Measure the click-through rates (CTR) of online ads.',
      'Analyze time spent on informational pages.',
      'Use tools like Google Analytics for in-depth analysis.'
    ],
    successIndicators: [
      'High engagement rates on social media and blog posts.',
      'Increased traffic to the website from search engines.',
      'Positive sentiment in customer interactions and feedback.',
      'Higher click-through rates on targeted ads.'
    ],
    recommendations: [
      'Create engaging and informative content (blogs, videos).',
      'Use targeted ads to reach potential customers.',
      'Optimize social media presence with educational posts.',
      'Provide clear and easy-to-find information on your website.',
      'Implement SEO best practices to improve search engine rankings.',
      'Offer free resources such as eBooks or whitepapers to capture leads.',
      'Conduct webinars or live sessions to interact directly with potential customers.'
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
      customerGoals: "Define what the customer aims to achieve during this phase.",
      customerThoughts: "Capture the questions and considerations running through the customer's mind.",
      customerActions: "List the specific steps the customer takes to gather information.",
      touchpoints: "Identify all the ways the customer interacts with your brand or product.",
      overallCustomerResponse: "Summarize the customer's emotional state and general reaction.",
      painPoints: "Highlight the challenges and frustrations customers face during this phase.",
      contentTypes: "Outline the various formats of content that can address customer needs.",
      metricsTracking: "List the key performance indicators to measure success in this phase.",
      successIndicators: "Define the signs that indicate a positive customer experience.",
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
      <Card className="p-6">
        <CardTitle className="mb-4">Discovery/Research Phase</CardTitle>
        <Separator className="my-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileCard 
            title="Customer Goals" 
            icon={<Search className="h-5 w-5" />}
            tooltipContent="What the customer aims to achieve during this phase."
            explanation="Edit to refine the customer's objectives during the discovery and research phase."
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
            icon={<BookOpen className="h-5 w-5" />}
            tooltipContent="Questions and considerations running through the customer's mind."
            explanation="Edit to capture the customer's thought process during this phase."
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
            icon={<Activity className="h-5 w-5" />}
            tooltipContent="Specific steps the customer takes to gather information."
            explanation="Edit to list the actions customers typically take during their research."
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
            icon={<MessageCircle className="h-5 w-5" />}
            tooltipContent="Ways the customer interacts with your brand or product."
            explanation="Edit to identify all potential points of contact between the customer and your brand."
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
            icon={<MessageCircle className="h-5 w-5" />}
            tooltipContent="Customer's emotional state and general reaction."
            explanation="Edit to summarize the customer's overall response during this phase."
            onEdit={() => handleEdit('overallCustomerResponse')}
          >
            <dl className="space-y-2">
              <ListItem term="Emotions" description={cardData.overallCustomerResponse.emotions} />
            </dl>
          </ProfileCard>

          <ProfileCard 
            title="Pain Points" 
            icon={<Activity className="h-5 w-5" />}
            tooltipContent="Challenges and frustrations customers face during this phase."
            explanation="Edit to highlight the main pain points customers experience during discovery and research."
            onEdit={() => handleEdit('painPoints')}
          >
            <ul className="list-disc pl-5 space-y-2">
              {cardData.painPoints.map((painPoint, index) => (
                <li key={index}>{painPoint}</li>
              ))}
            </ul>
          </ProfileCard>

          <ProfileCard 
            title="Content Types" 
            icon={<FileText className="h-5 w-5" />}
            tooltipContent="Various formats of content that can address customer needs."
            explanation="Edit to outline the types of content that can be most effective during this phase."
            onEdit={() => handleEdit('contentTypes')}
          >
            <ul className="list-disc pl-5 space-y-2">
              {cardData.contentTypes.map((contentType, index) => (
                <li key={index}>{contentType}</li>
              ))}
            </ul>
          </ProfileCard>

          <ProfileCard 
            title="Metrics/Tracking" 
            icon={<BarChart className="h-5 w-5" />}
            tooltipContent="Key performance indicators to measure success in this phase."
            explanation="Edit to list the metrics and tracking methods to evaluate the effectiveness of your strategies."
            onEdit={() => handleEdit('metricsTracking')}
          >
            <ul className="list-disc pl-5 space-y-2">
              {cardData.metricsTracking.map((metric, index) => (
                <li key={index}>{metric}</li>
              ))}
            </ul>
          </ProfileCard>

          <ProfileCard 
            title="Success Indicators" 
            icon={<CheckCircle className="h-5 w-5" />}
            tooltipContent="Signs that indicate a positive customer experience."
            explanation="Edit to define the indicators of a successful discovery/research phase for the customer."
            onEdit={() => handleEdit('successIndicators')}
          >
            <ul className="list-disc pl-5 space-y-2">
              {cardData.successIndicators.map((indicator, index) => (
                <li key={index}>{indicator}</li>
              ))}
            </ul>
          </ProfileCard>

          <ProfileCard 
            title="Recommendations" 
            icon={<MessageCircle className="h-5 w-5" />}
            tooltipContent="Strategies to improve the customer's experience in this phase."
            explanation="Edit to suggest ways to enhance the customer's journey during discovery and research."
            onEdit={() => handleEdit('recommendations')}
          >
            <ul className="list-disc pl-5 space-y-2">
              {cardData.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </ProfileCard>
        </div>
      </Card>

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