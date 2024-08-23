import { PropsWithChildren } from 'react';


export default async function PersonasLayout({ children }: PropsWithChildren) {
  // temporarily setting up a loggined in user
  // const cookieStore = cookies()
  // if (!cookieStore.has('logged_in_user_id')) {
  //   cookieStore.set('logged_in_user_id', Date.now().toString())
  // }


  return (
    <html lang="en">
      <body className='bg-[#F0F4FA]'>
        {children}
      </body>
    </html>
  );
}
