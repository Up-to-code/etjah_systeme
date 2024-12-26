import { Role } from "@prisma/client"
import { LucideIcon } from 'lucide-react'

export type NavItem = {
  href: string
  icon: LucideIcon
  label: string
  roleRequired?: Role
  subItems?: Omit<NavItem, 'subItems' | 'roleRequired'>[]
}