"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

export type Tag = { id: string; text: string }

type StringModeProps = {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  disabled?: boolean
}

type ObjectModeProps = {
  tags: Tag[]
  setTags: (next: Tag[]) => void
  placeholder?: string
  disabled?: boolean
}

type InternalTagInputProps = StringModeProps | ObjectModeProps

// Export a lightweight TagStyleProps type used by Tag/TagList components for styling callbacks
export type TagStyleProps = {
  variant?: "default" | "primary" | "destructive"
  size?: "sm" | "md" | "lg" | "xl"
  shape?: "default" | "rounded" | "square" | "pill"
  borderStyle?: "default" | "none"
  textCase?: "uppercase" | "lowercase" | "capitalize"
  interaction?: "clickable" | "nonClickable"
  animation?: "none" | "fadeIn" | "slideIn" | "bounce"
  textStyle?: "normal" | "bold" | "italic" | "underline" | "lineThrough"
  direction?: "row" | "column"
  draggable?: boolean
  onTagClick?: (tag: Tag) => void
}

export function TagInput(props: InternalTagInputProps) {
  const isObjectMode = (props as ObjectModeProps).tags !== undefined
  const [text, setText] = useState("")

  const getValues = () => {
    if (isObjectMode) return (props as ObjectModeProps).tags.map((t) => t.text)
    return (props as StringModeProps).value
  }

  const setValues = (next: string[]) => {
    if (isObjectMode) {
      const om = props as ObjectModeProps
      // preserve existing ids when possible
      const existing = om.tags
      const mapped: Tag[] = next.map((t, i) => {
        const found = existing.find((e) => e.text === t)
        return found ?? { id: `${Date.now()}-${i}`, text: t }
      })
      om.setTags(mapped)
    } else {
      ;(props as StringModeProps).onChange(next)
    }
  }

  function addTag(tag: string) {
    const t = tag.trim()
    if (!t) return
    const current = getValues()
    if (current.includes(t)) return
    setValues([...current, t])
    setText("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(text)
    } else if (e.key === "Backspace" && text === "" && getValues().length > 0) {
      const current = getValues()
      setValues(current.slice(0, -1))
    }
  }

  function removeAt(idx: number) {
    const next = getValues().slice()
    next.splice(idx, 1)
    setValues(next)
  }

  const value = getValues()
  const placeholder = (props as any).placeholder
  const disabled = (props as any).disabled

  return (
    <div className="min-h-10 rounded-md border bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
      <div className="flex flex-wrap items-center gap-2">
        {value.map((tag, i) => (
          <span key={`${tag}-${i}`} className="inline-flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-sm">
            {tag}
            <button type="button" onClick={() => removeAt(i)} className="opacity-70 hover:opacity-100">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="border-0 px-0 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}
