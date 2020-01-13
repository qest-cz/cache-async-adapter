import * as _ from 'lodash';
import { ICacheAdapter } from '../../interfaces';

export class LocalCacheAdapter implements ICacheAdapter {
    private localCache;

    constructor() {
        this.localCache = {};
    }

    public async get<T>(key: string): Promise<T> {
        const result = this.localCache[key];
        return this.parseJson(result);
    }

    public async set(key: string, values: object, msInterval?: number): Promise<void> {
        const valuesJson = msInterval
            ? _.assign({ data: values }, { expirationDate: new Date().getTime() + msInterval })
            : { data: values };
        this.localCache[key] = JSON.stringify(valuesJson);
    }

    public async invalidate(key: string): Promise<void> {
        delete this.localCache[key];
    }
    public async invalidateAll(): Promise<void> {
        this.localCache = {};
    }

    public async scan<T>(req: string): Promise<T[]> {
        const reqNew = _.replace(req, new RegExp('[*]', 'g'), '.*');
        return _.filter(this.localCache, (cache, key: any) => key.toString().match(reqNew)).map((data) => this.parseJson(data));
    }

    public async scanKeys(req: string): Promise<string[]> {
        const reqNew = _.replace(req, new RegExp('[*]', 'g'), '.*');
        const nodes = _.pickBy(this.localCache, (value, key) => {
            return key.toString().match(reqNew);
        });
        return Object.keys(nodes);
    }

    public async invalidateByKeys(keys: string[]): Promise<void> {
        keys.forEach((key) => delete this.localCache[key]);
    }

    private parseJson(returnInput) {
        if (!returnInput) {
            return null;
        }
        const result = JSON.parse(returnInput);
        const interval = _.get(result, 'expirationDate', null);
        if (interval && new Date().getTime() > interval) {
            return null;
        }
        return result.data;
    }
}
