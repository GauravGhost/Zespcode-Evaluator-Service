import express, { Express } from "express";

import serverAdapter from "./config/bullBoardConfig";
import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
import runPython from "./containers/runPythonDocker";
import apiRouter from "./routes";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ui", serverAdapter.getRouter());
app.use("/api", apiRouter);

app.listen(serverConfig.PORT, async () => {
  logger.info("Server Started at " + serverConfig.PORT);
  const code = `print(input())
print(input())
  `;
  const inputCase = `100
  200`;
  await runPython(code, inputCase);
});
