"use client"

import { useState, useTransition } from "react"
import { createAdminAction, updateAdminDetails } from "@/actions/admin.actions"
import { createAndEditAdminSchema, CreateAndEditAdminType, AdminType } from "@/lib/types/admin-types"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/image-upload"
import FileUpload from "@/components/file-upload"
import { TagInput } from "@/components/ui/tag-input"

type Props = {
  initialData?: (AdminType & { id: string }) | null
}

const schema = createAndEditAdminSchema

// Extract a username/handle from a URL or raw input
function normalizeHandle(value?: string | null): string | null {
  if (!value) return null
  let v = value.trim()
  if (!v) return null
  // remove protocol and www
  v = v.replace(/^https?:\/\//i, "").replace(/^www\./i, "")
  // remove domain for common sites
  const hosts = [
    "github.com/",
    "linkedin.com/in/",
    "linkedin.com/",
    "facebook.com/",
    "instagram.com/",
    "discord.com/users/",
    "discordapp.com/users/",
    "gitlab.com/",
    "twitter.com/",
    "x.com/",
    "youtube.com/@",
    "youtube.com/",
  ]
  for (const h of hosts) {
    if (v.toLowerCase().startsWith(h)) {
      v = v.slice(h.length)
      break
    }
  }
  // if path-like, take last segment
  if (v.includes("/")) v = v.split("/").filter(Boolean).pop() || v
  // trim leading @
  v = v.replace(/^@+/, "")
  return v
}

export function AdminForm({ initialData }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Convert skills array to comma-separated string for editing and to an array for TagInput
  const initialSkillsArray = Array.isArray(initialData?.skills)
    ? (initialData!.skills as any[]).map((s: any) => s?.text ?? String(s))
    : [] as string[]

  const [imageValue, setImageValue] = useState<string>(initialData?.imageUrl || "")
  const [skillsValue, setSkillsValue] = useState<string[]>(initialSkillsArray)

  async function onSubmit(formData: FormData) {
    setError(null)
    const values: any = {
      name: formData.get("name")?.toString() || "",
      imageUrl: formData.get("imageUrl")?.toString() || "",
      resumeUrl: (formData.get("resumeUrl")?.toString() || null) as string | null,
      position: formData.get("position")?.toString() || "",
      location: formData.get("location")?.toString() || "",
      introduction: formData.get("introduction")?.toString() || "",
      education: formData.get("education")?.toString() || "",
      // skills as comma separated
      skills: (formData.get("skills")?.toString() || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((text) => ({ id: crypto.randomUUID(), text })),
      github: normalizeHandle(formData.get("github")?.toString() || null),
      linkedIn: normalizeHandle(formData.get("linkedIn")?.toString() || null),
      whatsapp: normalizeHandle(formData.get("whatsapp")?.toString() || null),
      facebook: normalizeHandle(formData.get("facebook")?.toString() || null),
      instagram: normalizeHandle(formData.get("instagram")?.toString() || null),
      discord: normalizeHandle(formData.get("discord")?.toString() || null),
      gitlab: normalizeHandle(formData.get("gitlab")?.toString() || null),
      twitter: normalizeHandle(formData.get("twitter")?.toString() || null),
      email: formData.get("email")?.toString() || null,
      youtube: normalizeHandle(formData.get("youtube")?.toString() || null),
    }

    try {
      schema.parse(values)
    } catch (e) {
      const zerr = e as z.ZodError
      setError(zerr.issues?.[0]?.message || "Validation error")
      return
    }

    startTransition(async () => {
      const ok = initialData
        ? await updateAdminDetails(initialData.id, values as CreateAndEditAdminType)
        : await createAdminAction(values as CreateAndEditAdminType)
      if (!ok) {
        setError("Failed to save admin")
        return
      }
      router.push("/dashboard/manage-admin")
      router.refresh()
    })
  }

  return (
    <form action={onSubmit} className="grid gap-4">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="grid gap-2 md:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" defaultValue={initialData?.name || ""} required />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input id="position" name="position" defaultValue={initialData?.position || ""} required />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={initialData?.location || ""} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={(initialData as any)?.email || ""} />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image</Label>
          <div>
            <ImageUpload
              value={imageValue}
              onChange={(v: string) => setImageValue(v)}
              onRemove={() => setImageValue("")}
            />
            {/* Hidden field so server-side FormData gets the image URL */}
            <input type="hidden" name="imageUrl" value={imageValue} readOnly />
          </div>
        </div>
        <div>
          <Label htmlFor="resumeUrl">Resume</Label>
          <div>
            <FileUpload
              value={(initialData as any)?.resumeUrl || null}
              onChange={(v: string) => {
                const hidden = document.querySelector('input[name="resumeUrl"]') as HTMLInputElement | null
                if (hidden) hidden.value = v
              }}
              onRemove={() => {
                const hidden = document.querySelector('input[name="resumeUrl"]') as HTMLInputElement | null
                if (hidden) hidden.value = ""
              }}
            />
            <input type="hidden" name="resumeUrl" defaultValue={(initialData as any)?.resumeUrl || ""} readOnly />
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="introduction">Introduction</Label>
        <textarea id="introduction" name="introduction" className="min-h-24 rounded-md border bg-background p-2"
          defaultValue={initialData?.introduction || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="education">Education</Label>
        <textarea id="education" name="education" className="min-h-24 rounded-md border bg-background p-2"
          defaultValue={initialData?.education || ""} required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="skills">Skills</Label>
        <div>
          <TagInput value={skillsValue} onChange={setSkillsValue} placeholder="Type and press Enter" />
          {/* Hidden field so server-side FormData gets the skills as comma-separated string */}
          <input type="hidden" name="skills" value={skillsValue.join(", ")} readOnly />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <strong>Social Media Profiles:</strong> Enter just your username/handle (not full URLs)
        </div>
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          <div><Label htmlFor="github">GitHub username</Label><Input id="github" name="github" placeholder="octocat" defaultValue={normalizeHandle((initialData as any)?.github) || ""} /></div>
          <div><Label htmlFor="linkedIn">LinkedIn username</Label><Input id="linkedIn" name="linkedIn" placeholder="john-doe" defaultValue={normalizeHandle((initialData as any)?.linkedIn) || ""} /></div>
          <div><Label htmlFor="twitter">Twitter username</Label><Input id="twitter" name="twitter" placeholder="johndoe" defaultValue={normalizeHandle((initialData as any)?.twitter) || ""} /></div>
          <div><Label htmlFor="gitlab">GitLab username</Label><Input id="gitlab" name="gitlab" placeholder="johndoe" defaultValue={normalizeHandle((initialData as any)?.gitlab) || ""} /></div>
          <div><Label htmlFor="instagram">Instagram username</Label><Input id="instagram" name="instagram" placeholder="johndoe" defaultValue={normalizeHandle((initialData as any)?.instagram) || ""} /></div>
          <div><Label htmlFor="facebook">Facebook username</Label><Input id="facebook" name="facebook" placeholder="johndoe" defaultValue={normalizeHandle((initialData as any)?.facebook) || ""} /></div>
          <div><Label htmlFor="discord">Discord ID/handle</Label><Input id="discord" name="discord" placeholder="user#1234" defaultValue={normalizeHandle((initialData as any)?.discord) || ""} /></div>
          <div><Label htmlFor="youtube">YouTube handle</Label><Input id="youtube" name="youtube" placeholder="mychannel" defaultValue={normalizeHandle((initialData as any)?.youtube) || ""} /></div>
          <div><Label htmlFor="whatsapp">WhatsApp number</Label><Input id="whatsapp" name="whatsapp" placeholder="+1234567890" defaultValue={normalizeHandle((initialData as any)?.whatsapp) || ""} /></div>
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={isPending}>{initialData ? "Save changes" : "Create admin"}</Button>
      </div>
    </form>
  )
}


