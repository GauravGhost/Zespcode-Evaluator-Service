import express, { Express } from "express";

import serverAdapter from "./config/bullBoardConfig";
import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
import apiRouter from "./routes";
import { submission_queue } from "./utils/constants";
import SubmissionWorker from "./workers/SubmissionWorker";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ui", serverAdapter.getRouter());
app.use("/api", apiRouter);

app.listen(serverConfig.PORT, async () => {
  logger.info("Server Started at " + serverConfig.PORT);
  logger.info(
    `BullBoard dashboard running on: http://localhost:${serverConfig.PORT}/ui`,
  );
  SubmissionWorker(submission_queue);
});
