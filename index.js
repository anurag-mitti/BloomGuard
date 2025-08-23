const BloomFilter=require('./bloomfilter')


const filter= new BloomFilter(100,4);

filter.check("mitti is the best")