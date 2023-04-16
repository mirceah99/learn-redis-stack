const { redis } = await import("./redisConnection.js");
const data = await (await import("./get-data.js")).data;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// console.log(data);
redis.xAdd();
for (let i = 0; i < data.length; i++) {
  const row = data[i];
  console.log(Object.entries(row));
  //   row.__secret = Object.entries(row);
  for (const [key, value] of Object.entries(row)) {
    console.log(`${key} ${value}`);
  }
  const ans = await redis.xAdd("stream1", "*", row);
  console.log(ans);
  await sleep(500);
  if (i > 10) break;
}

await redis.disconnect();
