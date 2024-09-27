import CodeExecutorStrategy, {
  ExecutionResponse,
} from "../types/CodeExecutorStrategy";
import { isBooleanSame } from "../utils/booleanCompare";
import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

class CppExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string,
  ): Promise<ExecutionResponse> {
    console.log("whole code", code);
    console.log(outputTestCase);
    const rawLogBuffer: Buffer[] = [];
    const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | ./main`;
    await pullImage(CPP_IMAGE);
    const cppDockerContainer = await createContainer(CPP_IMAGE, [
      "bin/sh",
      "-c",
      runCommand,
    ]);
    // starting or booting the corresponding docker container
    await cppDockerContainer.start();
    console.log("Started the docker container");

    const loggerStream = await cppDockerContainer.logs({
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

      const trimedCodeResponse = codeResponse.trim();
      const trimmedOutputTestCase = outputTestCase.trim();

      if (
        codeResponse.trim() === outputTestCase.trim() ||
        isBooleanSame(trimedCodeResponse, trimmedOutputTestCase)
      ) {
        return { output: codeResponse, status: "SUCCESS" };
      } else {
        return { output: codeResponse, status: "WA" };
      }
    } catch (e) {
      if (e === "TLE") {
        await cppDockerContainer.kill();
        return { output: e as string, status: "TLE" };
      }
      return { output: e as string, status: "ERROR" };
    } finally {
      // remove the container when done with it
      await cppDockerContainer.remove();
    }
  }

  async fetchDecodedStream(
    // eslint-disable-next-line no-undef
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[],
  ): Promise<string> {
    return new Promise((res, rej) => {
      const timeout = setTimeout(() => {
        rej("TLE");
      }, 2000);

      loggerStream.on("end", () => {
        // This callback executes when the stream ends.
        clearTimeout(timeout);
        const completeBuffer = Buffer.concat(rawLogBuffer);
        const decodedStream = decodeDockerStream(completeBuffer);
        if (decodedStream.stderr) {
          rej(decodedStream.stderr);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default CppExecutor;
