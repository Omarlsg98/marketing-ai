import config from "@/config";
import { getSession } from "@/lib/server/supabase";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

// This is a server-side component to ensure the user is logged in.
// If not, it will redirect to the login page.
// It's applied to all subpages of /dashboard in /app/dashboard/*** pages
// You can also add custom static UI elements like a Navbar, Sidebar, Footer, etc..
// See https://nextstarter.ai/docs/tutorials/private-page
export default async function LayoutPrivate({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return <>{children}</>;
}
