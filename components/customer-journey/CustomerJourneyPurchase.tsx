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

ListItem.displayName = 'ListItem'

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

ProfileCard.displayName = 'ProfileCard'

export default function CustomerJourneyPurchase( personaInformation: {
  personaInformation: PersonaInformation['v1'] 
}) {
  const [cardData, setCardData] = useState<CardData>({
    customerGoals: [
      "Make a confident purchase decision.",
      "Ensure a secure transaction.",
      "Confirm that after-sales support will be available."
    ],
    customerThoughts: [
      "Is this the right product for me?",
      "Is my payment information secure?",
      "Will I receive my product on time?",
      "What if I need help after the purchase?"
    ],
    customerActions: [
      "Adding items to the cart.",
      "Proceeding to checkout.",
      "Filling in payment and shipping information.",
      "Applying discount codes or promotional offers.",
      "Completing the payment process.",
      "Reviewing order confirmation details."
    ],
    touchpoints: [
      "Checkout process on the website or app.",
      "Payment options (credit card, PayPal, etc.).",
      "Customer support (live chat, phone assistance).",
      "Confirmation emails and notifications.",
      "Assurance messages (e.g., trust badges, secure transaction indicators)."
    ],
    customerResponse: [
      "Anticipation",
      "Anxiety about making the right choice",
      "Relief and satisfaction upon completing the purchase"
    ],
    recommendations: [
      "Streamline Checkout Process: Simplify the steps required to complete a purchase, allowing guest checkouts, and providing a clear progress indicator.",
      "Offer Multiple Payment Methods: Ensure a variety of secure payment options to cater to different customer preferences.",
      "Display Trust Signals: Use trust badges, secure transaction messages, and customer testimonials prominently.",
      "Enhance Customer Support: Offer live chat support during checkout, provide a clear, easy-to-navigate help section, and ensure quick response times.",
      "Send Confirmation Emails: Immediately send detailed order confirmation emails with transaction details and expected delivery information.",
      "Implement Cart Recovery Strategies: Use abandoned cart emails and special offers to encourage customers to complete their purchases.",
      "Optimize for Mobile: Ensure the checkout process is fully optimized for mobile devices to cater to all users.",
      "Test and Iterate: Regularly test the checkout process for usability issues and make iterative improvements based on user feedback and behavior analytics."
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
      customerGoals: "Define the customer's objectives during the Decision/Purchase phase.",
      customerThoughts: "Capture the questions and considerations in the customer's mind during purchase.",
      customerActions: "List the actions customers take to complete their purchase.",
      touchpoints: "Identify the various points of contact between the customer and your brand during checkout.",
      customerResponse: "Describe the overall emotional response of customers during the purchase phase.",
      recommendations: "Suggest strategies to improve the customer's experience in the Decision/Purchase phase."
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
          tooltipContent="Objectives customers aim to achieve during the Decision/Purchase phase."
          explanation="Edit to refine the goals customers typically have when making a purchase decision."
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
          tooltipContent="Questions and considerations in the customer's mind during purchase."
          explanation="Edit to update the typical thoughts and questions customers have while making a purchase."
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
          tooltipContent="Actions taken by customers to complete their purchase."
          explanation="Edit to update the list of actions customers typically take during the purchase process."
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
          tooltipContent="Points of contact between the customer and your brand during checkout."
          explanation="Edit to refine the list of touchpoints where customers interact with your brand during the purchase process."
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
          tooltipContent="Emotional response of customers during the Decision/Purchase phase."
          explanation="Edit to update the typical emotional responses customers experience during the purchase process."
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
          tooltipContent="Strategies to improve customer experience during the Decision/Purchase phase."
          explanation="Edit to refine recommendations for enhancing the customer's purchase experience."
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