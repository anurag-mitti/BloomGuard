const getClient = require("./redis_client");
const L1Filter = require('../bloomfilter');

async function getRejected() {
  const client = await getClient();
  const nodes = ["serverA", "serverB", "serverC", "serverD"];
  const list = [];

  try {
    for (const node of nodes) {
      const key = `rejected:${node}`;
      const values = await client.zRange(key, -50, -1, { REV: true });
      list.push(...values);
    }
    console.log(`Fetched ${list.length} rejected keys from Redis.`);
    return list;
  } catch (error) {
    console.error("Error fetching rejected keys:", error);
    return [];
  }
}

module.exports = getRejected;


// getRejected().then((list) => {
//   if (list) console.log(list);
// });
