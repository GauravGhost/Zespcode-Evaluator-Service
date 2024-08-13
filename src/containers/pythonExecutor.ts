import CodeExecutorStrategy, { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";


class PythonExecutor implements CodeExecutorStrategy {
  async execute(code: string, inputTestCase: string): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      "bin/sh",
      "-c",
      runCommand,
    ]);

    // starting or booting the corresponding docker container
    await pythonDockerContainer.start();
    console.log("Started the docker container");
    const loggerStream = await pythonDockerContainer.logs({
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
      await pythonDockerContainer.remove();
    }
  }

  async fetchDecodedStream(
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

export default PythonExecutor;
