# Cache Troubleshooting Guide

## Issue: New Data Not Showing After Insertion

### Problem Description
New inserted data in the database is not showing immediately on the frontend for the following pages:
- Support tickets
- Labels
- Artists
- Marketing

### Root Cause
The issue was caused by **cache invalidation problems**:
1. Server-side cache wasn't being invalidated after data insertion
2. SWR client-side cache wasn't being revalidated
3. Inconsistent cache patterns across different APIs

### Solutions Implemented

#### 1. Server-Side Cache Invalidation
Added cache invalidation to all data creation APIs:

**Artists API** (`/api/artist/addArtist/route.ts`):
```typescript
import { invalidateCache } from '@/lib/cache';

// After saving new artist
invalidateCache('artists');
invalidateCache('all-labels'); // Also invalidate labels cache since artists are related
```

**Labels API** (`/api/labels/addLabel/route.tsx`):
```typescript
import { invalidateCache } from '@/lib/cache';

// After saving new label
invalidateCache('all-labels');
invalidateCache('labels');
```

**Support API** (`/api/support/createTicket/route.ts`):
```typescript
import { invalidateCache } from '@/lib/cache';

// After saving new ticket
invalidateCache('support');
invalidateCache('tickets');
```

**Marketing APIs** (`/api/marketing/togglePromotion/route.ts`, `/api/marketing/requestExtraFile/route.ts`):
```typescript
import { invalidateCache } from '@/lib/cache';

// After updating marketing data
invalidateCache('marketing');
```

#### 2. Client-Side SWR Revalidation
Updated frontend components to trigger SWR revalidation:

**ArtistModalForm** (`/components/ArtistModalForm.tsx`):
```typescript
import { mutate } from 'swr';

// After successful artist creation
mutate('/api/artist/getAllArtist');
```

#### 3. Enhanced Cache Management
Improved cache debugging and monitoring:

- Added detailed logging to cache operations
- Created cache debugging component
- Added cache statistics and monitoring

### Testing the Fixes

#### Manual Testing
1. **Add a new artist**:
   - Go to Artists page
   - Click "New Artist"
   - Fill form and submit
   - Verify new artist appears immediately in the list

2. **Add a new label**:
   - Go to Labels page
   - Click "New Label"
   - Fill form and submit
   - Verify new label appears immediately in the list

3. **Create a support ticket**:
   - Go to Support page
   - Create a new ticket
   - Verify ticket appears immediately in the list

4. **Update marketing status**:
   - Go to Marketing page
   - Toggle promotion status
   - Verify status change appears immediately

#### Automated Testing
Run the test script in browser console:
```javascript
// Available in browser console
window.testCacheInvalidation();
```

### Debugging Tools

#### 1. Cache Debugger Component
A development-only component that shows:
- Current cache size and memory usage
- All cache keys
- Quick actions to clear specific caches
- Debug information logging

**Access**: Look for the "Cache Debug" button in the bottom-right corner (development only)

#### 2. Console Logging
Enhanced cache logging shows:
- Cache hits/misses
- Cache invalidation operations
- Cache cleanup operations

**Example logs**:
```
💾 Cache set: artists:page=1&limit=10 (TTL: 600000ms)
✅ Cache hit: artists:page=1&limit=10
🗑️ Invalidated 2 cache entries matching pattern: artists
```

#### 3. Network Tab Monitoring
Check browser network tab for:
- API requests after cache invalidation
- SWR revalidation requests
- Cache headers in responses

### Common Issues and Solutions

#### Issue 1: Data still not showing after cache invalidation
**Solution**:
1. Check browser console for cache invalidation logs
2. Verify API response is successful
3. Check if SWR is revalidating (network tab)
4. Use Cache Debugger to manually clear caches

#### Issue 2: Cache invalidation not working
**Solution**:
1. Verify `invalidateCache` is imported correctly
2. Check cache key patterns match
3. Ensure cache invalidation is called after successful save
4. Check for errors in console

#### Issue 3: SWR not revalidating
**Solution**:
1. Verify `mutate` is imported from 'swr'
2. Check SWR key matches the API endpoint
3. Ensure mutate is called after successful API response
4. Check SWR configuration in useSWR hook

### Best Practices

#### 1. Cache Key Naming
Use consistent cache key patterns:
- `artists` for artist-related data
- `labels` for label-related data
- `support` for support-related data
- `marketing` for marketing-related data

#### 2. Cache Invalidation Strategy
- Invalidate related caches when data changes
- Use specific patterns to avoid over-invalidation
- Log cache operations for debugging

#### 3. SWR Configuration
- Use appropriate refresh intervals
- Enable revalidation on focus/reconnect
- Handle errors gracefully

### Monitoring and Maintenance

#### 1. Regular Cache Monitoring
- Monitor cache size and memory usage
- Check for memory leaks
- Review cache hit/miss ratios

#### 2. Performance Optimization
- Adjust cache TTL based on data volatility
- Implement cache warming for frequently accessed data
- Monitor API response times

#### 3. Debugging Workflow
1. Check console for cache logs
2. Use Cache Debugger component
3. Monitor network tab for API calls
4. Test with manual cache clearing

### Environment-Specific Notes

#### Development
- Cache Debugger component is available
- Detailed logging is enabled
- Cache TTL is shorter for faster testing

#### Production
- Cache Debugger is disabled
- Logging is reduced
- Cache TTL is optimized for performance

### Related Files
- `src/lib/cache.ts` - Cache management utilities
- `src/components/CacheDebugger.tsx` - Debug component
- `test-cache-fixes.js` - Testing script
- API route files with cache invalidation
- Frontend components with SWR integration 