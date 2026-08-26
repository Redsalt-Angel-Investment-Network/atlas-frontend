"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Bell,
  Check,
  ChevronDown,
  Laptop,
  LogOut,
  Moon,
  Settings,
  Sparkles,
  Sun,
  User,
  ShieldCheck,
  ExternalLink,
} from "lucide-react"

import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockNotifications = [
  { id: 1, title: "Deployment successful", description: "Production build v2.4.0 is live", time: "2m ago", unread: true },
  { id: 2, title: "Mentioned in comment", description: "Jane tagged you in #proj-launch", time: "1h ago", unread: true },
  { id: 3, title: "Invoice available", description: "August billing statement generated", time: "1d ago", unread: false },
]

export function TopNav() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const unreadCount = mockNotifications.filter((n) => n.unread).length

  // Helper to convert route paths into formatted titles ("Team", "Settings")
  const pageTitle = React.useMemo(() => {
    const page = pathname
      .split("/")
      .filter((segment) => segment && segment !== "en" && segment !== "fr")[0]
    if (!page) return "Home"
    if (page === "team") return "Team"
    return page.charAt(0).toUpperCase() + page.slice(1).replace(/-/g, " ")
  }, [pathname])

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-background/80 px-4 backdrop-blur-xl transition-all">
      {/* 1. Sidebar Toggle & Dynamic Title */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="size-8 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-4 bg-border/60" />
        <h1 className="text-sm font-semibold tracking-tight text-foreground">{pageTitle}</h1>
      </div>

      {/* 2. Action Controls */}
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        {/* Theme Toggle Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full border border-border/40 bg-background/50 text-muted-foreground shadow-2xs hover:bg-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Sun className="size-3.5 rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-3.5 rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-36 rounded-xl border-border/50 bg-background/95 p-1 backdrop-blur-lg shadow-xl">
            <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer">
              <span className="flex items-center gap-2">
                <Sun className="size-3.5 text-muted-foreground" /> Light
              </span>
              {theme === "light" && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer">
              <span className="flex items-center gap-2">
                <Moon className="size-3.5 text-muted-foreground" /> Dark
              </span>
              {theme === "dark" && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer">
              <span className="flex items-center gap-2">
                <Laptop className="size-3.5 text-muted-foreground" /> System
              </span>
              {theme === "system" && <Check className="size-3.5 text-primary" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 rounded-full border border-border/40 bg-background/50 text-muted-foreground shadow-2xs hover:bg-accent hover:text-foreground focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Bell className="size-3.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-80 rounded-2xl border-border/50 bg-background/95 p-2 backdrop-blur-lg shadow-2xl">
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold tracking-tight">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button className="text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                Mark all read
              </button>
            </div>
            <DropdownMenuSeparator className="my-1 bg-border/40" />
            <div className="flex flex-col gap-0.5">
              {mockNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 rounded-xl p-2.5 cursor-pointer transition-colors focus:bg-accent/70"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className={`text-xs ${notification.unread ? "font-semibold text-foreground" : "font-medium text-muted-foreground"}`}>
                      {notification.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">{notification.time}</span>
                  </div>
                  <p className="line-clamp-1 text-[11px] text-muted-foreground/80">
                    {notification.description}
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator className="my-1 bg-border/40" />
            <DropdownMenuItem className="flex items-center justify-center rounded-xl py-1.5 text-center text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
              View all activity <ExternalLink className="ml-1 size-3" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 h-3.5 w-px bg-border/50" />

        {/* User Profile Pill */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="group flex h-8 items-center gap-2 rounded-full border border-border/40 bg-background/50 pl-1 pr-2.5 text-xs shadow-2xs hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring"
            >
              <div className="relative flex size-6 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-primary/60 text-[10px] font-bold text-primary-foreground shadow-xs">
                JD
                <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
              </div>
              <span className="font-medium text-foreground text-xs">Jane Doe</span>
              <ChevronDown className="size-3 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="w-60 rounded-2xl border-border/50 bg-background/95 p-1.5 backdrop-blur-lg shadow-2xl">
            <DropdownMenuLabel className="p-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  JD
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold leading-none text-foreground">Jane Doe</span>
                  <span className="text-[10px] text-muted-foreground mt-1">jane@example.com</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1 bg-border/40" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer">
                <Sparkles className="size-3.5 text-amber-500 fill-amber-500/20" /> Upgrade Plan
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer">
                <User className="size-3.5 text-muted-foreground" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer">
                <Settings className="size-3.5 text-muted-foreground" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium cursor-pointer">
                <ShieldCheck className="size-3.5 text-muted-foreground" /> Security
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="my-1 bg-border/40" />
            <DropdownMenuItem className="flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-xs font-medium text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
              <LogOut className="size-3.5" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
