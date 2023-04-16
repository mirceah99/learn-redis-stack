// lesson 1 redis cashing 
const {redis} = await import("./redisConnection.js");
await redis.set("mircea", "hanghiuc - 123")
console.log(await redis.get("mircea"))

await redis.lPush('numbers', "1");
await redis.lPush('numbers', "2");
await redis.lPush('numbers', "3");

console.log(await redis.rPop("numbers"))
console.log(await redis.rPop("numbers"))
console.log(await redis.rPop("numbers"))
console.log(await redis.rPop("numbers"))

await redis.disconnect();