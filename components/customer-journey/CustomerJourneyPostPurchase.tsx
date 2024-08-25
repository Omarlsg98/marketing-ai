"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  customerGoals: string[];
  customerThoughts: string[];
  customerActions: string[];
  touchpoints: string[];
  customerResponse: string[];
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

export default function CustomerJourneyPostPurchase() {
  const [cardData, setCardData] = useState<CardData>({
    customerGoals: [
      "Successfully set up and start using the product.",
      "Receive timely and effective support if issues arise.",
      "Understand how to get the most value from the product/service.",
      "Renew service or subscription if applicable."
    ],
    customerThoughts: [
      "How do I set this up correctly?",
      "Where can I get help if I need it?",
      "Is there an easy way to get my questions answered?",
      "How do I renew my subscription or service?"
    ],
    customerActions: [
      "Setting up the product using provided instructions.",
      "Accessing online resources or support (FAQs, tutorials).",
      "Contacting customer support via phone, email, or chat.",
      "Participating in online communities or forums.",
      "Renewing subscriptions or services when necessary."
    ],
    touchpoints: [
      "Onboarding emails and welcome messages.",
      "User manuals and setup guides.",
      "Customer support (phone, email, live chat).",
      "Knowledge base and FAQ sections.",
      "Tutorials and how-to videos.",
      "Online community and forums.",
      "Subscription renewal notifications."
    ],
    customerResponse: [
      "Initial satisfaction during setup",
      "Potential frustration if encountering issues",
      "Confidence and loyalty if support is effective",
      "Satisfaction if renewal process is smooth"
    ],
    painPoints: [
      "Difficulty or confusion during product setup.",
      "Delays or inefficiencies in customer support responses.",
      "Incomplete or hard-to-understand user manuals.",
      "Difficulty in finding solutions to common issues.",
      "Complexity in renewing subscriptions."
    ],
    contentTypes: [
      "Onboarding Emails: Step-by-step setup instructions and resources.",
      "User Manuals: Comprehensive guides on product usage.",
      "FAQ Sections: Answers to common questions and problems.",
      "Tutorial Videos: Visual guides for setup and troubleshooting.",
      "Support Articles: Detailed articles covering various aspects of product usage.",
      "Community Forums: Platforms for users to ask questions and share tips."
    ],
    metricsTracking: [
      "Monitor customer support ticket volumes and resolution times.",
      "Track the usage of online help resources and guides.",
      "Measure customer satisfaction through surveys and feedback forms.",
      "Analyze renewal rates for subscription services.",
      "Monitor engagement levels in online communities and forums."
    ],
    successIndicators: [
      "High satisfaction scores from customer surveys.",
      "Low support ticket resolution times.",
      "High engagement and usage rates of help resources.",
      "Stable or growing renewal rates.",
      "Positive sentiment in user feedback and community interactions."
    ],
    recommendations: [
      "Provide Clear User Manuals: Ensure that user manuals are comprehensive, easy to follow, and accessible in multiple formats (PDF, online).",
      "Enhance Customer Support: Offer multiple channels for support (phone, email, chat) with quick response times. Make sure support staff are well-trained and empathetic.",
      "Create Effective Onboarding: Send onboarding emails with clear instructions, setup videos, and links to resources. Follow up to check on progress and offer additional help.",
      "Build a Robust Knowledge Base: Develop a comprehensive online knowledge base with FAQs, support articles, and tutorials. Keep it updated based on common customer queries.",
      "Foster an Online Community: Encourage the creation of an online community or forum where users can share their experiences, ask questions, and help each other.",
      "Implement a Smooth Renewal Process: Make renewing subscriptions easy and transparent. Provide reminders before the expiration date and offer incentives for renewal.",
      "Gather Continuous Feedback: Regularly ask for customer feedback on their post-purchase experience to identify pain points and areas for improvement.",
      "Offer Loyalty Programs: Introduce loyalty programs or incentives for returning customers to build long-term relationships."
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

  const handleInputChange = useCallback((key: string, index: number, value: string) => {
    setEditingData((prevData: any) => {
      return prevData.map((item: string, i: number) => i === index ? value : item);
    });
  }, []);

  const handleAddArrayItem = useCallback(() => {
    setEditingData((prevData: any) => [...prevData, '']);
  }, []);

  const handleRemoveArrayItem = useCallback((index: number) => {
    setEditingData((prevData: any) => prevData.filter((_: any, i: number) => i !== index));
  }, []);

  const renderEditFields = () => {
    if (!editingCard || !editingData) return null;

    const explanations = {
      customerGoals: "Define the customer's objectives during the Implementation and Support/Renewal phases.",
      customerThoughts: "Capture the questions and considerations in the customer's mind post-purchase.",
      customerActions: "List the actions customers take after purchasing the product or service.",
      touchpoints: "Identify the various points of contact between the customer and your brand post-purchase.",
      customerResponse: "Describe the overall emotional response of customers during these phases.",
      painPoints: "Identify common challenges or frustrations customers face post-purchase.",
      contentTypes: "List the types of content provided to support customers post-purchase.",
      metricsTracking: "Define the metrics used to measure success in these phases.",
      successIndicators: "List the key indicators that show success in the post-purchase journey.",
      recommendations: "Suggest strategies to improve the customer's experience post-purchase."
    };

    return (
      <>
        <p className="text-sm text-muted-foreground mb-6">
          {explanations[editingCard as keyof typeof explanations]}
        </p>
        <div className="space-y-4">
          {editingData.map((item: string, index: number) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Input
                  value={item}
                  onChange={(e) => handleInputChange('', index, e.target.value)}
                  className="flex-grow transition-shadow duration-200 hover:shadow-md focus:shadow-md"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleRemoveArrayItem(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button 
            onClick={handleAddArrayItem} 
            variant="outline" 
            className="flex items-center space-x-2 mt-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add more</span>
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard 
          title="Customer Goals" 
          icon={<Target className="h-5 w-5" />}
          tooltipContent="Objectives customers aim to achieve post-purchase."
          explanation="Edit to refine the goals customers typically have after making a purchase."
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
          tooltipContent="Questions and considerations in the customer's mind post-purchase."
          explanation="Edit to update the typical thoughts and questions customers have after making a purchase."
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
          tooltipContent="Actions taken by customers post-purchase."
          explanation="Edit to update the list of actions customers typically take after purchasing."
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
          tooltipContent="Points of contact between the customer and your brand post-purchase."
          explanation="Edit to refine the list of touchpoints where customers interact with your brand after purchasing."
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
          tooltipContent="Emotional response of customers post-purchase."
          explanation="Edit to update the typical emotional responses customers experience after purchasing."
          onEdit={() => handleEdit('customerResponse')}
        >
          <ul className="list-disc pl-5 space-y-2">
            {cardData.customerResponse.map((response, index) => (
              <li key={index}>{response}</li>
            ))}
          </ul>
        </ProfileCard>

        <ProfileCard 
          title="Pain Points" 
          icon={<ShoppingCart className="h-5 w-5" />}
          tooltipContent="Common challenges or frustrations customers face post-purchase."
          explanation="Edit to update the list of pain points customers typically experience after purchasing."
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
          icon={<BookOpen className="h-5 w-5" />}
          tooltipContent="Types of content provided to support customers post-purchase."
          explanation="Edit to refine the list of content types offered to customers after purchase."
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
          icon={<Target className="h-5 w-5" />}
          tooltipContent="Metrics used to measure success in post-purchase phases."
          explanation="Edit to update the list of metrics tracked to measure post-purchase success."
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
          icon={<Target className="h-5 w-5" />}
          tooltipContent="Key indicators that show success in the post-purchase journey."
          explanation="Edit to refine the list of indicators that demonstrate post-purchase success."
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
          icon={<BookOpen className="h-5 w-5" />}
          tooltipContent="Strategies to improve customer experience post-purchase."
          explanation="Edit to refine recommendations for enhancing the customer's post-purchase experience."
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