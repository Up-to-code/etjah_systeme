'use client'

import { useState } from "react"
import { Search, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden ${mobileSidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-50 bg-zinc-800/50`}>
        <div className="fixed inset-y-0 left-0 w-64">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${desktopSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
                {mobileSidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
              <h1 className="text-xl font-semibold ml-2">Dashboard</h1>
            </div>
            <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}>
              {desktopSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />}
            </Button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 pr-4"
            />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

