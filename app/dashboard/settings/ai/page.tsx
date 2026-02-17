import { getAISettingsAction } from "@/actions/ai-settings.actions"
import { AISettingsForm } from "./_components/ai-settings-form"

export default async function AISettingsPage() {
    const { settings, error } = await getAISettingsAction()

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-destructive">{error}</p>
            </div>
        )
    }

    return <AISettingsForm initialData={settings} />
}
