import { Folder, Home, Settings, Users, Upload, Eye } from 'lucide-react'
import { NavItem } from '@/ts/types'
import { Role } from "@prisma/client"

export const navItems: NavItem[] = [
  { href: "/dashboard", icon: Home, label: "Home" },
  {
    href: "/dashboard/files",
    icon: Folder,
    label: "Files",
    subItems: [
      { href: "/dashboard/files", icon: Eye, label: "View Files" },
      { href: "/dashboard/files/upload", icon: Upload, label: "Upload Files" },
    ],
  },
  { href: "/dashboard/users", icon: Users, label: "Users", roleRequired: Role.Admin },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]