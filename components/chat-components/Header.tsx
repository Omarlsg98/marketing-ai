import SideNav from '@/components/general/SideNav'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, ChevronRight, Menu, Search } from 'lucide-react'

interface HeaderProps {
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (isOpen: boolean) => void
}

export default function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: HeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between rounded-lg mb-4">
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden text-primary-foreground">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SideNav isMobile={true} onClose={() => setIsMobileMenuOpen(false)} isCollapsed={false} />
          </SheetContent>
        </Sheet>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Your App Name</h1>
          {/* Breadcrumbs - visible on desktop and tablet */}
          <div className="hidden sm:flex items-center text-xs mt-1 text-primary-foreground/70">
            <a href="#" className="hover:underline">Home</a>
            <ChevronRight className="mx-1 h-3 w-3" />
            <a href="#" className="hover:underline">Section</a>
            <ChevronRight className="mx-1 h-3 w-3" />
            <span>Current Page</span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="text-primary-foreground">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}