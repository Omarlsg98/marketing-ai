"use client";

import { AlertCircle } from "lucide-react";
import { usePathname } from "next/navigation";

interface PlaceholderUIProps {
  pageName?: string;
}

export default function PlaceholderUI({ pageName }: PlaceholderUIProps) {
  if (pageName === undefined || pageName === "" || pageName === null) {
    const pathname = usePathname();
    pageName = pathname.split("/").pop() || "Home";
  }

  const formattedPageName =
    pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " ");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-8 sm:p-10">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            {formattedPageName}
          </h1>

          <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-6 mb-6">
            <div className="flex items-center justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-blue-500 dark:text-blue-400" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
              This is a placeholder page for{" "}
              <strong>{formattedPageName}</strong>. Content for this section is
              coming soon.
            </p>
          </div>

          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>
              Thank you for your patience as we develop this part of the site.
            </p>
            <p className="mt-2">Please check back later for updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
