import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'
import { Role } from "@/store/useAuthStore"  // Import Role from auth store instead of Prisma

// Define User interface matching the auth store
interface User {
  id: string
  email: string
  name: string
  imageUrl: string
  role: Role
}

interface UserProfileProps {
  isOpen: boolean
  user: User | null
  logout: () => void
}

export const UserProfile = ({ isOpen, user, logout }: UserProfileProps) => {
  return (
    <div className="border-t border-zinc-700 p-4">
      {isOpen ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt="User avatar" />
              <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
              <p className="text-xs text-zinc-400">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-300 hover:bg-zinc-700 hover:text-white"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </Button>
        </div>
      ) : (
        <div className="flex justify-center">
          <Avatar>
            <AvatarImage src={user?.imageUrl || "/placeholder.svg"} alt="User avatar" />
            <AvatarFallback>{user?.name ? user.name.charAt(0) : "U"}</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
}