import config from "@/config";
import { getSession } from "@/lib/server/supabase";
import { redirect } from "next/navigation";
import { ReactNode } from "react";


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