interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

class ApiCache {
    private cache = new Map<string, CacheEntry<any>>();

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
            this.cache.delete(key);
            return null;
        }
        return entry.data as T;
    }

    set<T>(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
    }

    invalidate(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }
}

export const apiCache = new ApiCache();

export async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = apiCache.get<T>(key);
    if (cached !== null) return cached;

    const data = await fetcher();
    apiCache.set(key, data);
    return data;
}
