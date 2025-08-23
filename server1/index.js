const express = require('express');
const L2filter = require('../redis_gateway/redisBloom');
const app = express();
const port = 3000;

app.get('/health', (req, res) => {
  res.send('Server is up and running');
});

app.get('/check/:name', async (req, res) => {
  const value = req.params.name;
  try {
    const response = await L2filter(value); //this  an async function so always await it
    res.send(response.message);
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});