"use client"

import * as React from "react"
import {
  CaretSortIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons"
import * as SelectPrimitive from "@radix-ui/react-select"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => {
  const [language, setLanguage] = React.useState("en")

  React.useEffect(() => {
    const lang = localStorage.getItem("language") || "en"
    setLanguage(lang)
  }, [])

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        `flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1`,
        language === "ar" ? "text-right" : "text-left",
        className
      )}
      dir={language === "ar" ? "rtl" : "ltr"}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretSortIcon className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => {
  const [language, setLanguage] = React.useState("en")

  React.useEffect(() => {
    const lang = localStorage.getItem("language") || "en"
    setLanguage(lang)
  }, [])

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          `relative z-50 max-h-96 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md`,
          language === "ar" ? "text-right" : "text-left",
          className
        )}
        dir={language === "ar" ? "rtl" : "ltr"}
        position={position}
        {...props}
      >
        {children}
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
})
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  const [language, setLanguage] = React.useState("en")

  React.useEffect(() => {
    const lang = localStorage.getItem("language") || "en"
    setLanguage(lang)
  }, [])

  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground",
        language === "ar" ? "text-right" : "text-left",
        className
      )}
      dir={language === "ar" ? "rtl" : "ltr"}
      {...props}
    >
      {children}
    </SelectPrimitive.Item>
  )
})
SelectItem.displayName = SelectPrimitive.Item.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem
}
