import { LocalCacheAdapter } from '../adapters/local-cache-adapter';
import { RedisCacheAdapter } from '../adapters/redis-cache-adapter';
import { CacheAdapterType, ICacheAdapter } from '../interfaces';

export class CacheFactory {
    public create(type?: CacheAdapterType, config?: { port: number; host: string }): ICacheAdapter {
        if (type === CacheAdapterType.Redis) {
            return new RedisCacheAdapter(config);
        }
        return new LocalCacheAdapter();
    }
}
