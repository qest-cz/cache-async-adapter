# Cache

Async cache Redis or local with the same interface
which can be further expanded

Use memory storage 
```typescript
import {CacheAdapterType, CacheFactory} from "@qest/cache-async-adapter";

const cacheLocal = new CacheFactory().create(CacheAdapterType.Local);

await cacheLocal.set('key1', {data: 'hello'}, 10000); // time in ms
console.log(await cacheLocal.get('key1')); // {data: 'hello'}
```

Use Redis storage
```typescript
import {CacheAdapterType, CacheFactory} from "@qest/cache-async-adapter";
const redisConfig = {
    port: 6379,
    host: '127.0.0.1',
};

const cacheRedis =  new CacheFactory().create(CacheAdapterType.Redis, redisConfig);

await cacheRedis.set('key1', {data: 'hello Redis'}, 10000); // time in ms
console.log(await cacheRedis.get('key1')); // {data: 'hello Redis'}
```

###  All functions

##### get: <T>(key: string) => Promise<T>;
Example: 
```typescript
await cacheLocal.get('key1')
```
##### set: (key: string, values: object, msInterval?: number) => Promise<void>;
Example: 
```typescript
await cacheLocal.set('key1', {data: 'hello'}, 10000); // time in ms
```

##### invalidate: (key: string) => Promise<void>;
Example: 
```typescript
await cacheLocal.invalidate('key1')
```

##### invalidateAll: () => Promise<void>;
Example: 
```typescript
await cacheLocal.invalidateAll()
```

##### scan: <T>(key: string) => Promise<T[]>;
Example: 
```typescript
await cacheLocal.set('key1', {data: '1'}); 
await cacheLocal.set('key2', {data: '2'});
cacheRedis.scan(`key:*`); // return [key1: {data: 1}', key2: {data: 2}]   
```
####  scanKeys: <T>(regex: string) => Promise<string[]>;  

Example: 
```typescript
await cacheLocal.set('key1', {data: 'hello'}); 
await cacheLocal.set('key2', {data: 'hello'});
cacheRedis.scanKeys(`key:*`); // return ['key1', 'key2']    
```

####  invalidateByKeys: (keys: string[]) => Promise<void>;
Example: 
```typescript
await cacheLocal.invalidateByKeys(['key1'])
```
