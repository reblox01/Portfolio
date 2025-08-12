"use client"

import { CldUploadWidget } from "next-cloudinary"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash, FileText } from "lucide-react"

interface FileUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove?: (value: string) => void
  value: string | null | undefined
}

const FileUpload: React.FC<FileUploadProps> = ({ disabled, onChange, onRemove, value }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) return null

  const filename = (() => {
    try {
      if (!value) return null
      const u = new URL(value)
      return decodeURIComponent(u.pathname.split("/").pop() || "")
    } catch {
      return value
    }
  })()

  return (
    <div>
      <div className="mb-2 flex items-center gap-4">
        {value && (
          <div className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-muted-foreground" />
            <a href={String(value)} target="_blank" rel="noopener noreferrer" className="underline">
              {filename || "View file"}
            </a>
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => {
                if (onRemove) onRemove(String(value))
                else onChange("")
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <CldUploadWidget onUpload={onUpload} uploadPreset={process.env.NEXT_PUBLIC_UPLOAD_PRESET}>
        {({ open }) => {
          const onClick = () => open()
          return (
            <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
              <FileText className="h-4 w-4 mr-2" />
              Upload a File
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default FileUpload


