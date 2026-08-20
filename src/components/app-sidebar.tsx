"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  MessageSquare,
  Video,
  FileText,
  Share2,
  Users,
  ChevronDown,
  ChevronRight,
  Folder,
  Settings,
  UserPlus,
  HelpCircle,
  GripVertical,
  Check,
  Plus,
  ChevronsUpDown,
  Circle,
  LucideIcon,
  LayoutDashboard,
  Workflow,
  Bot,
  Terminal,
  Blocks,
  FolderGit2,
  Cpu,
  Zap,
  Database,
  BrainCircuit, 
  Boxes, 
  GitBranch, 
  FileCode2, 
  ShieldAlert, 
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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

interface Workspace {
  id: string
  name: string
  members: string
  logo: string
  shortcut: string
  logoBg: string
}

const workspaces: Workspace[] = [
  { id: "1", name: "BuildBetter", members: "22 members", logo: "B", shortcut: "⌘1", logoBg: "bg-orange-100 text-orange-700" },
  { id: "2", name: "BuildBetter HQ", members: "4 members", logo: "B", shortcut: "⌘2", logoBg: "bg-emerald-100 text-emerald-700" },
  { id: "3", name: "Slack", members: "48 members", logo: "S", shortcut: "⌘3", logoBg: "bg-purple-100 text-purple-700" },
  { id: "4", name: "Figma", members: "80 members", logo: "F", shortcut: "⌘4", logoBg: "bg-zinc-800 text-white" },
]

