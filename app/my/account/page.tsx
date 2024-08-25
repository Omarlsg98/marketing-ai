"use server";

import { getSession, getUserInfo } from "@/lib/server/supabase";


export  default async function Component() {
    let name = '';
    let email = '';
    let id = '';
    const loadInfo = async () => {
        const user = await getSession();
        console.log(user);
        const data = await getUserInfo(user.id);
        console.log(data);

        name = data.full_name;
        email = data.email;
        id = data.id;
    }
    await loadInfo();
     

  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
        <p>{
            id
        }</p>
        <button onClick={() => window.history.back()}>Back</button>
    </div>
  );
}
