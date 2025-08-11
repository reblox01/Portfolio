"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

type TagInputProps = {
  value: string[]
  onChange: (next: string[]) => void
  placeholder?: string
  disabled?: boolean
}

export function TagInput({ value, onChange, placeholder, disabled }: TagInputProps) {
  const [text, setText] = useState("")

  function addTag(tag: string) {
    const t = tag.trim()
    if (!t) return
    if (value.includes(t)) return
    onChange([...value, t])
    setText("")
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addTag(text)
    } else if (e.key === "Backspace" && text === "" && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function removeAt(idx: number) {
    const next = value.slice()
    next.splice(idx, 1)
    onChange(next)
  }

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
