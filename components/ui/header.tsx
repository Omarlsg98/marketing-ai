import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

interface Workspace {
  id: string;
  name: string;
}

interface HeaderProps {
  workspaces?: Workspace[];
  currentWorkspace?: Workspace;
}

export default function Header({ workspaces = [], currentWorkspace }: HeaderProps) {
  const workspaceName = currentWorkspace?.name || "Default Workspace"

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        {workspaces.length > 1 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-normal">
                {workspaceName} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {workspaces.map((workspace) => (
                <DropdownMenuItem key={workspace.id}>
                  {workspace.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="text-sm font-normal text-gray-700 dark:text-gray-300">
            {workspaceName}
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-normal">
              Default workflow <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Workflow 1</DropdownMenuItem>
            <DropdownMenuItem>Workflow 2</DropdownMenuItem>
            <DropdownMenuItem>Workflow 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <nav className="flex items-center space-x-4">
        <Link 
          href="#overview" 
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          Overview
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-normal">
              Dashboard <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Dashboard 1</DropdownMenuItem>
            <DropdownMenuItem>Dashboard 2</DropdownMenuItem>
            <DropdownMenuItem>Dashboard 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link 
          href="#docs" 
          className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 pr-6"
        >
          Docs
        </Link>
      </nav>
    </header>
  )
}