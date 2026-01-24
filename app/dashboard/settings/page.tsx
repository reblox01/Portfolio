import { redirect } from "next/navigation"

export default function SettingsPage() {
    // Redirect to SEO settings by default
    redirect("/dashboard/settings/seo")
}
