"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface FormData {
  subdomain: string
  dateRange: DateRange | undefined
}

interface MultiStepFormProps {
  initialSubdomain?: string
  occupiedDates?: Date[]
}

export function MultiStepForm({ initialSubdomain = "", occupiedDates = [] }: MultiStepFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    subdomain: initialSubdomain,
    dateRange: {
      from: new Date(),
      to: new Date(),
    },
  })

  const totalSteps = 2

  useEffect(() => {
    if (initialSubdomain && currentStep === 1) {
      setCurrentStep(2)
    }
  }, [initialSubdomain, currentStep])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      if (currentStep === 1 && formData.subdomain) {
        const params = new URLSearchParams(searchParams.toString())
        params.set("subdomain", formData.subdomain)
        router.push(`?${params.toString()}`)
      }
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubdomainChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subdomain: value }))
  }

  const handleDateRangeChange = (dateRange: DateRange | undefined) => {
    if (dateRange?.from && !dateRange?.to) {
      const startOfDay = new Date(dateRange.from)
      startOfDay.setHours(0, 0, 0, 0)

      const endOfDay = new Date(dateRange.from)
      endOfDay.setHours(23, 59, 59, 999)

      setFormData((prev) => ({
        ...prev,
        dateRange: {
          from: startOfDay,
          to: endOfDay,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, dateRange }))
    }
  }

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.subdomain.trim().length > 0
      case 2:
        return formData.dateRange?.from !== undefined
      default:
        return false
    }
  }

  const isDateOccupied = (date: Date) => {
    return occupiedDates.some((occupiedDate) => occupiedDate.toDateString() === date.toDateString())
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg">
            Step {currentStep} of {totalSteps}
          </CardTitle>
          <div className="flex gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  i + 1 === currentStep ? "bg-primary" : i + 1 < currentStep ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">Choose Your Subdomain</h3>
              <p className="text-sm text-muted-foreground">This will be your unique site address</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subdomain" className="text-sm font-medium">
                Subdomain
              </Label>
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Input
                    id="subdomain"
                    placeholder="your-subdomain"
                    value={formData.subdomain}
                    onChange={(e) => handleSubdomainChange(e.target.value)}
                    className="rounded-r-none focus:z-10"
                    required
                  />
                </div>
                <span className="bg-muted px-3 border border-l-0 border-input rounded-r-md text-muted-foreground min-h-10 flex items-center text-sm">
                  .sitebillboard.com
                </span>
              </div>
              {formData.subdomain && (
                <p className="text-xs text-muted-foreground">
                  Your site will be available at: {formData.subdomain}.sitebillboard.com
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-foreground mb-2">Select Campaign Period</h3>
              <p className="text-sm text-muted-foreground">
                Choose your start and end dates for <strong>{formData.subdomain}.sitebillboard.com</strong>
              </p>
              {occupiedDates.length > 0 && (
                <p className="text-xs text-orange-600 mt-2">Red dates are already occupied and cannot be selected</p>
              )}
            </div>

            <div className="flex justify-center">
              <Calendar
                mode="range"
                selected={formData.dateRange}
                onSelect={handleDateRangeChange}
                className="rounded-lg border border-border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
                buttonVariant="ghost"
                disabled={(date) => isDateOccupied(date)}
                modifiers={{
                  occupied: occupiedDates,
                }}
                modifiersStyles={{
                  occupied: {
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    textDecoration: "line-through",
                  },
                }}
              />
            </div>

            {formData.dateRange?.from && (
              <div className="text-sm text-center text-muted-foreground space-y-1">
                <p>Start date: {formData.dateRange.from.toLocaleDateString()}</p>
                {formData.dateRange.to && <p>End date: {formData.dateRange.to.toLocaleDateString()}</p>}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!isStepValid(currentStep)} className="flex items-center gap-2">
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid(currentStep)} className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              Create Site
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
