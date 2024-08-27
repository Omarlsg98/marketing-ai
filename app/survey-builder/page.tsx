'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { PlusCircle, Trash2, Plus, Minus, Star, Save } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

const premadeThemes = [
  { name: 'Default', background: '#ffffff', text: '#000000', primary: '#3b82f6' },
  { name: 'Dark', background: '#1f2937', text: '#ffffff', primary: '#60a5fa' },
  { name: 'Nature', background: '#f0fdf4', text: '#166534', primary: '#22c55e' },
  { name: 'Sunset', background: '#fff7ed', text: '#9a3412', primary: '#f97316' },
  { name: 'Ocean', background: '#ecfeff', text: '#164e63', primary: '#06b6d4' },
]

export default function Component() {
  const [questions, setQuestions] = useState([
    { id: 1, type: 'text', question: "What's your name?", mandatory: false, options: [] },
    { id: 2, type: 'email', question: "What's your email address?", mandatory: true, options: [] },
  ])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [theme, setTheme] = useState(premadeThemes[0])
  const [logo, setLogo] = useState(null)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [radioStyle, setRadioStyle] = useState('square')
  const [answers, setAnswers] = useState({})
  const [otherValues, setOtherValues] = useState({})

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: 'text',
      question: 'New Question',
      options: [],
      layout: 'vertical',
      mandatory: false,
      ratingScale: { min: 1, max: 5, type: 'number' },
      maxChoices: null,
      includeOther: false,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id, field, value) => {
    const updatedQuestions = questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    )
    setQuestions(updatedQuestions)
  }

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter(q => q.id !== id)
      setQuestions(updatedQuestions)
      // Ensure currentQuestion is within bounds after removal
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

  const addOption = (questionId) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? { ...q, options: [...(q.options || []), `Option ${(q.options || []).length + 1}`] } : q
    )
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionId, optionIndex, value) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: (q.options || []).map((opt, index) => index === optionIndex ? value : opt)
      } : q
    )
    setQuestions(updatedQuestions)
  }

  const removeOption = (questionId, optionIndex) => {
    const updatedQuestions = questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: (q.options || []).filter((_, index) => index !== optionIndex)
      } : q
    )
    setQuestions(updatedQuestions)
  }

  const updateRatingScale = (id, field, value) => {
    const updatedQuestions = questions.map(q =>
      q.id === id ? { ...q, ratingScale: { ...q.ratingScale, [field]: value } } : q
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

  const handleLogoUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setLogo(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setBackgroundImage(e.target.result)
      reader.readAsDataURL(file)
    }
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleOtherChange = (questionId, value) => {
    setOtherValues(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSave = () => {
    const surveyData = {
      questions,
      theme,
      logo,
      backgroundImage,
      radioStyle,
    }
    // In a real application, you would send this data to a server
    console.log('Saving survey:', surveyData)
    toast({
      title: "Survey Saved",
      description: "Your survey has been saved successfully.",
    })
  }

  useEffect(() => {
    // Reset answers when questions change
    setAnswers({})
    setOtherValues({})
  }, [questions])

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Survey Builder */}
      <div className="w-full md:w-1/2 p-6 bg-white overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">Survey Builder</h2>
        <Separator className="mb-4" />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="mb-4">
              <PlusCircle className="w-4 h-4 mr-2" />
              Customize Theme
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2">Customize Survey Theme</DialogTitle>
              <Separator className="mb-4" />
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="logo-upload" className="text-right">
                  Logo
                </Label>
                <Input id="logo-upload" type="file" onChange={handleLogoUpload} accept="image/*" />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="background-upload" className="text-right">
                  Background
                </Label>
                <Input id="background-upload" type="file" onChange={handleBackgroundUpload} accept="image/*" />
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-right">Premade Themes</Label>
                <Select onValueChange={(value) => setTheme(premadeThemes.find(t => t.name === value))}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {premadeThemes.map((t) => (
                      <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-4">
                <Label className="text-right">Colors</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Card>
                    <CardContent className="p-2">
                      <Label htmlFor="background-color" className="text-xs">Background</Label>
                      <Input
                        id="background-color"
                        type="color"
                        value={theme.background}
                        onChange={(e) => setTheme({ ...theme, background: e.target.value })}
                        className="w-full h-8 p-0 border-none"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-2">
                      <Label htmlFor="text-color" className="text-xs">Text</Label>
                      <Input
                        id="text-color"
                        type="color"
                        value={theme.text}
                        onChange={(e) => setTheme({ ...theme, text: e.target.value })}
                        className="w-full h-8 p-0 border-none"
                      />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-2">
                      <Label htmlFor="primary-color" className="text-xs">Primary</Label>
                      <Input
                        id="primary-color"
                        type="color"
                        value={theme.primary}
                        onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                        className="w-full h-8 p-0 border-none"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="radio-style" className="text-right">
                  Radio Button Style
                </Label>
                <Select value={radioStyle} onValueChange={setRadioStyle}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {questions.map((q, index) => (
          <div key={q.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Question {index + 1}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(q.id)}
                disabled={questions.length === 1}
                aria-label="Remove question"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor={`question-${q.id}`}>Question</Label>
              <Input
                id={`question-${q.id}`}
                value={q.question}
                onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
              />
              <Label htmlFor={`type-${q.id}`}>Type</Label>
              <Select
                value={q.type}
                onValueChange={(value) => {
                  updateQuestion(q.id, 'type', value)
                  if (['radio', 'checkbox', 'select'].includes(value) && !q.options) {
                    updateQuestion(q.id, 'options', [])
                  }
                  if (value === 'rating' && !q.ratingScale) {
                    updateQuestion(q.id, 'ratingScale', { min: 1, max: 5, type: 'number' })
                  }
                }}
              >
                <SelectTrigger id={`type-${q.id}`}>
                  <SelectValue placeholder="Select question type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="radio">Multiple Choice (Single Answer)</SelectItem>
                  <SelectItem value="checkbox">Multiple Choice (Multiple Answers)</SelectItem>
                  <SelectItem value="select">Dropdown</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                </SelectContent>
              </Select>
              {['radio', 'checkbox'].includes(q.type) && (
                <div>
                  <Label htmlFor={`layout-${q.id}`}>Layout</Label>
                  <Select
                    value={q.layout}
                    onValueChange={(value) => updateQuestion(q.id, 'layout', value)}
                  >
                    <SelectTrigger id={`layout-${q.id}`}>
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
              {['radio', 'checkbox', 'select'].includes(q.type) && (
                <div className="space-y-2">
                  <Label className="block mt-4 mb-2">Options</Label>
                  {(q.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(q.id, optionIndex, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(q.id, optionIndex)}
                        aria-label="Remove option"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => addOption(q.id)} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Add Option
                  </Button>
                  {q.type === 'checkbox' && (
                    <div>
                      <Label htmlFor={`max-choices-${q.id}`}>Max Choices (optional)</Label>
                      <Input
                        id={`max-choices-${q.id}`}
                        type="number"
                        value={q.maxChoices || ''}
                        onChange={(e) => updateQuestion(q.id, 'maxChoices', e.target.value ? parseInt(e.target.value) : null)}
                        min={1}
                        max={(q.options || []).length}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`include-other-${q.id}`}
                        checked={q.includeOther}
                        onCheckedChange={(checked) => updateQuestion(q.id, 'includeOther', checked)}
                      />
                      <Label htmlFor={`include-other-${q.id}`}>Include "Other" option</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`mandatory-${q.id}`}
                        checked={q.mandatory}
                        onCheckedChange={(checked) => updateQuestion(q.id, 'mandatory', checked)}
                      />
                      <Label htmlFor={`mandatory-${q.id}`}>Mandatory question</Label>
                    </div>
                  </div>
                </div>
              )}
              {q.type === 'rating' && (
                <div className="space-y-2">
                  <Label htmlFor={`rating-type-${q.id}`}>Rating Type</Label>
                  <Select
                    value={q.ratingScale?.type || 'number'}
                    onValueChange={(value) => updateRatingScale(q.id, 'type', value)}
                  >
                    <SelectTrigger id={`rating-type-${q.id}`}>
                      <SelectValue placeholder="Select rating type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="star">Star</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <div>
                      <Label htmlFor={`rating-min-${q.id}`}>Min</Label>
                      <Input
                        id={`rating-min-${q.id}`}
                        type="number"
                        value={q.ratingScale?.min || 1}
                        onChange={(e) => updateRatingScale(q.id, 'min', parseInt(e.target.value))}
                        min={1}
                        max={(q.ratingScale?.max || 5) - 1}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`rating-max-${q.id}`}>Max</Label>
                      <Input
                        id={`rating-max-${q.id}`}
                        type="number"
                        value={q.ratingScale?.max || 5}
                        onChange={(e) => updateRatingScale(q.id, 'max', parseInt(e.target.value))}
                        min={(q.ratingScale?.min || 1) + 1}
                        max={10}
                      />
                    </div>
                  </div>
                </div>
              )}
              {!['radio', 'checkbox', 'select'].includes(q.type) && (
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <Checkbox
                    id={`mandatory-${q.id}`}
                    checked={q.mandatory}
                    onCheckedChange={(checked) => updateQuestion(q.id, 'mandatory', checked)}
                  />
                  <Label htmlFor={`mandatory-${q.id}`}>Mandatory question</Label>
                </div>
              )}
            </div>
          </div>
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
      <div 
        className="w-full md:w-1/2 p-6 overflow-y-auto"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="max-w-md mx-auto">
          {logo ? (
            <img src={logo} alt="Survey Logo" className="mb-4 w-24 h-24 rounded-full object-cover mx-auto" />
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
                  backgroundColor: theme.primary
                }}
              ></div>
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="preview-question" className="text-lg font-semibold">
              {questions[currentQuestion].question}
              {questions[currentQuestion].mandatory && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {questions[currentQuestion].type === 'text' && (
              <Input id="preview-question" placeholder="Enter your answer" required={questions[currentQuestion].mandatory} />
            )}
            {questions[currentQuestion].type === 'email' && (
              <Input id="preview-question" type="email" placeholder="Enter your email" required={questions[currentQuestion].mandatory} />
            )}
            {questions[currentQuestion].type === 'textarea' && (
              <Textarea id="preview-question" placeholder="Enter your answer" required={questions[currentQuestion].mandatory} />
            )}
            {questions[currentQuestion].type === 'radio' && (
              <RadioGroup
                value={answers[questions[currentQuestion].id] || ''}
                onValueChange={(value) => handleAnswerChange(questions[currentQuestion].id, value)}
              >
                {questions[currentQuestion].layout === 'vertical' && (
                  <div className="space-y-2">
                    {(questions[currentQuestion].options || []).map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`radio-${index}`} className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                        <Label htmlFor={`radio-${index}`}>{option}</Label>
                      </div>
                    ))}
                    {questions[currentQuestion].includeOther && (
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="other" id="radio-other" className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                        <Label htmlFor="radio-other">Other</Label>
                        <Input
                          placeholder="Please specify"
                          value={otherValues[questions[currentQuestion].id] || ''}
                          onChange={(e) => handleOtherChange(questions[currentQuestion].id, e.target.value)}
                          disabled={answers[questions[currentQuestion].id] !== 'other'}
                        />
                      </div>
                    )}
                  </div>
                )}
                {questions[currentQuestion].layout === 'horizontal' && (
                  <div className="flex space-x-4">
                    {(questions[currentQuestion].options || []).map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <RadioGroupItem value={option} id={`radio-${index}`} className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                        <Label htmlFor={`radio-${index}`}>{option}</Label>
                      </div>
                    ))}
                    {questions[currentQuestion].includeOther && (
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="other" id="radio-other" className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                        <Label htmlFor="radio-other">Other</Label>
                        <Input
                          placeholder="Please specify"
                          value={otherValues[questions[currentQuestion].id] || ''}
                          onChange={(e) => handleOtherChange(questions[currentQuestion].id, e.target.value)}
                          disabled={answers[questions[currentQuestion].id] !== 'other'}
                        />
                      </div>
                    )}
                  </div>
                )}
                {questions[currentQuestion].layout === 'grid' && (
                  <div className="grid grid-cols-2 gap-4">
                    {(questions[currentQuestion].options || []).map((option, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-center space-x-3 p-4">
                          <RadioGroupItem value={option} id={`radio-${index}`} className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                          <Label htmlFor={`radio-${index}`}>{option}</Label>
                        </CardContent>
                      </Card>
                    ))}
                    {questions[currentQuestion].includeOther && (
                      <Card>
                        <CardContent className="flex items-center space-x-3 p-4">
                          <RadioGroupItem value="other" id="radio-other" className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                          <Label htmlFor="radio-other">Other</Label>
                          <Input
                            placeholder="Please specify"
                            value={otherValues[questions[currentQuestion].id] || ''}
                            onChange={(e) => handleOtherChange(questions[currentQuestion].id, e.target.value)}
                            disabled={answers[questions[currentQuestion].id] !== 'other'}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
                {questions[currentQuestion].layout === 'large-grid' && (
                  <div className="grid grid-cols-1 gap-4">
                    {(questions[currentQuestion].options || []).map((option, index) => (
                      <Card key={index}>
                        <CardContent className="flex items-center space-x-3 p-4">
                          <RadioGroupItem value={option} id={`radio-${index}`} className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                          <Label htmlFor={`radio-${index}`}>{option}</Label>
                        </CardContent>
                      </Card>
                    ))}
                    {questions[currentQuestion].includeOther && (
                      <Card>
                        <CardContent className="flex items-center space-x-3 p-4">
                          <RadioGroupItem value="other" id="radio-other" className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                          <Label htmlFor="radio-other">Other</Label>
                          <Input
                            placeholder="Please specify"
                            value={otherValues[questions[currentQuestion].id] || ''}
                            onChange={(e) => handleOtherChange(questions[currentQuestion].id, e.target.value)}
                            disabled={answers[questions[currentQuestion].id] !== 'other'}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </RadioGroup>
            )}
            {questions[currentQuestion].type === 'checkbox' && (
              <div className={questions[currentQuestion].layout === 'grid' ? "grid grid-cols-2 gap-4" : 
                               questions[currentQuestion].layout === 'large-grid' ? "grid grid-cols-1 gap-4" : "space-y-2"}>
                {(questions[currentQuestion].options || []).map((option, index) => {
                  const isChecked = (answers[questions[currentQuestion].id] || []).includes(option)
                  const isDisabled = questions[currentQuestion].maxChoices && 
                                     (answers[questions[currentQuestion].id] || []).length >= questions[currentQuestion].maxChoices &&
                                     !isChecked
                  return (
                    questions[currentQuestion].layout === 'grid' || questions[currentQuestion].layout === 'large-grid' ? (
                      <Card key={index}>
                        <CardContent className="flex items-center space-x-3 p-4">
                          <Checkbox
                            id={`checkbox-${index}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              const newAnswers = checked
                                ? [...(answers[questions[currentQuestion].id] || []), option]
                                : (answers[questions[currentQuestion].id] || []).filter(a => a !== option)
                              handleAnswerChange(questions[currentQuestion].id, newAnswers)
                            }}
                            disabled={isDisabled}
                          />
                          <Label htmlFor={`checkbox-${index}`}>{option}</Label>
                        </CardContent>
                      </Card>
                    ) : (
                      <div key={index} className="flex items-center space-x-3">
                        <Checkbox
                          id={`checkbox-${index}`}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            const newAnswers = checked
                              ? [...(answers[questions[currentQuestion].id] || []), option]
                              : (answers[questions[currentQuestion].id] || []).filter(a => a !== option)
                            handleAnswerChange(questions[currentQuestion].id, newAnswers)
                          }}
                          disabled={isDisabled}
                        />
                        <Label htmlFor={`checkbox-${index}`}>{option}</Label>
                      </div>
                    )
                  )
                })}
                {questions[currentQuestion].includeOther && (
                  questions[currentQuestion].layout === 'grid' || questions[currentQuestion].layout === 'large-grid' ? (
                    <Card>
                      <CardContent className="flex items-center space-x-3 p-4">
                        <Checkbox
                          id="checkbox-other"
                          checked={(answers[questions[currentQuestion].id] || []).includes('other')}
                          onCheckedChange={(checked) => {
                            const newAnswers = checked
                              ? [...(answers[questions[currentQuestion].id] || []), 'other']
                              : (answers[questions[currentQuestion].id] || []).filter(a => a !== 'other')
                            handleAnswerChange(questions[currentQuestion].id, newAnswers)
                          }}
                        />
                        <Label htmlFor="checkbox-other">Other</Label>
                        <Input
                          placeholder="Please specify"
                          value={otherValues[questions[currentQuestion].id] || ''}
                          onChange={(e) => handleOtherChange(questions[currentQuestion].id, e.target.value)}
                          disabled={!(answers[questions[currentQuestion].id] || []).includes('other')}
                        />
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="checkbox-other"
                        checked={(answers[questions[currentQuestion].id] || []).includes('other')}
                        onCheckedChange={(checked) => {
                          const newAnswers = checked
                            ? [...(answers[questions[currentQuestion].id] || []), 'other']
                            : (answers[questions[currentQuestion].id] || []).filter(a => a !== 'other')
                          handleAnswerChange(questions[currentQuestion].id, newAnswers)
                        }}
                      />
                      <Label htmlFor="checkbox-other">Other</Label>
                      <Input
                        placeholder="Please specify"
                        value={otherValues[questions[currentQuestion].id] || ''}
                        onChange={(e) => handleOtherChange(questions[currentQuestion].id, e.target.value)}
                        disabled={!(answers[questions[currentQuestion].id] || []).includes('other')}
                      />
                    </div>
                  )
                )}
              </div>
            )}
            {questions[currentQuestion].type === 'select' && (
              <div>
                <Select
                  value={answers[questions[currentQuestion].id] || ''}
                  onValueChange={(value) => handleAnswerChange(questions[currentQuestion].id, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {(questions[currentQuestion].options || []).map((option, index) => (
                      <SelectItem key={index} value={option}>{option}</SelectItem>
                    ))}
                    {questions[currentQuestion].includeOther && (
                      <SelectItem value="other">Other (Please specify)</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {questions[currentQuestion].includeOther && answers[questions[currentQuestion].id] === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Please specify"
                    value={otherValues[questions[currentQuestion].id] || ''}
                    onChange={(e) => handleOtherChange(questions[currentQuestion].id, e.target.value)}
                  />
                )}
              </div>
            )}
            {questions[currentQuestion].type === 'rating' && questions[currentQuestion].ratingScale && (
              <div>
                {questions[currentQuestion].ratingScale.type === 'number' && (
                  <div>
                    <Slider
                      value={[answers[questions[currentQuestion].id] || questions[currentQuestion].ratingScale.min]}
                      onValueChange={(value) => handleAnswerChange(questions[currentQuestion].id, value[0])}
                      max={questions[currentQuestion].ratingScale.max}
                      min={questions[currentQuestion].ratingScale.min}
                      className="w-full"
                    />
                    <div className="text-center mt-2">
                      Selected rating: {answers[questions[currentQuestion].id] || questions[currentQuestion].ratingScale.min}
                    </div>
                  </div>
                )}
                {questions[currentQuestion].ratingScale.type === 'star' && (
                  <div className="flex space-x-1">
                    {Array.from({ length: questions[currentQuestion].ratingScale.max }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 cursor-pointer ${
                          (answers[questions[currentQuestion].id] || 0) > i ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                        onClick={() => handleAnswerChange(questions[currentQuestion].id, i + 1)}
                      />
                    ))}
                    {answers[questions[currentQuestion].id] && (
                      <span className="ml-2">Selected rating: {answers[questions[currentQuestion].id]}</span>
                    )}
                  </div>
                )}
              </div>
            )}
            {questions[currentQuestion].type === 'boolean' && (
              <RadioGroup
                value={answers[questions[currentQuestion].id] || ''}
                onValueChange={(value) => handleAnswerChange(questions[currentQuestion].id, value)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="yes" id="yes" className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="no" id="no" className={radioStyle === 'circle' ? 'rounded-full' : ''} />
                    <Label htmlFor="no">No</Label>
                  </div>
                </div>
              </RadioGroup>
            )}
          </div>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              onClick={handlePrevious}
              variant="outline"
              disabled={currentQuestion === 0}
              style={{ borderColor: theme.primary, color: theme.primary }}
            >
              Previous
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={currentQuestion === questions.length - 1}
              style={{ backgroundColor: theme.primary, color: theme.background }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}