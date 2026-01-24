import { getSiteSettingsAction } from "@/actions/site-settings.actions"
import { UiSettingsForm } from "./_components/ui-settings-form"

export default async function UiSettingsPage() {
    const { settings, error } = await getSiteSettingsAction()

    if (error) {
        return (
            <div className="text-red-500">Error loading UI settings: {error}</div>
        )
    }

    return <UiSettingsForm initialData={settings} />
}
