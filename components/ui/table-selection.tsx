"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface TableSelectionHeaderProps {
    checked: boolean | "indeterminate"
    onCheckedChange: (value: boolean | "indeterminate") => void
    ariaLabel?: string
    className?: string
}

export function TableSelectionHeader({
    checked,
    onCheckedChange,
    ariaLabel = "Select all",
    className,
}: TableSelectionHeaderProps) {
    const isSelected = checked === true || checked === "indeterminate"

    return (
        <div className="relative flex items-center justify-center w-4 h-4 cursor-pointer">
            <div
                className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none select-none",
                    isSelected ? "opacity-0" : "opacity-100 group-hover/header:opacity-0"
                )}
            >
                <span className="text-[15px] font-normal text-muted-foreground">#</span>
            </div>
            <Checkbox
                checked={checked}
                onCheckedChange={onCheckedChange}
                aria-label={ariaLabel}
                className={cn(
                    "transition-opacity duration-200",
                    isSelected ? "opacity-100" : "opacity-0 group-hover/header:opacity-100",
                    className
                )}
            />
        </div>
    )
}

interface TableSelectionCellProps {
    checked: boolean
    onCheckedChange: (value: boolean) => void
    index: number
    ariaLabel?: string
    className?: string
}

export function TableSelectionCell({
    checked,
    onCheckedChange,
    index,
    ariaLabel = "Select row",
    className,
}: TableSelectionCellProps) {
    return (
        <div className="relative flex items-center justify-center w-4 h-4 cursor-pointer">
            <div
                className={cn(
                    "absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none select-none",
                    checked ? "opacity-0" : "opacity-100 group-hover/row:opacity-0"
                )}
            >
                <span className="text-[10px] font-bold text-muted-foreground">{index + 1}</span>
            </div>
            <Checkbox
                checked={checked}
                onCheckedChange={onCheckedChange}
                aria-label={ariaLabel}
                className={cn(
                    "transition-opacity duration-200",
                    checked ? "opacity-100" : "opacity-0 group-hover/row:opacity-100",
                    className
                )}
            />
        </div>
    )
}
