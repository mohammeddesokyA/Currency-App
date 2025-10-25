
import React from 'react';

const ShimmerBlock = ({ className }) => {
  return (
    <div
      className={`bg-gray-200/70 dark:bg-gray-700/70 rounded-md animate-pulse ${className}`}
    ></div>
  );
};

export default function ConverterSkeleton() {
  return (
    <div className="max-w-2xl mx-auto my-10 p-4 sm:p-8 bg-white/70 dark:bg-gray-800/70 rounded-2xl shadow-2xl backdrop-filter backdrop-blur-lg">
      
      <ShimmerBlock className="h-7 w-3/4 mx-auto mb-4" />
      <ShimmerBlock className="h-4 w-full max-w-sm mx-auto mb-8" />

      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <ShimmerBlock className="h-5 w-24 mb-2" />
          <ShimmerBlock className="h-12 w-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
          <div className="col-span-full sm:col-span-2">
            <ShimmerBlock className="h-5 w-16 mb-2" />
            <ShimmerBlock className="h-12 w-full" />
          </div>
          <div className="col-span-full sm:col-span-1 flex justify-center">
            <ShimmerBlock className="h-12 w-12 rounded-full" />
          </div>
          <div className="col-span-full sm:col-span-2">
            <ShimmerBlock className="h-5 w-16 mb-2" />
            <ShimmerBlock className="h-12 w-full" />
          </div>
        </div>

        <ShimmerBlock className="h-12 w-full rounded-full" />
      </div>
    </div>
  );
}