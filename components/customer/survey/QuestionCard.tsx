import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Minus, Plus, Trash2 } from "lucide-react"

interface QuestionCardProps {
  question: {
    id: number
    type: string
    question: string
    options?: string[]
    layout?: string
    mandatory: boolean
    ratingScale?: { min: number; max: number; type: string }
    maxChoices?: number | null
    includeOther?: boolean
  }
  index: number
  updateQuestion: (
    id: number,
    field: string,
    value: string | { min: number; max: number; type: string } | string[] | boolean | number | null
  ) => void
  removeQuestion: (id: number) => void
  addOption: (questionId: number) => void
  updateOption: (questionId: number, optionIndex: number, value: string) => void
  removeOption: (questionId: number, optionIndex: number) => void
  updateRatingScale: (id: number, field: string, value: string) => void
}

export default function QuestionCard({
  question,
  index,
  updateQuestion,
  removeQuestion,
  addOption,
  updateOption,
  removeOption,
  updateRatingScale,
}: QuestionCardProps) {
  return (
    <Card className="mb-4 p-4 bg-muted rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Question {index + 1}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeQuestion(question.id)}
          aria-label="Remove question"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`question-${question.id}`}>Question</Label>
        <Input
          id={`question-${question.id}`}
          value={question.question}
          onChange={(e) =>
            updateQuestion(question.id, "question", e.target.value)
          }
        />
        <Label htmlFor={`type-${question.id}`}>Type</Label>
        <Select
          value={question.type}
          onValueChange={(value) => {
            updateQuestion(question.id, "type", value)
            if (
              ["radio", "checkbox", "select"].includes(value) &&
              !question.options
            ) {
              updateQuestion(question.id, "options", [])
            }
            if (value === "rating" && !question.ratingScale) {
              updateQuestion(question.id, "ratingScale", {
                min: 1,
                max: 5,
                type: "number",
              })
            }
          }}
        >
          <SelectTrigger id={`type-${question.id}`}>
            <SelectValue placeholder="Select question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="textarea">Textarea</SelectItem>
            <SelectItem value="radio">
              Multiple Choice (Single Answer)
            </SelectItem>
            <SelectItem value="checkbox">
              Multiple Choice (Multiple Answers)
            </SelectItem>
            <SelectItem value="select">Dropdown</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
            <SelectItem value="boolean">Yes/No</SelectItem>
          </SelectContent>
        </Select>
        {["radio", "checkbox"].includes(question.type) && (
          <div>
            <Label htmlFor={`layout-${question.id}`}>Layout</Label>
            <Select
              value={question.layout}
              onValueChange={(value) =>
                updateQuestion(question.id, "layout", value)
              }
            >
              <SelectTrigger id={`layout-${question.id}`}>
                <SelectValue placeholder="Select layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="large-grid">Large Grid</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {["radio", "checkbox", "select"].includes(question.type) && (
          <div className="space-y-2">
            <Label className="block mt-4 mb-2">Options</Label>
            {(question.options || []).map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="flex items-center space-x-2"
              >
                <Input
                  value={option}
                  onChange={(e) =>
                    updateOption(question.id, optionIndex, e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeOption(question.id, optionIndex)}
                  aria-label="Remove option"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => addOption(question.id)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Option
            </Button>
            {question.type === "checkbox" && (
              <div>
                <Label htmlFor={`max-choices-${question.id}`}>
                  Max Choices (optional)
                </Label>
                <Input
                  id={`max-choices-${question.id}`}
                  type="number"
                  value={question.maxChoices || ""}
                  onChange={(e) =>
                    updateQuestion(
                      question.id,
                      "maxChoices",
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  min={1}
                  max={(question.options || []).length}
                />
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`include-other-${question.id}`}
                  checked={question.includeOther}
                  onCheckedChange={(checked) =>
                    updateQuestion(question.id, "includeOther", checked)
                  }
                />
                <Label htmlFor={`include-other-${question.id}`}>
                  Include "Other" option
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`mandatory-${question.id}`}
                  checked={question.mandatory}
                  onCheckedChange={(checked) =>
                    updateQuestion(question.id, "mandatory", checked)
                  }
                />
                <Label htmlFor={`mandatory-${question.id}`}>
                  Mandatory question
                </Label>
              </div>
            </div>
          </div>
        )}
        {question.type === "rating" && (
          <div className="space-y-2">
            <Label htmlFor={`rating-type-${question.id}`}>Rating Type</Label>
            <Select
              value={question.ratingScale?.type || "number"}
              onValueChange={(value) =>
                updateRatingScale(question.id, "type", value)
              }
            >
              <SelectTrigger id={`rating-type-${question.id}`}>
                <SelectValue placeholder="Select rating type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="star">Star</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex space-x-2">
              <div>
                <Label htmlFor={`rating-min-${question.id}`}>Min</Label>
                <Input
                  id={`rating-min-${question.id}`}
                  type="number"
                  value={question.ratingScale?.min || 1}
                  onChange={(e) =>
                    updateRatingScale(question.id, "min", e.target.value)
                  }
                  min={1}
                  max={(question.ratingScale?.max || 5) - 1}
                />
              </div>
              <div>
                <Label htmlFor={`rating-max-${question.id}`}>Max</Label>
                <Input
                  id={`rating-max-${question.id}`}
                  type="number"
                  value={question.ratingScale?.max || 5}
                  onChange={(e) =>
                    updateRatingScale(question.id, "max", e.target.value)
                  }
                  min={(question.ratingScale?.min || 1) + 1}
                  max={10}
                />
              </div>
            </div>
          </div>
        )}
        {!["radio", "checkbox", "select"].includes(question.type) && (
          <div className="flex items-center justify-end space-x-2 mt-4">
            <Checkbox
              id={`mandatory-${question.id}`}
              checked={question.mandatory}
              onCheckedChange={(checked) =>
                updateQuestion(question.id, "mandatory", checked)
              }
            />
            <Label htmlFor={`mandatory-${question.id}`}>
              Mandatory question
            </Label>
          </div>
        )}
      </div>
    </Card>
  )
}