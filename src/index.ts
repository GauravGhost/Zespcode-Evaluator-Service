import express, { Express } from "express";
import serverConfig from "./config/serverConfig";

const app: Express = express();

app.get("/", (_req, res) => {
  res.send("server is live");
});

app.listen(serverConfig.PORT, () => {
  console.log("Server started at 5502");
});
