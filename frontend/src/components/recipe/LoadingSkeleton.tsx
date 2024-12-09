import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-40 rounded-t-xl" />
          <div className="p-4 bg-white rounded-b-xl">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
            <div className="flex gap-2 mt-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-6 w-16 bg-gray-200 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}