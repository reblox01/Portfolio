import { getSiteSettingsAction } from "@/actions/site-settings.actions"
import { SiteSettingsForm } from "./_components/site-settings-form"

export default async function SiteSettingsPage() {
  const { settings, error } = await getSiteSettingsAction()

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-8">
        <div className="text-red-500">Error loading settings: {error}</div>
      </div>
    )
  }

  return <SiteSettingsForm initialData={settings} />
}
