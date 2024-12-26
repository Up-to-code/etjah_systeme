import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { NavItem } from '@/ts/types'
import { usePathname } from "next/navigation"

interface NavItemComponentProps {
  item: NavItem
  isOpen: boolean
  isActive: boolean
  openSubMenu: string | null
  setOpenSubMenu: (value: string | null) => void
}

const isExactPathMatch = (pathname: string, itemHref: string): boolean => {
  const normalizedPath = pathname.replace(/\/$/, '')
  const normalizedHref = itemHref.replace(/\/$/, '')
  return normalizedPath === normalizedHref
}

export const NavItemComponent = ({ 
  item,
  isOpen,
  isActive,
  openSubMenu,
  setOpenSubMenu
}: NavItemComponentProps) => {
  const pathname = usePathname()
  
  const baseClasses = `flex items-center px-4 py-2 text-sm font-medium ${
    isActive ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
  } ${isOpen ? '' : 'justify-center'}`

  if (item.subItems) {
    return (
      <Collapsible
        open={openSubMenu === item.href}
        onOpenChange={() => setOpenSubMenu(openSubMenu === item.href ? null : item.href)}
      >
        <CollapsibleTrigger asChild>
          <Button 
            variant="ghost" 
            className={`w-full justify-between ${baseClasses} ${
              item.subItems.some(subItem => isExactPathMatch(pathname, subItem.href)) 
                ? 'bg-zinc-700/50 text-white' 
                : ''
            }`}
          >
            <div className="flex items-center">
              <item.icon className={`h-6 w-6 ${isOpen ? 'mr-3' : 'mr-0'}`} />
              {isOpen && <span>{item.label}</span>}
            </div>
            {isOpen && <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {item.subItems.map((subItem) => (
            <Link 
              key={subItem.href} 
              href={subItem.href} 
              className={`pl-8 ${baseClasses} ${
                isExactPathMatch(pathname, subItem.href) ? 'bg-zinc-700 text-white' : ''
              }`}
            >
              <subItem.icon className={`h-5 w-5 ${isOpen ? 'mr-3' : 'mr-0'}`} />
              {isOpen && <span>{subItem.label}</span>}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Link href={item.href} className={baseClasses}>
      <item.icon className={`h-6 w-6 ${isOpen ? 'mr-3' : 'mr-0'}`} />
      {isOpen && <span>{item.label}</span>}
    </Link>
  )
}