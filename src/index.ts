import express, { Express } from "express";

import serverAdapter from "./config/bullBoardConfig";
import logger from "./config/loggerConfig";
import serverConfig from "./config/serverConfig";
import runJava from "./containers/runJavaDocker";
import apiRouter from "./routes";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ui", serverAdapter.getRouter());
app.use("/api", apiRouter);

app.listen(serverConfig.PORT, async () => {
  logger.info("Server Started at " + serverConfig.PORT);
  const code = `import java.util.*;
  public class Main {
    public static void main(String[] args){
      Scanner scn = new Scanner(System.in);
      int input = scn.nextInt();
      for(int i=0;i< input; i++){
        System.out.println(i + " ");
      }
    }
  }
  `;
  const inputCase = `10`;
  await runJava(code, inputCase);
});
