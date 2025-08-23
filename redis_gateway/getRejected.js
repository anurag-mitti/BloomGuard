const getClient = require("./redis_client");

async function getRejected() {
  const client = await getClient();
  const nodes = ["serverA", "serverB", "serverC", "serverD"];
  const list = [];

  for (const node of nodes) {
    const key = `rejected:${node}`;

    const values = await client.zRange(key, -50, -1, { REV: true });
    list.push(...values);
  }

  return list;
}

getRejected().then((list) => {
  if (list) console.log(list);
});
