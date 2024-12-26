"use client";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";

function Navbar({
    sidebarOpen,
    setSidebarOpen,
}: {
    sidebarOpen: boolean;
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <header className="bg-white shadow-sm z-10">
    <div className="flex h-16 items-center justify-between px-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
        <h1 className="text-xl font-semibold ml-2">Dashboard</h1>
      </div>
    </div>
  </header>
  );
}

// function UserMenu({ user, onSignOut }: { user: User; onSignOut: () => void }) {
//   return (
//     <div className="flex items-center space-x-4">
//       <Button variant="ghost" size="icon">
//         <Bell className="h-5 w-5" />
//         <span className="sr-only">Notifications</span>
//       </Button>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//             <Avatar className="h-8 w-8">
//               <AvatarImage
//                 src={user.photoURL || undefined}
//                 alt={user.displayName || "User avatar"}
//               />
//               <AvatarFallback>
//                 {user.displayName?.[0] || <UserIcon />}
//               </AvatarFallback>
//             </Avatar>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent className="w-56" align="end" forceMount>
//           <DropdownMenuLabel className="font-normal">
//             <div className="flex flex-col space-y-1">
//               <p className="text-sm font-medium leading-none">
//                 {user.displayName}
//               </p>
//               <p className="text-xs leading-none text-muted-foreground">
//                 {user.email}
//               </p>
//             </div>
//           </DropdownMenuLabel>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem>
//             <UserIcon className="mr-2 h-4 w-4" />
//             <span>Profile</span>
//           </DropdownMenuItem>
//           <DropdownMenuItem>
//             <Settings className="mr-2 h-4 w-4" />
//             <span>Settings</span>
//           </DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem onClick={onSignOut}>Log out</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

export default Navbar;
