import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use("/api", apiRouter);

app.listen(serverConfig.PORT, async () => {
  console.log("Server started at 5502");
  SampleWorker("SampleQueue");
  await sampleQueueProducer("SampleJob", {
    name: "gyanendra kumar",
    company: "wise neosco",
  });
});
