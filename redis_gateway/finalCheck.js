const getClient = require('./redis_client');
const decide = require('../consistenHash/hash');

async function existsInDb(value) {
    const shard = decide(value);
    const client = await getClient();
    const exists = await client.hExists(shard, value); 
    return exists;
}

module.exports = existsInDb;