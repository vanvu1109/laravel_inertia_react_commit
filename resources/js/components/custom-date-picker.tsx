"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ICustomDatePickerProps {
    title: string
    defaultFormat?: 'YYYY-MM-DD' | 'dd/MM/yyyy'
    name: string,
    defaultValue?: string,
    onChange?: (name: string, value: string | null) => void
}

export default function CustomDatePicker({
    title, 
    defaultFormat = 'dd/MM/yyyy',
    name,
    defaultValue,
    onChange
}:ICustomDatePickerProps) {
    const [date, setDate] = React.useState<Date>(
        defaultValue ? new Date(defaultValue) : new Date()
    )
    
    const handleSelect = (selected: Date | undefined) => {
        console.log(selected)
        if (!selected) return
        setDate(selected)
        if (selected && onChange) {
            onChange(name, format(selected, defaultFormat))
        }else if (onChange) {
            onChange(name, null)
        }
    }

    return (
        <Popover >
        <PopoverTrigger className="" asChild>
            <Button
            variant="outline"
            data-empty={!date}
            className="w-[280px] justify-start text-left font-normal data-[empty=true]:text-muted-foreground w-full" 
            >
            <CalendarIcon />
                {date ? format(date, defaultFormat) : <span>{title}</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={handleSelect} captionLayout="dropdown"/>
        </PopoverContent>
        </Popover>
    )
}