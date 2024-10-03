"use server";

import ChangeEmailUI from "@/components/settings-components/ChageEmail";
import { getSession, getUserInfo } from "@/lib/server/supabase";

export default async function EmailPage() {
  let name = "";
  let email = "";
  let id = "";
  const loadInfo = async () => {
    const user = await getSession();
    const data = await getUserInfo(user.id);

    name = data.full_name;
    email = data.email;
    id = user.id;
  };
  await loadInfo();

  return <ChangeEmailUI oldEmail={email} />;
}
