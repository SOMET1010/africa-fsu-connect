
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { ChevronRight, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Types
interface SidebarContextProps {
  collapsed: boolean
  collapsedWidth: number
  setCollapsed: (collapsed: boolean) => void
  toggle: () => void
  state: "expanded" | "collapsed"
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  defaultCollapsed?: boolean
  collapsible?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  label?: string
  icon?: React.ReactNode
  collapsible?: boolean
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  collapsedWidth?: number
}

// Context
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

// Provider
export function SidebarProvider({
  children,
  defaultCollapsed = false,
  collapsedWidth = 16,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed)

  const toggle = () => setCollapsed(!collapsed)

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        collapsedWidth,
        setCollapsed,
        toggle,
        state: collapsed ? "collapsed" : "expanded",
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

// Sidebar header
export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-2", className)} {...props} />
  )
}

// Sidebar footer
export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-2", className)} {...props} />
  )
}

// Sidebar Component
export function Sidebar({
  className,
  children,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  collapsible = true,
  onCollapsedChange,
  ...props
}: SidebarProps) {
  const sidebarContext = useContext(SidebarContext)
  const [collapsed, setCollapsed] = useState(defaultCollapsed)

  const isControlled = collapsedProp !== undefined
  const _collapsed = isControlled ? collapsedProp : collapsed

  // If we're inside a SidebarProvider, use its context
  const contextCollapsed = sidebarContext?.collapsed

  // Final collapsed state is either controlled prop, internal state, or context state
  const finalCollapsed = isControlled
    ? collapsedProp
    : sidebarContext
    ? contextCollapsed
    : _collapsed

  const handleToggle = () => {
    if (!collapsible) return
    
    if (isControlled && onCollapsedChange) {
      onCollapsedChange(!collapsedProp)
    } else if (!isControlled) {
      setCollapsed(!collapsed)
    }
    
    if (sidebarContext) {
      sidebarContext.toggle()
    }
  }

  return (
    <aside
      className={cn(
        "sidebar flex flex-col border-r border-border h-screen sticky top-0 bg-card",
        "transition-all duration-300 ease-in-out",
        finalCollapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

// Sidebar content
export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("overflow-auto flex-1 py-2", className)}
      {...props}
    />
  )
}

// Sidebar group
export function SidebarGroup({
  className,
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  label,
  icon,
  collapsible = true,
  ...props
}: SidebarGroupProps) {
  const [open, setOpen] = useState<boolean>(defaultOpen)
  const isControlled = openProp !== undefined
  const _open = isControlled ? openProp : open
  
  const toggle = () => {
    if (!collapsible) return
    
    if (isControlled && onOpenChange) {
      onOpenChange(!openProp)
    } else if (!isControlled) {
      setOpen(!open)
    }
  }

  return (
    <div className={cn("mb-2", className)} {...props}>
      {label && (
        <div
          className={cn(
            "flex items-center py-2 px-3",
            collapsible && "cursor-pointer hover:bg-accent/50 rounded-md"
          )}
          onClick={toggle}
        >
          {icon && <span className="mr-2">{icon}</span>}
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex-1">
            {label}
          </span>
          {collapsible && (
            <ChevronRight
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                _open && "transform rotate-90"
              )}
            />
          )}
        </div>
      )}
      <div
        className={cn(
          "transition-all overflow-hidden",
          _open ? "opacity-100 max-h-96" : "opacity-0 max-h-0"
        )}
      >
        {children}
      </div>
    </div>
  )
}

// Sidebar group label
export function SidebarGroupLabel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 py-2",
        className
      )}
      {...props}
    />
  )
}

// Sidebar group content
export function SidebarGroupContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

// Sidebar menu
export function SidebarMenu({
  className,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("space-y-1 px-2", className)} {...props} />
  )
}

// Sidebar menu item
export function SidebarMenuItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />
}

// Sidebar menu button
export function SidebarMenuButton({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start px-2 py-1.5 h-auto text-sm",
        className
      )}
      {...props}
    />
  )
}

// Sidebar trigger
export function SidebarTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  const { toggle } = useSidebar()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={toggle}
      {...props}
    >
      <Menu className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  )
}
