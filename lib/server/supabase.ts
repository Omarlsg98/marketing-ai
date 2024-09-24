import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { cache } from "react";
import "server-only";
// Define a function to create a Supabase client for server-side operations
// The function takes a cookie store created with next/headers cookies as an argument
// More information can be found on: https://supabase.com/docs/guides/auth/server-side/nextjs?queryGroups=router&router=app
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    // Pass Supabase URL and anonymous key from the environment to the client
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    // Define a cookies object with methods for interacting with the cookie store and pass it to the client
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

// React Cache: https://react.dev/reference/react/cache
// Caches the session retrieval operation. This helps in minimizing redundant calls
// across server components for the same session data.
async function getSessionUser() {
  const supabase = createServerSupabaseClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export const getSession = cache(getSessionUser);

// Caches the user information retrieval operation. Similar to getSession,
// this minimizes redundant data fetching across components for the same user data.
export const getUserInfo = cache(async (userId: string) => {
  const supabase = createServerSupabaseClient();
  // Since the CreateServerSupbaseClient is wrapped in <Database> type, the
  // query method is now typesafe.
  try {
    const { data } = await supabase
      .from("users")
      .select("full_name, email")
      .eq("id", userId)
      .single();

    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
});

export const getFileUrl = async (bucket: string, name: string) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(name, 60);

  if (error) {
    console.error("Error:", error);
    throw error;
  }

  return data.signedUrl;
};

export const uploadFile = async (bucket: string, name: string, file: File) => {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(name, file, {
      upsert: true,
    });

  if (error) {
    console.error("Error:", error);
    throw error;
  }
  // Return the URL of the uploaded file

  const signedUrl = await getFileUrl(bucket, name);
  console.log("Imageed saved on: ", signedUrl);
  return {
    signedUrl,
    data,
  };
};
