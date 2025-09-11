"use client"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export default function Calendar18() {

  const [dates, setDates] = React.useState<Date[]>([])

  const bookedDates = Array.from(
    { length: 12 },
    (_, i) => new Date(2025, 9, 15 + i)
  )

  return (
    <Calendar
      mode="multiple"
      required
      selected={dates}
      onSelect={setDates}
      disabled={(date) =>
        date <= new Date() || bookedDates.some(bookedDate =>
          date.toDateString() === bookedDate.toDateString()
        )
      }
      modifiers={{
        booked: bookedDates,
      }}
      modifiersClassNames={{
        booked: "[&>button]:line-through opacity-100",
      }}
      className="rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)]"
      buttonVariant="ghost"
    />
  )
}