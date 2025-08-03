
// Enhanced in-memory cache for API responses
class ApiCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 1000; // Prevent memory leaks

  set(key: string, data: any, ttl: number = this.defaultTTL) {
    // Prevent cache from growing too large
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
    
    console.log(`💾 Cache set: ${key} (TTL: ${ttl}ms)`);
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) {
      console.log(`❌ Cache miss: ${key}`);
      return null;
    }
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      console.log(`⏰ Cache expired: ${key}`);
      return null;
    }
    
    console.log(`✅ Cache hit: ${key}`);
    return item.data;
  }

  clear() {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`🗑️ Cache cleared: ${size} entries removed`);
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }

  // Auto-cleanup expired entries
  cleanup() {
    const now = Date.now();
    let cleanedCount = 0;
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        this.cache.delete(key);
        cleanedCount++;
      }
    });
    if (cleanedCount > 0) {
      console.log(`🧹 Cache cleanup: ${cleanedCount} expired entries removed`);
    }
  }
}

export const apiCache = new ApiCache();

// Cleanup every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

// ✅ Improved helper for generating cache keys
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${prefix}:${sortedParams}`;
}

// Cache decorator for API routes
export function withCache(key: string, ttl?: number) {
  return function(handler: Function) {
    return async (...args: any[]) => {
      const cached = apiCache.get(key);
      if (cached) {
        console.log(`✅ Cache hit: ${key}`);
        return cached;
      }

      const result = await handler(...args);
      apiCache.set(key, result, ttl);
      console.log(`💾 Cache set: ${key}`);
      return result;
    };
  };
}

// Helper function to create cached queries (replaces old implementation)
export function createCachedQuery<T extends any[], R>(
  queryFunction: (...args: T) => Promise<R>,
  cachePrefix: string,
  ttlSeconds: number = 300 // 5 minutes default
) {
  return async (...args: T): Promise<R> => {
    const cacheKey = generateCacheKey(cachePrefix, { args: JSON.stringify(args) });
    const ttlMs = ttlSeconds * 1000;
    
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return cached;
    }

    console.log(`🔄 Cache miss: ${cacheKey} - Executing query`);
    const result = await queryFunction(...args);
    apiCache.set(cacheKey, result, ttlMs);
    console.log(`💾 Cache set: ${cacheKey} (TTL: ${ttlSeconds}s)`);
    
    return result;
  };
}

// Helper function to create cached responses (replaces old implementation)
export function createCachedResponse(data: any, message: string, ttlSeconds: number = 300) {
  const { NextResponse } = require('next/server');
  
  return NextResponse.json({
    success: true,
    data,
    message,
    cached: true,
    timestamp: new Date().toISOString()
  }, {
    headers: {
      'Cache-Control': `public, max-age=${ttlSeconds}`,
      'X-Cache-Status': 'HIT'
    }
  });
}

// Enhanced cache invalidation helpers
export function invalidateCache(pattern: string) {
  const keys = Array.from(apiCache['cache'].keys());
  const keysToDelete = keys.filter(key => key.includes(pattern));
  
  keysToDelete.forEach(key => {
    apiCache['cache'].delete(key);
  });
  
  console.log(`🗑️ Invalidated ${keysToDelete.length} cache entries matching pattern: ${pattern}`);
  if (keysToDelete.length > 0) {
    console.log(`🗑️ Invalidated keys:`, keysToDelete);
  }
  return keysToDelete.length;
}

// Cache warming function
export async function warmCache(cacheKey: string, dataFunction: () => Promise<any>, ttlSeconds: number = 300) {
  try {
    const data = await dataFunction();
    apiCache.set(cacheKey, data, ttlSeconds * 1000);
    console.log(`🔥 Cache warmed: ${cacheKey}`);
    return data;
  } catch (error) {
    console.error(`❌ Cache warming failed for ${cacheKey}:`, error);
    throw error;
  }
}

// Get cache statistics
export function getCacheStats() {
  return {
    ...apiCache.getStats(),
    keys: Array.from(apiCache['cache'].keys()),
    totalMemoryUsage: JSON.stringify(Array.from(apiCache['cache'].entries())).length
  };
}

// Debug function to log all cache entries
export function debugCache() {
  console.log('🔍 Cache Debug Information:');
  console.log('📊 Cache Stats:', getCacheStats());
  console.log('🔑 All Cache Keys:', Array.from(apiCache['cache'].keys()));
  
  apiCache['cache'].forEach((item, key) => {
    const timeLeft = item.expiry - Date.now();
    console.log(`  ${key}: expires in ${Math.round(timeLeft / 1000)}s`);
  });
}