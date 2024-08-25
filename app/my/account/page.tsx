"use server";

import { getSession, getUserInfo } from "@/lib/server/supabase";


export  default async function Component() {
    let name = '';
    let email = '';
    let id = '';
    const loadInfo = async () => {
        const user = await getSession();
        const data = await getUserInfo(user.id);

        name = data.full_name;
        email = data.email;
        id = user.id;
    }
    await loadInfo();
      

  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
        <p>{
            id
        }</p>
    </div>
  );
}
