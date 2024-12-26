"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Folder,
  Home,
  Settings,
  Users,
  Upload,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { useUser } from "@/store/useAuthStore";
import { Role } from "@prisma/client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";

type NavItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  roleRequired?: Role;
  subItems?: Omit<NavItem, "subItems" | "roleRequired">[];
};

const navItems: NavItem[] = [
  { href: "/dashboard", icon: Home, label: "Home" },
  {
    href: "/dashboard/files",
    icon: Folder,
    label: "Files",
    subItems: [
      { href: "/dashboard/files", icon: Eye, label: "Just Show" },
      { href: "/dashboard/files/upload", icon: Upload, label: "Upload" },
    ],
  },
  {
    href: "/dashboard/users",
    icon: Users,
    label: "Users",
    roleRequired: Role.Admin,
  },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function Sidebar({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const user = useUser();
  console.log("user:", user);
  const renderNavItem = ({ href, icon: Icon, label, subItems }: NavItem) => {
    const isActive = pathname === href || pathname.startsWith(href + "/");
    const baseClasses = `flex items-center px-4 py-2 text-sm font-medium ${
      isActive
        ? "bg-zinc-700 text-white"
        : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
    } ${isOpen ? "" : "justify-center"}`;

    if (subItems) {
      return (
        <Collapsible
          open={openSubMenu === href}
          onOpenChange={() =>
            setOpenSubMenu(openSubMenu === href ? null : href)
          }
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-between ${baseClasses}`}
            >
              <div className="flex items-center">
                <Icon className={`h-6 w-6 ${isOpen ? "mr-3" : "mr-0"}`} />
                {isOpen && <span>{label}</span>}
              </div>
              {isOpen && <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            {subItems.map((subItem) => (
              <Link
                key={subItem.href}
                href={subItem.href}
                className={`pl-8 ${baseClasses}`}
              >
                <subItem.icon
                  className={`h-5 w-5 ${isOpen ? "mr-3" : "mr-0"}`}
                />
                {isOpen && <span>{subItem.label}</span>}
              </Link>
            ))}
          </CollapsibleContent>
        </Collapsible>
      );
    }

    return (
      <Link href={href} className={baseClasses}>
        <Icon className={`h-6 w-6 ${isOpen ? "mr-3" : "mr-0"}`} />
        {isOpen && <span>{label}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`h-full flex flex-col bg-zinc-800 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-center h-16 bg-zinc-900">
        <h1 className="text-white font-bold text-2xl">
          {isOpen ? "Dashboard" : "D"}
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {navItems.map(
          (item) =>
            (item.roleRequired === undefined ||
              user?.role === item.roleRequired) && (
              <div key={item.href}>{renderNavItem(item)}</div>
            )
        )}
      </nav>

      <div className="border-t border-zinc-700 p-4">
        {isOpen ? (
          <>
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src={user?.imageUrl || "/placeholder.svg"}
                  alt="User avatar"
                />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-zinc-400">{user?.email}</p>
                <p className="text-xs text-zinc-400">
                  {user?.role || Role.User}
                </p>
              </div>
            </div>
            <LogoutLink>Log out</LogoutLink>

          </>
        ) : (
          <Avatar>
            <AvatarImage
              src={user?.imageUrl || "/placeholder.svg"}
              alt="User avatar"
            />
            <AvatarFallback>
              {user?.name ? user.name.charAt(0) : "U"}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </aside>
  );
}
