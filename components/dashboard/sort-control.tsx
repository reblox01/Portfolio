"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateSortSettingsAction } from "@/actions/sortSettings.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SortControlProps {
    currentSort: string;
    contentType: "project" | "certification" | "experience" | "education" | "techstack";
    onSortComplete?: () => void;
}

export function SortControl({ currentSort, contentType, onSortComplete }: SortControlProps) {
    const [isPending, startTransition] = React.useTransition();

    const handleSortChange = (value: string) => {
        startTransition(async () => {
            const key = `${contentType}SortType` as const;
            const success = await updateSortSettingsAction({ [key]: value });
            if (success) {
                toast.success("Sort order updated");
                if (onSortComplete) onSortComplete();
            } else {
                toast.error("Failed to update sort order");
            }
        });
    };

    return (
        <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
            <Select
                value={currentSort}
                onValueChange={handleSortChange}
                disabled={isPending}
            >
                <SelectTrigger className="w-[180px]">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="custom">Custom (Drag & Drop)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
