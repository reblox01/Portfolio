import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getSiteSettingsAction } from "@/actions/site-settings.actions";
import { SiteSettingsForm } from "./_components/site-settings-form";

export default async function SiteSettingsPage() {
  const queryClient = new QueryClient();
  
  await queryClient.prefetchQuery({
    queryKey: ["siteSettings"],
    queryFn: () => getSiteSettingsAction(),
  });
  
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Site Settings</h3>
          <p className="text-sm text-muted-foreground">
            Manage your site's appearance and behavior
          </p>
        </div>
        <SiteSettingsForm />
      </div>
    </HydrationBoundary>
  );
} 