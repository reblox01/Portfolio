"use client";

import { Button } from "@/components/ui/button";
import { Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState } from "react";

interface BulkActionsToolbarProps {
    selectedIds: string[];
    onDelete?: (ids: string[]) => Promise<void>;
    onPublish?: (ids: string[], publish: boolean) => Promise<void>;
    canPublish?: boolean;
}

export function BulkActionsToolbar({
    selectedIds,
    onDelete,
    onPublish,
    canPublish = true,
}: BulkActionsToolbarProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);

    const handleDelete = async () => {
        if (
            window.confirm(
                `Are you sure you want to delete ${selectedIds.length} items?`
            )
        ) {
            setIsDeleting(true);
            await onDelete?.(selectedIds);
            setIsDeleting(false);
        }
    };

    const handleTogglePublish = async (publish: boolean) => {
        setIsPublishing(true);
        await onPublish?.(selectedIds, publish);
        setIsPublishing(false);
    };

    return (
        <div className="flex items-center gap-2">
            {canPublish && onPublish && (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(true)}
                        disabled={isPublishing}
                        className="h-8 gap-1 border-green-500/50 text-green-500 hover:bg-green-500/10 hover:text-green-600"
                    >
                        <ArrowUpCircle className="h-4 w-4" />
                        Publish
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(false)}
                        disabled={isPublishing}
                        className="h-8 gap-1 border-orange-500/50 text-orange-500 hover:bg-orange-500/10 hover:text-orange-600"
                    >
                        <ArrowDownCircle className="h-4 w-4" />
                        Unpublish
                    </Button>
                </>
            )}
            {onDelete && (
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-8 gap-1"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete
                </Button>
            )}
        </div>
    );
}
