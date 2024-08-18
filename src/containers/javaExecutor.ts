import CodeExecutorStrategy, {
  ExecutionResponse,
} from "../types/CodeExecutorStrategy";
import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

class JavaExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    console.log("output test case ", outputTestCase);
    console.log("Java Executor called");
    const rawLogBuffer: Buffer[] = [];
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
    await pullImage(JAVA_IMAGE);
    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
      "bin/sh",
      "-c",
      runCommand,
    ]);
    console.log("Java Executor called");
    // starting or booting the corresponding docker container
    await javaDockerContainer.start();
    console.log("Java Executor called");
    console.log("Started the docker container");
    const loggerStream = await javaDockerContainer.logs({
      stdout: true,
      stderr: true,
      follow: true,
    });
    // Attach events on the stream objects to start or stop reading.
    loggerStream.on("data", (chunk) => {
      rawLogBuffer.push(chunk);
    });

    try {
      const codeResponse: string = await this.fetchDecodedStream(
        loggerStream,
        rawLogBuffer,
      );
      return { output: codeResponse, status: "COMPLETED" };
    } catch (e) {
      return { output: e as string, status: "ERROR" };
    } finally {
      // remove the container when done with it
      await javaDockerContainer.remove();
    }
  }

  async fetchDecodedStream(
    // eslint-disable-next-line no-undef
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[],
  ): Promise<string> {
    return new Promise((res, rej) => {
      loggerStream.on("end", () => {
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream.stdout);
        if (decodedStream.stderr) {
          rej(decodedStream.stderr);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default JavaExecutor;
