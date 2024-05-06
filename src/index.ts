import express, { Express } from "express";

import serverAdapter from "./config/bullBoardConfig";
import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
// import sampleQueueProducer from "./producers/sampleQueueProducer";
import apiRouter from "./routes";
// import SampleWorker from "./workers/SampleWorker";

const app: Express = express();

app.use("/ui", serverAdapter.getRouter());
app.use("/api", apiRouter);

app.listen(serverConfig.PORT, async () => {
  logger.info("Server Started at " + serverConfig.PORT);

  // SampleWorker("SampleQueue");
  // await sampleQueueProducer(
  //   "SampleJob",
  //   {
  //     name: "gyanendra kumar",
  //     company: "wise neosco",
  //   },
  //   10,
  // );
  // await sampleQueueProducer(
  //   "SampleJob",
  //   {
  //     name: "rajnish kumar",
  //     company: "wise neosco",
  //   },
  //   20,
  // );
});