const mainNavItems = [
  { title: "Overview", url: "/", icon: LayoutDashboard, active: true },
  { title: "Workflows", url: "/workflows", icon: Workflow, hasDot: true },
  { title: "AI Agents", url: "/agents", icon: Bot },
  { title: "Executions & Logs", url: "/executions", icon: Terminal },
  { title: "Tools & Connectors", url: "/tools", icon: Blocks },
  { title: "Shared Workflows", url: "/shared", icon: Share2 },
  { title: "Team & Permissions", url: "/team", icon: Users },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(workspaces[0])

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50 bg-[#fbfbfb] dark:bg-zinc-950">
      {/* Workspace Switcher */}
      <SidebarHeader className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full justify-between rounded-2xl bg-white dark:bg-zinc-900 border border-border/60 p-2 shadow-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center"
                >
                  <div className="flex items-center gap-2.5 min-w-0 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center">
                    <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${selectedWorkspace.logoBg} font-semibold text-xs shadow-xs`}>
                      {selectedWorkspace.logo}
                    </div>
                    <span className="truncate font-medium text-sm text-foreground group-data-[collapsible=icon]:hidden">
                      {selectedWorkspace.name}
                    </span>
                  </div>
                  <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground/70 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[260px] rounded-2xl bg-zinc-900 text-zinc-100 p-2 shadow-xl border-zinc-800"
                align="start"
                side="bottom"
                sideOffset={8}
              >
                <DropdownMenuLabel className="px-2 py-1 text-[11px] font-medium text-zinc-400">
                  Switch Workspace
                </DropdownMenuLabel>

                {workspaces.map((ws) => {
                  const isSelected = ws.id === selectedWorkspace.id
                  return (
                    <DropdownMenuItem
                      key={ws.id}
                      onClick={() => setSelectedWorkspace(ws)}
                      className="flex items-center justify-between rounded-xl px-2 py-2 cursor-pointer focus:bg-zinc-800 focus:text-white"
                    >
                      <div className="flex items-center gap-2.5">
                        <GripVertical className="size-3.5 text-zinc-600" />
                        <div className={`flex size-6 items-center justify-center rounded-md ${ws.logoBg} text-xs font-bold`}>
                          {ws.logo}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-zinc-200">{ws.name}</span>
                          <span className="text-[10px] text-zinc-400">{ws.members}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isSelected ? (
                          <Check className="size-4 text-white" />
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">{ws.shortcut}</span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  )
                })}

                <DropdownMenuSeparator className="my-1.5 bg-zinc-800" />

                <DropdownMenuItem className="flex items-center justify-between rounded-xl px-2 py-2 text-xs text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Plus className="size-4 text-zinc-400" />
                    <span>Create new workspace</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">⌘N</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-2 space-y-4">
        {/* Top Links */}
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`rounded-xl px-3 py-2 text-sm font-medium transition-all ${item.active
                      ? "bg-white text-foreground shadow-xs dark:bg-zinc-900"
                      : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground"
                      }`}
                  >
                    <Link href={item.url} className="flex items-center gap-2.5 w-full">
                      <item.icon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate flex-1 group-data-[collapsible=icon]:hidden">{item.title}</span>
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

        {/* Institutional Knowledge Section */}
        {/* <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="p-0">
            <div className="px-3 py-1 flex items-center justify-between text-xs font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
              <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground">
                <ChevronDown className="size-3.5 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                <span>Institutional Knowledge</span>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-0.5">
              <SidebarMenu className="gap-0.5">
                {[
                  {
                    title: "Entity Schema & Models",
                    url: "/knowledge/entities",
                    icon: Boxes,
                    description: "Custom domain objects, CRM fields, DB definitions"
                  },
                  {
                    title: "Behavior & Guardrails",
                    url: "/knowledge/behavior",
                    icon: ShieldAlert,
                    hasDot: true,
                    description: "Agent persona rules, compliance & tone limits"
                  },
                  {
                    title: "Data & Field Mappings",
                    url: "/knowledge/mappings",
                    icon: GitBranch,
                    description: "JSON/API transformation matrices"
                  },
                  {
                    title: "Business Logic Rules",
                    url: "/knowledge/rules",
                    icon: FileCode2,
                    description: "System prompts & execution conditionals"
                  },
                ].map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <Link href={item.url} className="flex items-center gap-2.5 w-full">
                        <item.icon className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate flex-1 group-data-[collapsible=icon]:hidden">
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible> */}

        {/* 1. Live Pipelines & Agents */}
        {/* <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="p-0">
            <div className="px-3 py-1 flex items-center justify-between text-xs font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
              <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground">
                <ChevronDown className="size-3.5 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                <span>Live Pipelines</span>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-0.5">
              <SidebarMenu className="gap-0.5">
                {[
                  { title: "rag-customer-support", url: "/workflows/rag-support", status: "bg-emerald-500" },
                  { title: "lead-qualifier-swarm", url: "/workflows/lead-qual", status: "bg-emerald-500" },
                  { title: "auto-code-reviewer", url: "/workflows/code-review", status: "bg-amber-500" },
                ].map((pipeline) => (
                  <SidebarMenuItem key={pipeline.title}>
                    <SidebarMenuButton asChild className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
                      <Link href={pipeline.url} className="flex items-center gap-2.5 w-full">
                        <Zap className="size-3 shrink-0 text-amber-500 fill-amber-500/20" />
                        <span className="truncate flex-1 group-data-[collapsible=icon]:hidden font-mono text-[11px]">{pipeline.title}</span>
                        <span className={`size-1.5 rounded-full ${pipeline.status} group-data-[collapsible=icon]:hidden`} />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible> */}

        {/* 2. Environments & Clusters */}
        {/* <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="p-0">
            <div className="px-3 py-1 flex items-center justify-between text-xs font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
              <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground">
                <ChevronDown className="size-3.5 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                <span>Clusters & Envs</span>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-0.5">
              <SidebarMenu className="gap-0.5">
                {[
                  { title: "prod-gpu-cluster-us", url: "/clusters/prod-us" },
                  { title: "staging-sandbox", url: "/clusters/staging" },
                  { title: "crewai-agent-nodes", url: "/clusters/crewai" },
                ].map((cluster) => (
                  <SidebarMenuItem key={cluster.title}>
                    <SidebarMenuButton asChild className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
                      <Link href={cluster.url} className="flex items-center gap-2.5 w-full">
                        <Cpu className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate flex-1 group-data-[collapsible=icon]:hidden text-[11px]">{cluster.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible> */}

        {/* 3. Knowledge & Vector Stores */}
        {/* <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup className="p-0">
            <div className="px-3 py-1 flex items-center justify-between text-xs font-medium text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
              <CollapsibleTrigger className="flex items-center gap-1 hover:text-foreground">
                <ChevronDown className="size-3.5 transition-transform group-data-[state=closed]/collapsible:-rotate-90" />
                <span>Vector & Data Catalogs</span>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="mt-0.5">
              <SidebarMenu className="gap-0.5">
                {[
                  { title: "pinecone-support-docs", url: "/data/pinecone-docs" },
                  { title: "qdrant-codebase-embeddings", url: "/data/qdrant-code" },
                ].map((store) => (
                  <SidebarMenuItem key={store.title}>
                    <SidebarMenuButton asChild className="rounded-xl px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5">
                      <Link href={store.url} className="flex items-center gap-2.5 w-full">
                        <Database className="size-3.5 shrink-0 text-muted-foreground" />
                        <span className="truncate flex-1 group-data-[collapsible=icon]:hidden text-[11px]">{store.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible> */}
      </SidebarContent>

      {/* Bottom Actions */}
      <SidebarFooter className="p-2">
        <SidebarMenu className="gap-0.5">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
              <Link href="/settings" className="flex items-center gap-2.5 w-full">
                <Settings className="size-4 shrink-0" />
                <span className="truncate flex-1 group-data-[collapsible=icon]:hidden">Settings</span>
                <span className="size-1.5 rounded-full bg-purple-600 group-data-[collapsible=icon]:hidden" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
              <Link href="/invite" className="flex items-center gap-2.5">
                <UserPlus className="size-4 shrink-0" />
                <span className="truncate group-data-[collapsible=icon]:hidden">Invite people</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="rounded-xl px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
              <Link href="/help" className="flex items-center gap-2.5">
                <HelpCircle className="size-4 shrink-0" />
                <span className="truncate group-data-[collapsible=icon]:hidden">Help & guides</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}