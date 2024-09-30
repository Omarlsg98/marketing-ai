import { getSession, getUserInfo } from "@/lib/server/supabase"
import { redirect } from 'next/navigation'

export default async function Component() {
  const user = await getSession()

  if (!user) {
    // Redirect to login page if there's no session
    redirect('/login')
  }

  let userData
  try {
    userData = await getUserInfo(user.id)
  } catch (error) {
    console.error('Error fetching user info:', error)
    // Handle error, maybe show an error message to the user
    return <div>Error loading user information. Please try again later.</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{userData.full_name || 'N/A'}</h1>
      <p className="mb-2">Email: {userData.email || 'N/A'}</p>
      <p>User ID: {user.id}</p>
    </div>
  )
}