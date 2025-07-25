import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { logger } from '@/utils/logger';

interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  priorityBoost: number; // Factor to boost frequently accessed items
}

interface CacheItem<T = any> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  priority: number;
  size: number;
}

interface CacheStats {
  hitRate: number;
  totalRequests: number;
  totalHits: number;
  totalMisses: number;
  currentSize: number;
  itemCount: number;
}

const DEFAULT_CONFIG: CacheConfig = {
  maxSize: 50 * 1024 * 1024, // 50MB
  ttl: 30 * 60 * 1000, // 30 minutes
  priorityBoost: 1.5,
};

export class IntelligentCache {
  private cache = new Map<string, CacheItem>();
  private config: CacheConfig;
  private stats: CacheStats = {
    hitRate: 0,
    totalRequests: 0,
    totalHits: 0,
    totalMisses: 0,
    currentSize: 0,
    itemCount: 0,
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.startCleanupInterval();
  }

  private calculateSize(data: any): number {
    try {
      return new Blob([JSON.stringify(data)]).size;
    } catch {
      return JSON.stringify(data).length * 2; // Approximate size
    }
  }

  private calculatePriority(item: CacheItem): number {
    const age = Date.now() - item.timestamp;
    const frequency = item.accessCount;
    const recency = Date.now() - item.lastAccessed;
    
    // Higher frequency and lower age/recency = higher priority
    return (frequency * this.config.priorityBoost) / Math.log(age + recency + 1);
  }

  private evictLeastImportant(): void {
    if (this.cache.size === 0) return;

    // Calculate priorities for all items
    const itemsWithPriority = Array.from(this.cache.entries()).map(([key, item]) => ({
      key,
      priority: this.calculatePriority(item),
      size: item.size,
    }));

    // Sort by priority (ascending - lowest first)
    itemsWithPriority.sort((a, b) => a.priority - b.priority);

    // Remove items until we're under the size limit
    let freedSpace = 0;
    const targetFree = this.config.maxSize * 0.1; // Free 10% of space

    for (const item of itemsWithPriority) {
      this.cache.delete(item.key);
      this.stats.currentSize -= item.size;
      this.stats.itemCount--;
      freedSpace += item.size;
      
      if (freedSpace >= targetFree) break;
    }

    logger.debug(`Cache eviction: freed ${freedSpace} bytes, ${itemsWithPriority.length} items checked`);
  }

  set<T>(key: string, data: T): void {
    const size = this.calculateSize(data);
    
    // Check if adding this item would exceed the cache size
    if (this.stats.currentSize + size > this.config.maxSize) {
      this.evictLeastImportant();
    }

    const now = Date.now();
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      priority: 1,
      size,
    };

    // Remove old item if it exists
    if (this.cache.has(key)) {
      const oldItem = this.cache.get(key)!;
      this.stats.currentSize -= oldItem.size;
      this.stats.itemCount--;
    }

    this.cache.set(key, item);
    this.stats.currentSize += size;
    this.stats.itemCount++;

    logger.debug(`Cache set: ${key}, size: ${size} bytes`);
  }

  get<T>(key: string): T | null {
    this.stats.totalRequests++;
    
    const item = this.cache.get(key) as CacheItem<T> | undefined;
    
    if (!item) {
      this.stats.totalMisses++;
      this.updateHitRate();
      return null;
    }

    // Check TTL
    if (Date.now() - item.timestamp > this.config.ttl) {
      this.delete(key);
      this.stats.totalMisses++;
      this.updateHitRate();
      return null;
    }

    // Update access statistics
    item.accessCount++;
    item.lastAccessed = Date.now();
    
    this.stats.totalHits++;
    this.updateHitRate();
    
    logger.debug(`Cache hit: ${key}, access count: ${item.accessCount}`);
    
    return item.data;
  }

  delete(key: string): boolean {
    const item = this.cache.get(key);
    if (item) {
      this.stats.currentSize -= item.size;
      this.stats.itemCount--;
      this.cache.delete(key);
      return true;
    }
    return false;
  }

  clear(): void {
    this.cache.clear();
    this.stats.currentSize = 0;
    this.stats.itemCount = 0;
    logger.info('Cache cleared');
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  private updateHitRate(): void {
    this.stats.hitRate = this.stats.totalRequests > 0 
      ? (this.stats.totalHits / this.stats.totalRequests) * 100 
      : 0;
  }

  private startCleanupInterval(): void {
    // Clean expired items every 5 minutes
    setInterval(() => {
      const now = Date.now();
      let removedCount = 0;
      let freedSpace = 0;

      for (const [key, item] of this.cache.entries()) {
        if (now - item.timestamp > this.config.ttl) {
          freedSpace += item.size;
          this.cache.delete(key);
          removedCount++;
        }
      }

      if (removedCount > 0) {
        this.stats.currentSize -= freedSpace;
        this.stats.itemCount -= removedCount;
        logger.debug(`Cache cleanup: removed ${removedCount} expired items, freed ${freedSpace} bytes`);
      }
    }, 5 * 60 * 1000);
  }
}

export const useIntelligentCache = (config?: Partial<CacheConfig>) => {
  const queryClient = useQueryClient();
  const cacheRef = useRef<IntelligentCache>();
  const [stats, setStats] = useState<CacheStats>();

  useEffect(() => {
    if (!cacheRef.current) {
      cacheRef.current = new IntelligentCache(config);
    }
  }, [config]);

  // Enhanced query client with intelligent caching
  const enhancedQueryClient = {
    ...queryClient,
    
    // Override setQueryData to use intelligent cache
    setQueryData: (queryKey: any, data: any) => {
      const key = JSON.stringify(queryKey);
      cacheRef.current?.set(key, data);
      return queryClient.setQueryData(queryKey, data);
    },

    // Override getQueryData to use intelligent cache
    getQueryData: (queryKey: any) => {
      const key = JSON.stringify(queryKey);
      const cached = cacheRef.current?.get(key);
      if (cached) {
        return cached;
      }
      return queryClient.getQueryData(queryKey);
    },
  };

  const updateStats = () => {
    if (cacheRef.current) {
      setStats(cacheRef.current.getStats());
    }
  };

  const prefetchData = async (queryKey: any, fetcher: () => Promise<any>) => {
    const key = JSON.stringify(queryKey);
    const cached = cacheRef.current?.get(key);
    
    if (!cached) {
      try {
        const data = await fetcher();
        cacheRef.current?.set(key, data);
        queryClient.setQueryData(queryKey, data);
        logger.info(`Prefetched data for ${key}`);
      } catch (error) {
        logger.error(`Failed to prefetch data for ${key}`, error);
      }
    }
  };

  const clearCache = () => {
    cacheRef.current?.clear();
    queryClient.clear();
  };

  const getCacheStats = () => {
    return cacheRef.current?.getStats();
  };

  return {
    cache: cacheRef.current,
    queryClient: enhancedQueryClient,
    stats,
    updateStats,
    prefetchData,
    clearCache,
    getCacheStats,
  };
};