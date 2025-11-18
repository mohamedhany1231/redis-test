import express from "express";
import redis from "./redis";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());
app.route("/:key").get(async (req, res) => {
  const { key } = req.params;
  const value = await redis.get(key);
  res.status(value ? 200 : 404).send({
    message: value ? "Key found" : "Key not found",
    value,
  });
});

app.post("/", async (req, res) => {
  const { key, value, ttl } = req.body;
  if (!key || !value) {
    return res.status(400).send("Key and value are required");
  }
  if (typeof key !== "string")
    return res.status(400).send("Key muse be string type");
  if (ttl && typeof ttl !== "number")
    return res.status(400).send("TTL must be number type");

  await redis.set(key, value, {
    expiration: {
      type: "PX",
      value: Date.now() + ttl,
    },
  });
  res.status(201).send({ key, value });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

redis
  .set("key", "value", {
    expiration: { type: "PX", value: Date.now() + 10 },
  })
  .then(() => {
    setTimeout(async () => {
      console.log(await redis.get("key"));
    }, 5000);
  });
