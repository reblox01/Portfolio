"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSiteSettingsAction, updateSiteSettingsAction } from "@/actions/site-settings.actions";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function SiteSettingsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const [customCursorEnabled, setCustomCursorEnabled] = useState(true);
  
  const { data, isLoading } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: () => getSiteSettingsAction(),
  });
  
  // Update state when data changes
  useEffect(() => {
    if (data?.settings) {
      setCustomCursorEnabled(data.settings.customCursor);
    }
  }, [data]);
  
  const mutation = useMutation({
    mutationFn: updateSiteSettingsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast({
        title: "Settings saved",
        description: "Your site settings have been updated successfully.",
      });
      setIsSaving(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      setIsSaving(false);
    },
  });
  
  const handleSave = async () => {
    setIsSaving(true);
    mutation.mutate({ customCursor: customCursorEnabled });
  };
  
  if (isLoading) {
    return <div>Loading settings...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Customize how your site looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="custom-cursor">Custom Cursor</Label>
            <p className="text-sm text-muted-foreground">
              Enable a custom mouse cursor on your website
            </p>
          </div>
          <Switch
            id="custom-cursor"
            checked={customCursorEnabled}
            onCheckedChange={setCustomCursorEnabled}
          />
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </CardContent>
    </Card>
  );
} 