"use client"

export default function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex-1 space-y-4 p-8">
            {/* Main Content */}
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}
