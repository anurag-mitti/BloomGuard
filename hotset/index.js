const inmem = require("../bloomfilter");
const getRejected = require("../redis_gateway/getRejected");

async function updateRejected() {
  try {
    const list = await getRejected();
    list.forEach((value) => {
      if (typeof value === 'string') {
        inmem.add(value);  // Added each string individually, was getting type error, before adding something somewhee always first check out the type and then fitlter and add it 
      } else {
        console.warn('Improper type detected , did not update the hotset', typeof value, value);
      }
    });
    console.log(`Updated  the in mem Bloom filter with ${list.length} rejected keys.`);
  } catch (error) {
    console.error('Error updating rejected keys:', error);
  }
}


updateRejected(); //so when it runs it doesnt have to wait for 10 minutes for the first hotset to arrive after the server restarts
const info=setInterval(updateRejected, 10 * 60 * 1000);
console.log(info);
