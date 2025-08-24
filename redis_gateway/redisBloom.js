const getClient = require("./redis_client");
const ins = require("./insertfn");
const existsInDb = require("./finalCheck");
const rejected= require('./rejected')
const { v4: uuidv4 } = require('uuid');


async function redisBloom(value) {
  const client = await getClient();
  const id = uuidv4();  //whnevr function runs , creates a new one everytime, if i had put it outside then would end up using the same uuid for everythin

  let filterExists = false;
  try {
    await client.bf.info("trial");
    filterExists = true;
  } catch (err) {
    if (err.message.includes("not found")) {
      filterExists = false;
    } else {
      throw err;
    }
  }

  if (!filterExists) {
    await client.bf.reserve("trial", 1, 10000);
    console.log("Filter created");
  }

  const response = await client.bf.exists("trial",value);
  // the value is gonna be true or false so see accordingly while exporting
  if (!response) {
    await ins(value, id); // put the uuid here
    await client.bf.add("trial", value);
    return { message: "User name avaialble, inserted to the db as well" };

    //reply back that it doesnt exsist
  } else {
    //hit the db, get the final verdict
    const res = await existsInDb(value);
    if (res) { 
      await rejected(value) //upate
      console.log("the user name is taken, please try another one");
      return { message: "The user name is taken, please try another one" };
    } else {
       await ins(value, id); // put the uuid here
       await client.bf.add("trial", value);
      return { message: "User name avaialble, inserted to the db as well" };
    }

  }
  

  // const res2 = await client.bf.add('trial', 'mitti');
  
  // console.log(res2);
  // console.log(re3);

  // const fin = await client.bf.exists('trial', 'mitti');
  // console.log(fin);

  // const fin1 = await client.bf.exists('trial', 'addhu');
  // console.log(fin1);
}

module.exports = redisBloom;
