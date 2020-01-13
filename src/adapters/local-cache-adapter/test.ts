import * as chai from 'chai';
import { CacheFactory } from '../../';
import { CacheAdapterType } from '../../interfaces';

chai.should();
const expect = chai.expect;

export const sleep = (sleepTime) => {
    return new Promise((resolve) => {
        setTimeout(resolve, sleepTime);
    });
};

describe('Cache unit tests', () => {
    const cacheLocal = new CacheFactory().create(CacheAdapterType.Local);

    describe('cache util get and invalidate', () => {
        beforeEach(async () => {
            await cacheLocal.set('foo', { myFavoriteNumber: 121 });
            await cacheLocal.set('woo', { myFavoriteNumber: 121 });
            await cacheLocal.set('foo', { myFavoriteNumber: 121 });
            await cacheLocal.set('woo', { myFavoriteNumber: 121 });
            await cacheLocal.set('shop:1212:createLocks:1245:node', { lock: false });
            await cacheLocal.set('shop:1241:createLocks:user:node', { lock: true });
            await cacheLocal.set('shop:1280:createLocks:user:node', { lock: true });
            await cacheLocal.set('shop:1290:createLocks:user:node', { lock: true });
            await cacheLocal.set('shop:1210:createLocks:122:node', { lock: true });
            await cacheLocal.set('shop:1210:createLocks:user:node', { lock: true });
        });

        afterEach(async () => {
            await cacheLocal.invalidateAll();
        });

        it('should not load expired thing', async () => {
            await cacheLocal.set('something', { one: 'two' }, 10);
            await sleep(100);
            const nothing = await cacheLocal.get('something');
            expect(nothing).to.be.eql(null);
        });

        it('should  load not expired thing', async () => {
            await cacheLocal.set('something', { one: 'two' }, 200);
            await sleep(100);
            const nothing = await cacheLocal.get('something');
            expect(nothing).not.to.be.eql(null);
        });

        it('should get store local', async () => {
            const result = await cacheLocal.get('foo');
            expect(result).have.property('myFavoriteNumber', 121);
        });

        it('should invalidate store local', async () => {
            await cacheLocal.invalidate('foo');
            const result = await cacheLocal.get('foo');
            expect(result).to.equal(null);
        });

        it('should invalidate store local with array', async () => {
            await cacheLocal.invalidateByKeys(['foo']);
            const result = await cacheLocal.get('foo');
            expect(result).to.equal(null);
        });

        it('should invalidateAll store local', async () => {
            await cacheLocal.invalidateAll();
            const result = await cacheLocal.get('foo');
            expect(result).to.equal(null);
            const resultWoo = await cacheLocal.get('woo');
            expect(resultWoo).to.equal(null);
        });

        it('should scan store local', async () => {
            const result = await cacheLocal.scan('shop:1210:*');
            expect(result[0]).to.have.property('lock', true);
            expect(result[1]).to.have.property('lock', true);
            expect(result.length).to.equal(2);
        });

        it('should scanKeys store local', async () => {
            const result = await cacheLocal.scanKeys('shop:1210:*');
            expect(result[0]).to.eql('shop:1210:createLocks:122:node');
            expect(result[1]).to.eql('shop:1210:createLocks:user:node');
            expect(result.length).to.equal(2);
        });
    });

    describe('cache util set', () => {
        beforeEach(async () => {
            await cacheLocal.invalidateAll();
        });

        it('should save data into cache local', async () => {
            await cacheLocal.set('foo', { myFavoriteNumber: 121 });
            const result = await cacheLocal.get('foo');
            expect(result).have.property('myFavoriteNumber', 121);
        });
    });
});
