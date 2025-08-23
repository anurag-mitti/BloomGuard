const getClient= require('./redis_client')
const decide = require('../consistenHash/hash');

async function ins(value,id) {
    shard=decide(value)
    const client= await getClient();
    const res= await client.hSet(shard,value,id);
    console.log(`${res} got added to the db`);

    
}

module.exports=ins;