import express, { Express } from "express";

import serverAdapter from "./config/bullBoardConfig";
import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
import submissionQueueProducer from "./producers/submissionQueueProducer";
import apiRouter from "./routes";
import { SUBMISSION_QUEUE } from "./utils/constants";
import submissionWorker from "./workers/SubmissionWorker";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ui", serverAdapter.getRouter());
app.use("/api", apiRouter);

app.listen(serverConfig.PORT, async () => {
  logger.info("Server Started at " + serverConfig.PORT);
  const code = `#include<iostream>
  using namespace std;
  int main(){
  int x;
  cin >> x;
  cout << "value of x: " << x;
  cout << endl;
  return 0;
  }
  `;
  const inputCase = `10`;
  // await runCpp(code, inputCase);

  submissionWorker(SUBMISSION_QUEUE);
  submissionQueueProducer({
    "1233": { language: "cpp", inputCase: inputCase, code: code },
  });
});
