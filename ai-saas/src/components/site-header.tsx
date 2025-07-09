"use client"

import { SidebarIcon } from "lucide-react"
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="w-full sm:ml-auto sm:w-auto"></div>
        <Button onClick={logout} variant="secondary">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
        
        {/* <SearchForm className="w-full sm:ml-auto sm:w-auto" /> */}
        
      </div>
    </header>
  )
}
