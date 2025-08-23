const { createClient } = require('redis');

const client = createClient({
    url: 'redis://localhost:6378'
});

client.on('error', err => console.log('Redis Client Error', err));
client.on('connect', () => console.log("client connected"));

async function getClient() {
    if (!client.isOpen) {
        await client.connect();
    }
    return client;
}
// getClient()
module.exports = getClient;