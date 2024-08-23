'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const questions = [
  {
    id: 'industry',
    question: "What industry does your customer's company belong to?",
    type: 'select',
    options: ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing', 'Other'],
    explanation: "This refers to the main sector or field in which the customer's company operates. For example, if they develop software, it's likely Technology; if they run hospitals, it's Healthcare."
  },
  {
    id: 'jobTitle',
    question: "What is your customer's job title?",
    type: 'text',
    explanation: "This is the official name of their position within the company, often found on their business card or email signature."
  },
  {
    id: 'professionalBackground',
    question: "Can your customer briefly describe their professional background?",
    type: 'textarea',
    explanation: "This could include their career path, previous roles, industries they've worked in, or any significant professional experiences."
  }
]

type Message = {
  type: 'ai' | 'user';
  content: string;
};

type Recommendation = string;

export default function Component() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conversation, setConversation] = useState<Message[]>([]); // Use the Message type
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isIdkDisabled, setIsIdkDisabled] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiRecommendations, setAiRecommendations] = useState<Recommendation[]>([]); // Use the Recommendation type
  const scrollAreaRef = useRef<HTMLDivElement>(null);


  const router = useRouter();


  useEffect(() => {
    addAiMessage(questions[0].question)
  }, [])

  useEffect(() => {
    const startChat = async () => {
      const newChat = await fetch('/api/chat/create', {
        method: 'POST',
        body: JSON.stringify({ title: 'New Persona', description: 'New persona chat', category: 'Persona B2B' })
      });

      const chatData = await newChat.json();
      console.log(chatData);

      const chatId = chatData.output.id;


      await fetch(`/api/chat/${chatId}/send`, {
        method: 'POST',
        body: JSON.stringify({ message: "Hello! can you help me build my customer persona?" })
      });
      
      //redirect to chat page
      router.push(`/my/personas/chat/${chatId}`);
    }
    startChat();
    
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [conversation, isAiTyping])

  useEffect(() => {
    setProgress((currentQuestionIndex / questions.length) * 100)
    setIsIdkDisabled(false)
    setSelectedOption('')
    setUserInput('')
    generateAiRecommendations()
  }, [currentQuestionIndex])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  const addAiMessage = (message: string) => {
    setIsAiTyping(true)
    setTimeout(() => {
      setConversation(prev => [...prev, { type: 'ai', content: message }])
      setIsAiTyping(false)
    }, 1000)
  }

  const handleUserInput = (input: string) => {
    if (input === "I don't know") {
      const currentQuestion = questions[currentQuestionIndex]
      addAiMessage(`No problem. Let me explain further: ${currentQuestion.explanation}`)
      setIsIdkDisabled(true)
      return
    }

    setConversation(prev => [...prev, { type: 'user', content: input }])
    setAnswers(prev => ({ ...prev, [questions[currentQuestionIndex].id]: input }))
    setUserInput('')
    setSelectedOption('')

    setCurrentQuestionIndex(prev => prev + 1)
    if (currentQuestionIndex < questions.length - 1) {
      addAiMessage(questions[currentQuestionIndex + 1].question)
    } else {
      addAiMessage("Thanks for all that info! Your responses have been saved.")
    }
  }

  const generateAiRecommendations = async () => {
    setIsAiTyping(true)
    // In a real application, this would be an API call to an AI service
    // For this example, we'll simulate an API call with setTimeout
    setTimeout(() => {
      const currentQuestion = questions[currentQuestionIndex]
      let recommendations: string | any[] | ((prevState: never[]) => never[]) = []

      if (currentQuestion.id === 'industry') {
        recommendations = ['Technology', 'Healthcare', 'Finance', 'Education', 'Retail', 'Manufacturing']
      } else if (currentQuestion.id === 'jobTitle') {
        const industry = answers.industry
        if (industry === 'Technology') {
          recommendations = ['Software Engineer', 'Product Manager', 'Data Scientist', 'CTO']
        } else if (industry === 'Healthcare') {
          recommendations = ['Nurse Practitioner', 'Medical Director', 'Healthcare Administrator', 'Physician']
        } else if (industry === 'Finance') {
          recommendations = ['Financial Analyst', 'Investment Banker', 'Accountant', 'CFO']
        } else if (industry === 'Education') {
          recommendations = ['Teacher', 'Principal', 'Professor', 'Education Consultant']
        } else if (industry === 'Retail') {
          recommendations = ['Store Manager', 'Merchandiser', 'Buyer', 'E-commerce Manager']
        } else if (industry === 'Manufacturing') {
          recommendations = ['Production Manager', 'Quality Control Specialist', 'Supply Chain Manager', 'Industrial Engineer']
        } else {
          recommendations = ['Manager', 'Director', 'Specialist', 'Consultant']
        }
      } else if (currentQuestion.id === 'professionalBackground') {
        const industry = answers.industry
        const jobTitle = answers.jobTitle?.toLowerCase() || ''
        if (industry === 'Technology') {
          if (jobTitle.includes('engineer')) {
            recommendations = [
              '5+ years developing web applications',
              'Expertise in React and Node.js',
              'Led team of 5 developers on major project',
              'Contributed to open-source projects'
            ]
          } else if (jobTitle.includes('manager')) {
            recommendations = [
              '7+ years in product management',
              'Launched 3 successful SaaS products',
              'Experienced in Agile methodologies',
              'Strong background in user research and data analysis'
            ]
          }
        } else if (industry === 'Healthcare') {
          if (jobTitle.includes('nurse')) {
            recommendations = [
              '10+ years experience in critical care',
              'Specialized in pediatric nursing',
              'Led implementation of new patient care system',
              'Active member of Nurses Association'
            ]
          } else if (jobTitle.includes('director')) {
            recommendations = [
              '15+ years in healthcare administration',
              'Oversaw operations of 200-bed hospital',
              'Implemented cost-saving measures, reducing expenses by 15%',
              'Expertise in healthcare policy and regulations'
            ]
          }
        }
      }

      if (recommendations.length === 0) {
        recommendations = ['Experienced professional', 'Industry expert', 'Skilled practitioner', 'Innovative leader']
      }

      setAiRecommendations(recommendations)
      setIsAiTyping(false)
    }, 1000)
  }

  const renderInputField = () => {
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return null

    const isSubmitDisabled = !userInput && currentQuestion.type !== 'select'

    const renderSuggestions = () => {
      if (aiRecommendations.length > 0) {
        return (
          <div className="flex flex-wrap gap-2 mb-4">
            {aiRecommendations.map((rec) => (
              <Button key={rec} variant="outline" size="sm" onClick={() => setUserInput(rec)}>{rec}</Button>
            ))}
          </div>
        )
      }
      return null
    }

    const renderInputAndButtons = () => (
      <div className="flex flex-col space-y-4">
        {currentQuestion.type === 'textarea' ? (
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer here"
            className="min-h-[100px]"
          />
        ) : currentQuestion.type === 'text' ? (
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer here"
          />
        ) : null}
        <div className="flex justify-between">
          <Button onClick={() => handleUserInput(userInput)} disabled={isSubmitDisabled}>
            <Send className="w-4 h-4 mr-2" />
            Submit
          </Button>
          <Button
            variant="outline"
            onClick={() => handleUserInput("I don't know")}
            disabled={isIdkDisabled}
          >
            {"I don't know"}
          </Button>
        </div>
      </div>
    )

    switch (currentQuestion.type) {
      case 'text':
      case 'textarea':
        return (
          <div className="flex flex-col">
            {renderSuggestions()}
            {renderInputAndButtons()}
          </div>
        )
      case 'select':
        return (
          <div className="flex flex-col space-y-4">
            <Select onValueChange={(value) => setSelectedOption(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion?.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedOption === 'Other' && (
              <>
                {renderSuggestions()}
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Please specify"
                />
              </>
            )}
            <div className="flex justify-between">
              <Button
                onClick={() => handleUserInput(selectedOption === 'Other' ? userInput : selectedOption)}
                disabled={!selectedOption || (selectedOption === 'Other' && !userInput)}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUserInput("I don't know")}
                disabled={isIdkDisabled}
              >
                {"I don't know"}
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background to-muted">
      <div className="flex flex-1 overflow-hidden">

        <main className="flex-1 overflow-hidden flex flex-col">
          <Card className="flex-grow overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold">Create New Persona</CardTitle>
              <Progress value={progress} className="w-full h-2" />
            </CardHeader>
            <CardContent className="h-[calc(100%-4rem)] overflow-hidden">
              <ScrollArea className="h-full pr-4 pl-4" ref={scrollAreaRef}>
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-3 rounded-lg ${message.type === 'ai'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    <strong>{message.type === 'ai' ? 'AI: ' : 'You: '}</strong>
                    {message.content}
                  </div>
                ))}
                {isAiTyping && (
                  <div className="text-primary animate-pulse">
                    AI is typing<span className="dot-1">.</span><span className="dot-2">.</span><span className="dot-3">.</span>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          <div className="mt-4 bg-card p-4 rounded-lg shadow-sm">
            {currentQuestionIndex < questions.length ? renderInputField() : null}
          </div>
        </main>
      </div>
    </div>
  )
}