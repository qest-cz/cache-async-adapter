import * as _ from 'lodash';
import * as redis from 'redis';
import { promisify } from 'util';
import { ICacheAdapter } from '../../interfaces';

export class RedisCacheAdapter implements ICacheAdapter {
    protected scanKeyCount = 100;
    private client: redis.RedisClient;

    constructor(config: { port: number; host: string }) {
        this.client = redis.createClient(config.port, config.host);
    }

    public async get<T>(key: string): Promise<T> {
        return JSON.parse(await promisify(this.client.get.bind(this.client))(key));
    }

    public async set(key: string, values: object, msInterval?: number): Promise<void> {
        const valuesJson = JSON.stringify(values);
        return msInterval
            ? promisify(this.client.set.bind(this.client))(key, valuesJson, 'EX', msInterval)
            : promisify(this.client.set.bind(this.client))(key, valuesJson);
    }

    public async invalidate(key: string): Promise<void> {
        return promisify(this.client.del.bind(this.client))(key);
    }

    public async invalidateAll(): Promise<void> {
        return promisify(this.client.flushall.bind(this.client))();
    }

    public async scan<T>(regex: string): Promise<T[]> {
        const scanAllKeys = await this.scanKeys(regex);
        if (_.isEmpty(scanAllKeys)) {
            return [];
        }

        const scanResults = await promisify(this.client.mget.bind(this.client))(scanAllKeys);
        return scanResults.map((scanResult) => JSON.parse(scanResult));
    }

    public async invalidateByKeys(keys: string[]): Promise<void> {
        return promisify(this.client.del.bind(this.client))(keys);
    }

    public async scanKeys(regex: string): Promise<string[]> {
        const allKey = [];
        let iterator = 0;

        do {
            const keys = await promisify(this.client.scan.bind(this.client))(iterator, 'MATCH', regex, 'COUNT', this.scanKeyCount);
            allKey.push(keys[1]);
            if (Number(keys[0]) === 0 || _.isEmpty(keys[1])) {
                return _.flatten(allKey);
            }
            iterator++;
        } while (true);
    }
}
