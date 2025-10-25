
import React from 'react';

export default function MultiResultDisplay({ results, from, amount }) {
  if (!results || Object.keys(results).length === 0) return null;

  return (
    <div className="max-w-2xl w-full mx-auto mt-6 bg-green-50/70 dark:bg-gray-900/70 rounded-2xl shadow-xl backdrop-filter backdrop-blur-lg border border-green-500/50 dark:border-green-600/50 animate-popIn">
      
      <div className="p-4 sm:p-6 border-b border-green-500/30 dark:border-green-600/30">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Conversion Results for
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {amount} {from}
        </p>
      </div>

      <div className="p-4 sm:p-6 max-h-60 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {Object.entries(results).map(([currency, rate]) => (
            <div 
              key={currency} 
              className="flex items-center justify-between p-3 rounded-md bg-gray-100/70 dark:bg-gray-800/70"
            >
              <span className="text-lg font-bold text-gray-900 dark:text-white">{currency}</span>
              
              <span className="text-lg font-medium text-green-700 dark:text-green-400">
                {rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}