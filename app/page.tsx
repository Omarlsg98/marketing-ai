'use client';

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/my/personas');
    }, 2000); // Show temp landing page for 2 seconds before redirecting

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="mb-4">
          <Image
            src="/logo.png"
            alt="Interseed Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Welcome to Interseed</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">We're getting everything ready for you...</p>
        <Loader2 className="animate-spin h-8 w-8 text-primary mx-auto" aria-label="Loading" />
      </div>
    </div>
  );
}