"use client"

import * as React from "react"

type CollapsibleContextType = {
  open: boolean
  toggle: () => void
}

const CollapsibleContext = React.createContext<CollapsibleContextType | null>(null)

export function Collapsible({
  children,
  defaultOpen = false,
  className,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}) {
  const [open, setOpen] = React.useState<boolean>(defaultOpen)

  // Keep internal state in sync if defaultOpen changes (e.g., route changes)
  React.useEffect(() => {
    setOpen(defaultOpen)
  }, [defaultOpen])

  const toggle = React.useCallback(() => setOpen((v) => !v), [])

  return (
    <div data-state={open ? "open" : "closed"} className={className}>
      <CollapsibleContext.Provider value={{ open, toggle }}>
        {children}
      </CollapsibleContext.Provider>
    </div>
  )
}

Collapsible.displayName = "Collapsible"

export function CollapsibleTrigger({ children, asChild }: { children: React.ReactElement; asChild?: boolean }) {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) return <>{children}</>

  const { toggle } = ctx

  // If asChild, clone element and attach onClick
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: (e: any) => {
        children.props.onClick?.(e)
        toggle()
      },
    })
  }

  return <button onClick={toggle}>{children}</button>
}

CollapsibleTrigger.displayName = "CollapsibleTrigger"

export function CollapsibleContent({ children }: { children: React.ReactNode }) {
  const ctx = React.useContext(CollapsibleContext)
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = React.useState<number | null>(null)

  React.useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const resize = () => setHeight(el.scrollHeight)
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    return () => ro.disconnect()
  }, [children])

  if (!ctx) return <>{children}</>

  const { open } = ctx

  return (
    <div
      aria-hidden={!open}
      style={{
        maxHeight: open ? (height ? `${height}px` : "200px") : "0px",
        overflow: "hidden",
        transition: "max-height 200ms ease, opacity 150ms ease",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      <div ref={ref} className="py-1">
        {children}
      </div>
    </div>
  )
}

CollapsibleContent.displayName = "CollapsibleContent"

export function useCollapsible() {
  const ctx = React.useContext(CollapsibleContext)
  if (!ctx) return { open: false, toggle: () => {} }
  return ctx
}



