const murmurhash = require('murmurhash3js');


class BloomFilter {
    constructor(size, hashFunctions) {
        this.size = size;
        this.hashFunctions = hashFunctions;
        this.array = new Uint8Array(Math.ceil(size / 8));
        this.array.fill(0);
    }

    add(name) {
        for (let i = 0; i < this.hashFunctions; i++) {
            const hash = murmurhash.x86.hash32(name, i);
            const digest = hash % this.size;
            const byteIndex = Math.floor(digest / 8);
            const bitIndex = digest % 8;
            const mask = 1 << bitIndex; 
            this.array[byteIndex] |= mask;
        }
        console.log(`'${name}' got added.`);
    }

    check(name) {
        for (let i = 0; i < this.hashFunctions; i++) {
            const hash = murmurhash.x86.hash32(name, i);
            const digest = hash % this.size;
            const byteIndex = Math.floor(digest / 8);
            const bitIndex = digest % 8;
            const mask = 1 << bitIndex;
            if ((this.array[byteIndex] & mask) === 0) {
                console.log(`'${name}' is not in the array for sure.`);
                return false;
            }
        }
        console.log(`'${name}' might be in the array.`);
        return true;
    }
}


const inmemBloomFilterInstance= new BloomFilter(1000,5)

module.exports= inmemBloomFilterInstance;