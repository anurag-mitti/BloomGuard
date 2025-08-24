const express = require("express");
const L1filter = require("../bloomfilter");
const L2filter = require("../redis_gateway/redisBloom");
const ins = require("../redis_gateway/insertfn");
const app = express();
const port = 3000;
const rejected = require("../redis_gateway/rejected");
const { v4: uuidv4 } = require("uuid");

app.get("/health", (req, res) => {
  res.send("Server is up and running");
});

app.get("/check/:name", async (req, res) => {
  const value = req.params.name;
  try {
    const id = uuidv4();
    let response;
    if (!L1filter.check(value)) {
      L1filter.add(value);
      ins(value, id);
      return res.send("User name available (L1)");
    } else {
      response = await L2filter(value); // calling redis bloom filter
      if (
        response.message ===
        "The user name is taken, please try another one, negative from L2"
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
