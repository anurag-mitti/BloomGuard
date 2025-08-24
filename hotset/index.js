const inmem = require("../bloomfilter");
const getRejected = require("../redis_gateway/getRejected");

async function updateRejected() {
  try {
    const list = await getRejected();
    list.forEach((value) => {
      if (typeof value === 'string') {
        inmem.add(value);  // Added each string individually, was getting type error
      } else {
        console.warn('Invalid type detected:', typeof value, value);
      }
    });
    console.log(`Updated Bloom filter with ${list.length} rejected keys.`);
  } catch (error) {
    console.error('Error updating rejected keys:', error);
  }
}


updateRejected(); //so when it runs it doesnt have to wait for 10 minutes for the first hotset to arrive after the server restarts
const info=setInterval(updateRejected, 10 * 60 * 1000);
console.log(info);
