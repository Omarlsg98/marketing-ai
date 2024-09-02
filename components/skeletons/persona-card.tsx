'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CustomerPersonaCardSkeleton() {
  return (
    <div className="p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 overflow-hidden">
        <CardHeader className="flex flex-col items-center space-y-4 px-8 pt-8">
          <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          <div className="text-center space-y-2">
            <div className="h-8 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 px-8">
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-20 ml-auto bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col items-start px-8 pb-8 pt-6">
          <Separator className="w-full bg-gray-200 dark:bg-gray-700" />
          <div className="mt-6 flex w-full justify-between">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </CardFooter>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 dark:via-gray-600/60 to-transparent" />
      </Card>
    </div>
  );
}