const decide = require('../consistenHash/hash');
const getClient=require('./redis_client')

async function incrementRejectedScore(value)
{   
    const client= await getClient();
    const key=decide(value);
    const finKey=`rejected:${key}`;

    const newScore = await client.zIncrBy(finKey, 1, value);
    console.log(`Score for ${value} in ${finKey} is now ${newScore}`);
    
}

// incrementRejectedScore("imthebest")

module.exports=incrementRejectedScore;