import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Star } from "lucide-react"

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

interface Theme {
  background: string
  text: string
  primary: string
}

interface SurveyPreviewProps {
  questions: Question[]
  currentQuestion: number
  theme: Theme
  logo: string | null
  backgroundImage: string | null
  radioStyle: string
  answers: Answer
  otherValues: OtherValues
  handleAnswerChange: (questionId: number, value: string | number | boolean | string[]) => void
  handleOtherChange: (questionId: number, value: string) => void
  handleNext: () => void
  handlePrevious: () => void
}

export default function SurveyPreview({
  questions,
  currentQuestion,
  theme,
  logo,
  backgroundImage,
  radioStyle,
  answers,
  otherValues,
  handleAnswerChange,
  handleOtherChange,
  handleNext,
  handlePrevious,
}: SurveyPreviewProps) {
  return (
    <div
      className="w-full md:w-1/2 p-6 overflow-y-auto"
      style={{
        backgroundColor: theme.background,
        color: theme.text,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-md mx-auto">
        {logo ? (
          <img
            src={logo}
            alt="Survey Logo"
            className="mb-4 w-24 h-24 rounded-full object-cover mx-auto"
          />
        ) : (
          <div className="mb-4 w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
            <PlusCircle className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2">Survey Preview</h2>
        <Separator className="mb-4" />
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm opacity-70">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                backgroundColor: theme.primary,
              }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <Label htmlFor="preview-question" className="text-lg font-semibold">
            {questions[currentQuestion].question}
            {questions[currentQuestion].mandatory && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          {questions[currentQuestion].type === "text" && (
            <Input
              id="preview-question"
              placeholder="Enter your answer"
              required={questions[currentQuestion].mandatory}
            />
          )}
          {questions[currentQuestion].type === "email" && (
            <Input
              id="preview-question"
              type="email"
              placeholder="Enter your email"
              required={questions[currentQuestion].mandatory}
            />
          )}
          {questions[currentQuestion].type === "textarea" && (
            <Textarea
              id="preview-question"
              placeholder="Enter your answer"
              required={questions[currentQuestion].mandatory}
            />
          )}
          {questions[currentQuestion].type === "radio" && (
            <RadioGroup
              value={(answers[questions[currentQuestion].id] as string) || ""}
              onValueChange={(value) =>
                handleAnswerChange(questions[currentQuestion].id, value)
              }
            >
              {questions[currentQuestion].layout === "vertical" && (
                <div className="space-y-2">
                  {(questions[currentQuestion].options || []).map(
                    (option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`radio-${index}`}
                          className={
                            radioStyle === "circle" ? "rounded-full" : ""
                          }
                        />
                        <Label htmlFor={`radio-${index}`}>{option}</Label>
                      </div>
                    )
                  )}
                  {questions[currentQuestion].includeOther && (
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="other"
                        id="radio-other"
                        className={
                          radioStyle === "circle" ? "rounded-full" : ""
                        }
                      />
                      <Label htmlFor="radio-other">Other</Label>
                      <Input
                        placeholder="Please specify"
                        value={
                          otherValues[questions[currentQuestion].id] || ""
                        }
                        onChange={(e) =>
                          handleOtherChange(
                            questions[currentQuestion].id,
                            e.target.value
                          )
                        }
                        disabled={
                          answers[questions[currentQuestion].id] !== "other"
                        }
                      />
                    </div>
                  )}
                </div>
              )}
              {questions[currentQuestion].layout === "horizontal" && (
                <div className="flex space-x-4">
                  {(questions[currentQuestion].options || []).map(
                    (option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3"
                      >
                        <RadioGroupItem
                          value={option}
                          id={`radio-${index}`}
                          className={
                            radioStyle === "circle" ? "rounded-full" : ""
                          }
                        />
                        <Label htmlFor={`radio-${index}`}>{option}</Label>
                      </div>
                    )
                  )}
                  {questions[currentQuestion].includeOther && (
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem
                        value="other"
                        id="radio-other"
                        className={
                          radioStyle === "circle" ? "rounded-full" : ""
                        }
                      />
                      <Label htmlFor="radio-other">Other</Label>
                      <Input
                        placeholder="Please specify"
                        value={
                          otherValues[questions[currentQuestion].id] || ""
                        }
                        onChange={(e) =>
                          handleOtherChange(
                            questions[currentQuestion].id,
                            e.target.value
                          )
                        }
                        disabled={
                          answers[questions[currentQuestion].id] !== "other"
                        }
                      />
                    </div>
                  )}
                </div>
              )}
              {questions[currentQuestion].layout === "grid" && (
                <div className="grid grid-cols-2 gap-4">
                  {(questions[currentQuestion].options || []).map(
                    (option, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-center space-x-3 p-4">
                          <RadioGroupItem
                            value={option}
                            id={`radio-${index}`}
                            className={
                              radioStyle === "circle" ? "rounded-full" : ""
                            }
                          />
                          <Label htmlFor={`radio-${index}`}>{option}</Label>
                        </CardContent>
                      </Card>
                    )
                  )}
                  {questions[currentQuestion].includeOther && (
                    <Card>
                      <CardContent className="flex items-center space-x-3 p-4">
                        <RadioGroupItem
                          value="other"
                          id="radio-other"
                          className={
                            radioStyle === "circle" ? "rounded-full" : ""
                          }
                        />
                        <Label htmlFor="radio-other">Other</Label>
                        <Input
                          placeholder="Please specify"
                          value={
                            otherValues[questions[currentQuestion].id] || ""
                          }
                          onChange={(e) =>
                            handleOtherChange(
                              questions[currentQuestion].id,
                              e.target.value
                            )
                          }
                          disabled={
                            answers[questions[currentQuestion].id] !== "other"
                          }
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              {questions[currentQuestion].layout === "large-grid" && (
                <div className="grid grid-cols-1 gap-4">
                  {(questions[currentQuestion].options || []).map(
                    (option, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-center space-x-3 p-4">
                          <RadioGroupItem
                            value={option}
                            id={`radio-${index}`}
                            className={
                              radioStyle === "circle" ? "rounded-full" : ""
                            }
                          />
                          <Label htmlFor={`radio-${index}`}>{option}</Label>
                        </CardContent>
                      </Card>
                    )
                  )}
                  {questions[currentQuestion].includeOther && (
                    <Card>
                      <CardContent className="flex items-center space-x-3 p-4">
                        <RadioGroupItem
                          value="other"
                          id="radio-other"
                          className={
                            radioStyle === "circle" ? "rounded-full" : ""
                          }
                        />
                        <Label htmlFor="radio-other">Other</Label>
                        <Input
                          placeholder="Please specify"
                          value={
                            otherValues[questions[currentQuestion].id] || ""
                          }
                          onChange={(e) =>
                            handleOtherChange(
                              questions[currentQuestion].id,
                              e.target.value
                            )
                          }
                          disabled={
                            answers[questions[currentQuestion].id] !== "other"
                          }
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
              {questions[currentQuestion].layout === "dropdown" && (
                <Select
                  value={
                    (answers[questions[currentQuestion].id] as string) || ""
                  }
                  onValueChange={(value) =>
                    handleAnswerChange(questions[currentQuestion].id, value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {(questions[currentQuestion].options || []).map(
                      (option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      )
                    )}
                    {questions[currentQuestion].includeOther && (
                      <SelectItem value="other">Other</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            </RadioGroup>
          )}
          {questions[currentQuestion].type === "checkbox" && (
            <div className="space-y-2">
              {(questions[currentQuestion].options || []).map(
                (option, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox
                      id={`checkbox-${index}`}
                      checked={
                        (
                          (answers[
                            questions[currentQuestion].id
                          ] as string[]) || []
                        ).includes(option)
                      }
                      onCheckedChange={(checked) => {
                        const currentAnswers =
                          (answers[
                            questions[currentQuestion].id
                          ] as string[]) || []
                        const updatedAnswers = checked
                          ? [...currentAnswers, option]
                          : currentAnswers.filter((a) => a !== option)
                        handleAnswerChange(
                          questions[currentQuestion].id,
                          updatedAnswers
                        )
                      }}
                    />
                    <Label htmlFor={`checkbox-${index}`}>{option}</Label>
                  </div>
                )
              )}
              {questions[currentQuestion].includeOther && (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="checkbox-other"
                    checked={
                      (
                        (answers[
                          questions[currentQuestion].id
                        ] as string[]) || []
                      ).includes("other")
                    }
                    onCheckedChange={(checked) => {
                      const currentAnswers =
                        (answers[
                          questions[currentQuestion].id
                        ] as string[]) || []
                      const updatedAnswers = checked
                        ? [...currentAnswers, "other"]
                        : currentAnswers.filter((a) => a !== "other")
                      handleAnswerChange(
                        questions[currentQuestion].id,
                        updatedAnswers
                      )
                    }}
                  />
                  <Label htmlFor="checkbox-other">Other</Label>
                  <Input
                    placeholder="Please specify"
                    value={otherValues[questions[currentQuestion].id] || ""}
                    onChange={(e) =>
                      handleOtherChange(
                        questions[currentQuestion].id,
                        e.target.value
                      )
                    }
                    disabled={
                      !(
                        (answers[
                          questions[currentQuestion].id
                        ] as string[]) || []
                      ).includes("other")
                    }
                  />
                </div>
              )}
            </div>
          )}
          {questions[currentQuestion].type === "select" && (
            <Select
              value={
                (answers[questions[currentQuestion].id] as string) || ""
              }
              onValueChange={(value) =>
                handleAnswerChange(questions[currentQuestion].id, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {(questions[currentQuestion].options || []).map(
                  (option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  )
                )}
                {questions[currentQuestion].includeOther && (
                  <SelectItem value="other">Other</SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
          {questions[currentQuestion].type === "rating" && (
            <div className="space-y-2">
              {questions[currentQuestion].ratingScale?.type === "star" ? (
                <div className="flex space-x-1">
                  {Array.from(
                    {
                      length:
                        (questions[currentQuestion].ratingScale?.max || 5) -
                        (questions[currentQuestion].ratingScale?.min || 1) +
                        1,
                    },
                    (_, i) =>
                      i + (questions[currentQuestion].ratingScale?.min || 1)
                  ).map((value) => (
                    <Button
                      key={value}
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleAnswerChange(
                          questions[currentQuestion].id,
                          value
                        )
                      }
                    >
                      <Star
                        className={`h-6 w-6 ${
                          (answers[questions[currentQuestion].id] as number) >=
                          value
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </Button>
                  ))}
                </div>
              ) : (
                <Slider
                  min={questions[currentQuestion].ratingScale?.min || 1}
                  max={questions[currentQuestion].ratingScale?.max || 5}
                  step={1}
                  value={[
                    (answers[questions[currentQuestion].id] as number) ||
                      (questions[currentQuestion].ratingScale?.min || 1),
                  ]}
                  onValueChange={(value) =>
                    handleAnswerChange(questions[currentQuestion].id, value[0])
                  }
                />
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{questions[currentQuestion].ratingScale?.min || 1}</span>
                <span>{questions[currentQuestion].ratingScale?.max || 5}</span>
              </div>
            </div>
          )}
          {questions[currentQuestion].type === "boolean" && (
            <RadioGroup
              value={
                (answers[questions[currentQuestion].id] as string) || ""
              }
              onValueChange={(value) =>
                handleAnswerChange(questions[currentQuestion].id, value)
              }
            >
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </div>
            </RadioGroup>
          )}
        </div>
        <div className="flex justify-between mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentQuestion === questions.length - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}