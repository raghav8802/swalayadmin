"use client";

import React, { useState, useEffect } from 'react';
import { getCacheStats, debugCache, invalidateCache } from '@/lib/cache';

interface CacheStats {
  size: number;
  maxSize: number;
  keys: string[];
  totalMemoryUsage: number;
}

const CacheDebugger: React.FC = () => {
  const [stats, setStats] = useState<CacheStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const refreshStats = () => {
    setStats(getCacheStats());
  };

  const clearAllCache = () => {
    invalidateCache('');
    refreshStats();
  };

  const clearArtistsCache = () => {
    invalidateCache('artists');
    refreshStats();
  };

  const clearLabelsCache = () => {
    invalidateCache('labels');
    refreshStats();
  };

  const clearSupportCache = () => {
    invalidateCache('support');
    refreshStats();
  };

  const clearMarketingCache = () => {
    invalidateCache('marketing');
    refreshStats();
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Cache Debug {stats?.size || 0}
      </button>

      {isVisible && (
        <div className="absolute bottom-12 right-0 bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Cache Debugger</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {stats && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Size: {stats.size}/{stats.maxSize}</div>
                <div>Memory: {Math.round(stats.totalMemoryUsage / 1024)}KB</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Quick Actions:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={clearArtistsCache}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Clear Artists
                  </button>
                  <button
                    onClick={clearLabelsCache}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Clear Labels
                  </button>
                  <button
                    onClick={clearSupportCache}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Clear Support
                  </button>
                  <button
                    onClick={clearMarketingCache}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs hover:bg-red-200"
                  >
                    Clear Marketing
                  </button>
                </div>
                <button
                  onClick={clearAllCache}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 w-full"
                >
                  Clear All Cache
                </button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Cache Keys ({stats.keys.length}):</h4>
                <div className="max-h-32 overflow-y-auto text-xs">
                  {stats.keys.map((key, index) => (
                    <div key={index} className="text-gray-600 truncate">
                      {key}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  debugCache();
                  console.log('Cache debug info logged to console');
                }}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 w-full"
              >
                Log Debug to Console
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CacheDebugger; 