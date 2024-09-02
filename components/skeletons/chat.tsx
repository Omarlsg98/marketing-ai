'use client'

import React from 'react'

export default function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex">
        {/* Chat Section Skeleton */}
        <div className="flex flex-col w-1/2 border-r border-gray-200 dark:border-gray-700">
          <div className="flex-1 overflow-auto p-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`flex mb-6 ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <div className={`flex items-center space-x-4 ${i % 2 !== 0 ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                  <div className="h-20 w-64 rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="h-32 w-full rounded-lg bg-gray-300 dark:bg-gray-700 mb-2 animate-pulse" />
            <div className="flex justify-between items-center">
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
              <div className="h-10 w-20 rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Resizable Divider Skeleton */}
        <div className="w-1 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="h-8 w-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        {/* Component Display Section Skeleton */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 mb-4 animate-pulse" />
          
          {/* Placeholder Chart Skeleton */}
          <div className="mb-8 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 mb-2 animate-pulse" />
            <div className="h-64 w-full rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />
          </div>

          {/* Placeholder Input Skeleton */}
          <div className="mb-8">
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 mb-2 animate-pulse" />
            <div className="h-10 w-full rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />
          </div>

          {/* Placeholder Edit Field Skeleton */}
          <div>
            <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 mb-2 animate-pulse" />
            <div className="h-32 w-full rounded-lg bg-gray-300 dark:bg-gray-700 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ backgroundSize: '200% 100%' }} />
      </div>
    </div>
  )
}