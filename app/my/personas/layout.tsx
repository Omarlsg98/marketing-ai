import { Metadata } from 'next';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import 'styles/main.css';
import WorkspaceDropdown from '@/components/WorkspaceDropdown';
import { Button } from "@/components/ui/button"
import { ChevronLeft, Grid, Bell, Sun, Send } from "lucide-react"

const title = 'Next.js Subscription Starter';
const description = 'Brought to you by Vercel, Stripe, and Supabase.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  openGraph: {
    title: title,
    description: description
  }
};

export default async function PersonasLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className='bg-[#F0F4FA]'>
        <div className='bg-[#2E3650] h-[90px] fixed w-full top-0 z-0' />
        <div className='mt-[55px] ml-[14px] mr-7 flex z-10 relative flex-shrink-0 flex-grow-0 gap-6'>
          <div className='w-[236px] bg-white rounded-t-lg'>
            <div className='h-[90px] flex items-center justify-center'>
              <div>Logo</div>
            </div>
            <div className='border-[#CBCBCB] border-solid border-t-2'> </div>
            <WorkspaceDropdown />
            <nav className="space-y-2">
              <a href="#" className="block rounded-md bg-primary/10 p-2 text-primary font-medium">
                Create Persona
              </a>
              <a href="#" className="block rounded-md p-2 hover:bg-muted transition-colors duration-200">
                View Personas
              </a>
            </nav>
          </div>
          <div className='flex-grow flex flex-col gap-9'>

            <div className='bg-white'>
              <header className="flex items-center justify-between bg-card px-6 py-4 shadow-sm">
                <div className="flex items-center space-x-4">
                  <img src="/placeholder.svg?height=40&width=40" alt="Interseed logo" className="h-10 w-10 rounded-full" />
                  <h1 className="text-2xl font-bold">Workflow - Workspace Name</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" aria-label="Open grid view">
                    <Grid className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="View notifications">
                    <Bell className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Toggle theme">
                    <Sun className="h-5 w-5" />
                  </Button>
                  <img src="/placeholder.svg?height=32&width=32" alt="User avatar" className="h-8 w-8 rounded-full" />
                </div>
              </header>
            </div>

            <div>
              {children}
            </div>

          </div>

        </div>

      </body>
    </html>
  );
}
