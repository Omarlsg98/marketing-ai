import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ChangeEvent } from "react"

interface Theme {
  name: string
  background: string
  text: string
  primary: string
}

interface CustomizeSurveyThemeModalProps {
  theme: Theme
  setTheme: (theme: Theme) => void
  handleLogoUpload: (event: ChangeEvent<HTMLInputElement>) => void
  handleBackgroundUpload: (event: ChangeEvent<HTMLInputElement>) => void
  radioStyle: string
  setRadioStyle: (style: string) => void
  premadeThemes: Theme[]
  isOpen: boolean
  onClose: () => void
}

export default function CustomizeSurveyThemeModal({
  theme,
  setTheme,
  handleLogoUpload,
  handleBackgroundUpload,
  radioStyle,
  setRadioStyle,
  premadeThemes,
  isOpen,
  onClose,
}: CustomizeSurveyThemeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2">
            Customize Survey Theme
          </DialogTitle>
          <Separator className="mb-4" />
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="logo-upload" className="text-right">
              Logo
            </Label>
            <Input
              id="logo-upload"
              type="file"
              onChange={handleLogoUpload}
              accept="image/*"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label htmlFor="background-upload" className="text-right">
              Background
            </Label>
            <Input
              id="background-upload"
              type="file"
              onChange={handleBackgroundUpload}
              accept="image/*"
            />
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-right">Premade Themes</Label>
            <Select
              onValueChange={(value) =>
                setTheme(premadeThemes.find((t) => t.name === value) || theme)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a theme" />
              </SelectTrigger>
              <SelectContent>
                {premadeThemes.map((t) => (
                  <SelectItem key={t.name} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Label className="text-right">Colors</Label>
            <div className="grid grid-cols-3 gap-2">
              <Card>
                <CardContent className="p-2">
                  <Label htmlFor="background-color" className="text-xs">
                    Background
                  </Label>
                  <Input
                    id="background-color"
                    type="color"
                    value={theme.background}
                    onChange={(e) =>
                      setTheme({ ...theme, background: e.target.value })
                    }
                    className="w-full h-8 p-0 border-none"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2">
                  <Label htmlFor="text-color" className="text-xs">
                    Text
                  </Label>
                  <Input
                    id="text-color"
                    type="color"
                    value={theme.text}
                    onChange={(e) =>
                      setTheme({ ...theme, text: e.target.value })
                    }
                    className="w-full h-8 p-0 border-none"
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-2">
                  <Label htmlFor="primary-color" className="text-xs">
                    Primary
                  </Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={theme.primary}
                    onChange={(e) =>
                      setTheme({ ...theme, primary: e.target.value })
                    }
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
  )
}