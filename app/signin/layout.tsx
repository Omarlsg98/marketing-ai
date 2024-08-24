import config from "@/config";
import { getSession } from "@/lib/server/supabase";
import { getSEOTags } from "@/libs/seo";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata = getSEOTags({
  title: `Sign-in to ${config.appName}`,
  canonicalUrlRelative: "/auth/signin",
});

export default async function Layout({ children }: { children: ReactNode }) {
  const session = getSession();
  if (session) {
    redirect(config.auth.callbackUrl);
  }

  return <>{children}</>;
}
