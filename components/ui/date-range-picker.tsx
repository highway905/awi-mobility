"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  placeholder?: string
  width?: string
}

export default function DateRangePicker({
  className,
  date,
  onDateChange,
  placeholder = "Pick a date range",
  width = "w-[300px]",
  ...props
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleDateSelect = React.useCallback(
    (selectedDate: DateRange | undefined) => {
      onDateChange?.(selectedDate)
      if (selectedDate?.from && selectedDate?.to) {
        setIsOpen(false)
      }
    },
    [onDateChange],
  )

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(width, "justify-between text-left font-normal h-9", !date?.from && "text-muted-foreground")}
          >
            <span className="truncate">
              {date?.from
                ? date.to
                  ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                  : date.from.toLocaleDateString()
                : placeholder}
            </span>
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 custom-calendar"
          align="start"
          side="bottom"
          sideOffset={4}
          alignOffset={0}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
