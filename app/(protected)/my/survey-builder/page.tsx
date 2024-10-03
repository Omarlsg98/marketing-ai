"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, Save } from "lucide-react"
import { ChangeEvent, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import CustomizeSurveyThemeModal from "@/components/customer/survey/CustomizeSurveyThemeModal"
import QuestionCard from "@/components/customer/survey/QuestionCard"
import SurveyPreview from "@/components/customer/survey/SurveyPreview"

const premadeThemes = [
  {
    name: "Default",
    background: "#ffffff",
    text: "#000000",
    primary: "#3b82f6",
  },
  { name: "Dark", background: "#1f2937", text: "#ffffff", primary: "#60a5fa" },
  {
    name: "Nature",
    background: "#f0fdf4",
    text: "#166534",
    primary: "#22c55e",
  },
  {
    name: "Sunset",
    background: "#fff7ed",
    text: "#9a3412",
    primary: "#f97316",
  },
  { name: "Ocean", background: "#ecfeff", text: "#164e63", primary: "#06b6d4" },
]

interface Question {
  id: number
  type: string
  question: string
  options: string[]
  layout: string
  mandatory: boolean
  ratingScale: { min: number; max: number; type: string }
  maxChoices: number | null
  includeOther: boolean
}

interface Answer {
  [key: number]: string | number | boolean | string[]
}

interface OtherValues {
  [key: number]: string
}

export default function SurveyBuilder() {
  const { theme: currentTheme, setTheme: setSystemTheme } = useTheme()
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "text",
      question: "What's your name?",
      mandatory: false,
      options: [],
      layout: "vertical",
      ratingScale: { min: 1, max: 5, type: "number" },
      maxChoices: null,
      includeOther: false,
    },
    {
      id: 2,
      type: "email",
      question: "What's your email address?",
      mandatory: true,
      options: [],
      layout: "vertical",
      ratingScale: { min: 1, max: 5, type: "number" },
      maxChoices: null,
      includeOther: false,
    },
  ])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [theme, setTheme] = useState(premadeThemes[0])
  const [logo, setLogo] = useState<string | null>(null)
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [radioStyle, setRadioStyle] = useState("square")
  const [answers, setAnswers] = useState<Answer>({})
  const [otherValues, setOtherValues] = useState<OtherValues>({})
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type: "text",
      question: "New Question",
      options: [],
      layout: "vertical",
      mandatory: false,
      ratingScale: { min: 1, max: 5, type: "number" },
      maxChoices: null,
      includeOther: false,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (
    id: number,
    field: string,
    value:
      | string
      | { min: number; max: number; type: string }
      | string[]
      | boolean
      | number
      | null
  ) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id ? { ...q, [field]: value } : q
    )
    setQuestions(updatedQuestions)
  }

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((q) => q.id !== id)
      setQuestions(updatedQuestions)
      if (currentQuestion >= updatedQuestions.length) {
        setCurrentQuestion(updatedQuestions.length - 1)
      }
    } else {
      toast({
        title: "Cannot remove last question",
        description: "You must have at least one question in the survey.",
        variant: "destructive",
      })
    }
  }

  const addOption = (questionId: number) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            options: [
              ...(q.options || []),
              `Option ${(q.options || []).length + 1}`,
            ],
          }
        : q
    )
    setQuestions(updatedQuestions)
  }

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            options: (q.options || []).map((opt, index) =>
              index === optionIndex ? value : opt
            ),
          }
        : q
    )
    setQuestions(updatedQuestions)
  }

  const removeOption = (questionId: number, optionIndex: number) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            options: (q.options || []).filter(
              (_, index) => index !== optionIndex
            ),
          }
        : q
    )
    setQuestions(updatedQuestions)
  }

  const updateRatingScale = (id: number, field: string, value: string) => {
    const updatedQuestions = questions.map((q) =>
      q.id === id && q.ratingScale != null
        ? { ...q, ratingScale: { ...q.ratingScale, [field]: value } }
        : q
    )
    setQuestions(updatedQuestions)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) =>
        setLogo(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) =>
        setBackgroundImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAnswerChange = (
    questionId: number,
    value: string | number | boolean | string[]
  ) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleOtherChange = (questionId: number, value: string) => {
    setOtherValues((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSave = () => {
    const surveyData = {
      questions,
      theme,
      logo,
      backgroundImage,
      radioStyle,
    }
    console.log("Saving survey:", surveyData)
    toast({
      title: "Survey Saved",
      description: "Your survey has been saved successfully.",
    })
  }

  useEffect(() => {
    setAnswers({})
    setOtherValues({})
  }, [questions])

  useEffect(() => {
    if (currentTheme === 'dark') {
      setTheme(premadeThemes[1]) // Dark theme
    } else {
      setTheme(premadeThemes[0]) // Light theme
    }
  }, [currentTheme])

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Survey Builder */}
      <div className="w-full md:w-1/2 p-6 bg-background text-foreground overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Survey Builder</h2>
        <Separator className="mb-4" />
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => setIsCustomizeModalOpen(true)}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Customize Theme
        </Button>
        <CustomizeSurveyThemeModal
          theme={theme}
          setTheme={setTheme}
          handleLogoUpload={handleLogoUpload}
          handleBackgroundUpload={handleBackgroundUpload}
          radioStyle={radioStyle}
          setRadioStyle={setRadioStyle}
          premadeThemes={premadeThemes}
          isOpen={isCustomizeModalOpen}
          onClose={() => setIsCustomizeModalOpen(false)}
        />
        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={index}
            updateQuestion={updateQuestion}
            removeQuestion={removeQuestion}
            addOption={addOption}
            updateOption={updateOption}
            removeOption={removeOption}
            updateRatingScale={updateRatingScale}
          />
        ))}
        <div className="flex space-x-4">
          <Button onClick={addQuestion} className="flex-1" variant="ghost">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Question
          </Button>
          <Button onClick={handleSave} className="flex-1" variant="default">
            <Save className="mr-2 h-4 w-4" /> Save Survey
          </Button>
        </div>
      </div>

      {/* Survey Preview */}
      <SurveyPreview
        questions={questions}
        currentQuestion={currentQuestion}
        theme={theme}
        logo={logo}
        backgroundImage={backgroundImage}
        radioStyle={radioStyle}
        answers={answers}
        otherValues={otherValues}
        handleAnswerChange={handleAnswerChange}
        handleOtherChange={handleOtherChange}
        handleNext={handleNext}
        handlePrevious={handlePrevious}
      />
    </div>
  )
}