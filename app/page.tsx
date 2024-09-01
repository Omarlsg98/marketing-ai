'use client';

import "aos/dist/aos.css"; // Import AOS styles (you can customize the styles if needed)
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  // Redirect to the demo page
  const router = useRouter();
  useEffect(() => {


    router.push('/my/personas');
  }, []);
  

  return (
    <>
      <p>Redirecting...</p>
    </>
  );
}