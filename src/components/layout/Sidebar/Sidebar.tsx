'use client'

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useUser, useAuthActions } from "@/store/useAuthStore"
import { navItems } from './navigation-config'
import { SidebarHeader } from './SidebarHeader'
import { UserProfile } from './UserProfile'
import { NavItemComponent } from './NavItemComponent'
 
interface SidebarProps {
  isOpen?: boolean
}

const isExactPathMatch = (pathname: string, itemHref: string): boolean => {
  // Remove trailing slashes for comparison
  const normalizedPath = pathname.replace(/\/$/, '')
  const normalizedHref = itemHref.replace(/\/$/, '')
  return normalizedPath === normalizedHref
}

export default function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname()
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)
  const user = useUser()
  const { logout } = useAuthActions()

  if (!user) {
    return null
  }

  // Find parent of current active route
  const findParentItem = navItems.find(item => 
    item.subItems?.some(subItem => isExactPathMatch(pathname, subItem.href))
  )

  // Automatically open parent menu when child is active
  if (findParentItem && openSubMenu !== findParentItem.href) {
    setOpenSubMenu(findParentItem.href)
  }

  return (
    <aside 
      className={`h-full flex flex-col bg-zinc-800 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <SidebarHeader isOpen={isOpen} />

      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {navItems.map((item) => (
          (item.roleRequired === undefined || user.role === item.roleRequired) && (
            <div key={item.href}>
              <NavItemComponent
                item={item}
                isOpen={isOpen}
                isActive={isExactPathMatch(pathname, item.href)}
                openSubMenu={openSubMenu}
                setOpenSubMenu={setOpenSubMenu}
              />
            </div>
          )
        ))}
      </nav>

      <UserProfile
        isOpen={isOpen}
        user={user}
        logout={logout}
      />
    </aside>
  )
}