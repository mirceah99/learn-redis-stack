const { redis } = await import("./redisConnection.js");
console.log("xRead:", redis.xRead);
setTimeout(async () => {
  const messages = await redis.xRead(
    "STREAMS",
    { key: "stream1", id: "$" },
    { BLOCK: 1000 }
  );
  console.log(messages);
}, 2000);

// process.on("SIGINT", function () {
//   console.log("Ctrl-C...");
//   process.exit(2);
// });
// process.on("exit", async () => {
//   console.log("Closing redis connection!!!");
//   await redis.disconnect();
//   console.log("Connection closed!");
// });
// await redis.disconnect();
