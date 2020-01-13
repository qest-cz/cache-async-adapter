export interface ICacheAdapter {
    get: <T>(key: string) => Promise<T>;
    set: (key: string, values: object, msInterval?: number) => Promise<void>;
    invalidate: (key: string) => Promise<void>;
    invalidateAll: () => Promise<void>;
    scan: <T>(key: string) => Promise<T[]>;
    scanKeys: <T>(regex: string) => Promise<string[]>;
    invalidateByKeys: (keys: string[]) => Promise<void>;
}

export enum CacheAdapterType {
    Local = 'local',
    Redis = 'redis',
}
