interface SidebarHeaderProps {
    isOpen: boolean
  }
  
  export const SidebarHeader = ({ isOpen }: SidebarHeaderProps) => {
    return (
      <div className="flex items-center justify-center h-16 bg-zinc-900">
        <h1 className="text-white font-bold text-2xl">
          {isOpen ? 'Dashboard' : 'D'}
        </h1>
      </div>
    )
  }