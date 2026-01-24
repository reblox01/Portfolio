import { getAllPageSeoAction } from "@/actions/page-seo.actions"
import { SeoSettingsForm } from "./_components/seo-settings-form"

export default async function SeoSettingsPage() {
    const { pages, error } = await getAllPageSeoAction()

    if (error) {
        return (
            <div className="text-red-500">Error loading SEO settings: {error}</div>
        )
    }

    return <SeoSettingsForm initialPages={pages || []} />
}
