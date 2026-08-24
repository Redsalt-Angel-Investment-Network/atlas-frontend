'use client'

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex flex-1 flex-col h-screen overflow-hidden">
          {/* Sticky Header Container */}
          <header className="sticky top-0 z-40 flex items-center bg-background/95 backdrop-blur shrink-0">
            <SidebarTrigger className="absolute left-4 z-50" />
            <div className="w-full">
              <TopNav />
            </div>
          </header>

          {/* Scrollable Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}