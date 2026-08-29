"use client"

import * as React from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import {
  Share2,
  Users,
  Check,
  Plus,
  ChevronsUpDown,
  LayoutDashboard,
  Workflow,
  Bot,
  Terminal,
  Blocks,
  Settings,
  UserPlus,
  HelpCircle,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

import { useAuth } from "@/app/_contexts/AuthContext"
import { WorkspaceType } from "@/_types/auth"
import { getWorkspaceMemberships } from "@/app/(workspace)"

const getMainNavItems = (t: (key: string) => string) => [
  {
    title: t("overview"),
    url: "/",
    icon: LayoutDashboard,
    active: true,
  },
  {
    title: t("workflows"),
    url: "/workflows",
    icon: Workflow,
    hasDot: true,
  },
  {
    title: t("aiAgents"),
    url: "/agents",
    icon: Bot,
  },
  {
    title: t("executionsAndLogs"),
    url: "/executions",
    icon: Terminal,
  },
  {
    title: t("toolsAndConnectors"),
    url: "/tools",
    icon: Blocks,
  },
  {
    title: t("sharedWorkflows"),
    url: "/shared",
    icon: Share2,
  },
  {
    title: t("teamAndPermissions"),
    url: "/team",
    icon: Users,
  },
]

export function AppSidebar() {
  const t = useTranslations("sidebar")

  const {
    currentWorkspace,
    workspaces,
    setWorkspaces,
  } = useAuth()

  const [selectedWorkspace, setSelectedWorkspace] =
    React.useState<WorkspaceType | undefined>(
      currentWorkspace ?? undefined,
    )

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const mainNavItems = getMainNavItems(t)

  React.useEffect(() => {
    setSelectedWorkspace(currentWorkspace ?? undefined)
  }, [currentWorkspace])

  React.useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true)
      setError(null)

      try {
        const memberships = await getWorkspaceMemberships()

        setWorkspaces(memberships)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : t("failedToLoadWorkspaces"),
        )
      } finally {
        setLoading(false)
      }
    }

    if (workspaces.length === 0) {
      fetchWorkspaces()
    }
  }, [workspaces.length, setWorkspaces, t])

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-[#fbfbfb] dark:bg-zinc-950"
    >
      {/* Workspace Switcher */}
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-between rounded-2xl border border-border/60 bg-white p-2 shadow-xs transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                >
                  <div className="flex min-w-0 items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-xs font-semibold text-orange-700 shadow-xs">
                      {selectedWorkspace?.workspace_name
                        ?.charAt(0)
                        .toUpperCase() ?? "W"}
                    </div>

                    <span className="truncate text-sm font-medium text-foreground group-data-[collapsible=icon]:hidden">
                      {loading
                        ? t("loading")
                        : selectedWorkspace?.workspace_name ??
                          t("selectWorkspace")}
                    </span>
                  </div>

                  <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/70 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[260px] rounded-2xl border-zinc-800 bg-zinc-900 p-2 text-zinc-100 shadow-xl"
                align="start"
                side="bottom"
                sideOffset={8}
              >
                <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium text-zinc-400">
                  {t("switchWorkspace")}
                </DropdownMenuLabel>

                {error ? (
                  <div className="px-2 py-3 text-xs text-red-400">
                    {error}
                  </div>
                ) : workspaces.length === 0 && !loading ? (
                  <div className="px-2 py-3 text-xs text-zinc-400">
                    {t("selectWorkspace")}
                  </div>
                ) : (
                  workspaces.map((workspace) => {
                    const isSelected =
                      workspace.workspace_id ===
                      selectedWorkspace?.workspace_id

                    return (
                      <DropdownMenuItem
                        key={workspace.workspace_id}
                        onClick={() =>
                          setSelectedWorkspace(workspace)
                        }
                        className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 focus:bg-zinc-800 focus:text-white"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="flex size-6 items-center justify-center rounded-md bg-orange-100 text-xs font-bold text-orange-700">
                            {workspace.workspace_name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-zinc-200">
                              {workspace.workspace_name}
                            </span>

                            <span className="text-[10px] capitalize text-zinc-400">
                              {workspace.role}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <Check className="size-4 text-white" />
                        )}
                      </DropdownMenuItem>
                    )
                  })
                )}

                <DropdownMenuSeparator className="my-1.5 bg-zinc-800" />

                <DropdownMenuItem className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 text-xs text-zinc-300 focus:bg-zinc-800 focus:text-white">
                  <div className="flex items-center gap-2">
                    <Plus className="size-4 text-zinc-400" />
                    <span>{t("createWorkspace")}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="space-y-4 px-2">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                      item.active
                        ? "bg-white text-foreground shadow-xs dark:bg-zinc-900"
                        : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                    }`}
                  >
                    <Link
                      href={item.url}
                      className="flex w-full items-center gap-2.5"
                    >
                      <item.icon className="size-4 shrink-0 text-muted-foreground" />

                      <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>

                      {item.hasDot && (
                        <span className="size-1.5 rounded-full bg-purple-600 group-data-[collapsible=icon]:hidden" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom Actions */}
      <SidebarFooter className="p-2">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Link
                href="/settings"
                className="flex w-full items-center gap-2.5"
              >
                <Settings className="size-4 shrink-0" />

                <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
                  {t("settings")}
                </span>

                <span className="size-1.5 rounded-full bg-purple-600 group-data-[collapsible=icon]:hidden" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Link
                href="/invite"
                className="flex items-center gap-2.5"
              >
                <UserPlus className="size-4 shrink-0" />

                <span className="truncate group-data-[collapsible=icon]:hidden">
                  {t("invitePeople")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Link
                href="/help"
                className="flex items-center gap-2.5"
              >
                <HelpCircle className="size-4 shrink-0" />

                <span className="truncate group-data-[collapsible=icon]:hidden">
                  {t("helpAndGuides")}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}