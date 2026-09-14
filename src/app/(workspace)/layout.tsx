'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
          <header className="flex shrink-0 items-center bg-background/95 backdrop-blur">
            <SidebarTrigger className="absolute left-4 z-50" />

            <div className="w-full">
              <TopNav />
            </div>
          </header>

          <main className="min-h-0 min-w-0 flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}