const express = require("express");
const L1filter = require("../bloomfilter");
const L2filter = require("../redis_gateway/redisBloom");
const ins = require("../redis_gateway/insertfn");
const app = express();
const port = 3000;
const rejected = require("../redis_gateway/rejected");
const { v4: uuidv4 } = require("uuid");
const getClient = require("../redis_gateway/redis_client");

app.get("/health", (req, res) => {
  res.send("Server is up and running");
});

app.get("/check/:name", async (req, res) => {
  const value = req.params.name;
  try {
    const id = uuidv4();
    let response;

    if (!L1filter.check(value)) {
      console.log(`'${value}' passed L1 check. Adding to all layers.`);
      const client = await getClient();

      await Promise.all([
        ins(value, id),
        client.bf.add("trial", value) //fucking hell had forgotten this , so second time when i added L1 filter said maybe and it wennt to L2 but this latest one i hadnt added to the redis bf so yeh
      ]);

      L1filter.add(value);

      return res.send("User name available (L1)");

    } else {
      response = await L2filter(value);
      if (
        response.message ===
        "The user name is taken, please try another one"
      ) {
        await rejected(value);
      }
    }

    res.send(response.message);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
//last issue,  able to add to the db twice, see the logs and debug it
