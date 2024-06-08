import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runPython(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > test.py && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | python3 test.py`;
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "bin/sh",
    "-c",
    runCommand,
  ]);

  // starting or booting the corresponding docker container
  await pythonDockerContainer.start();
  console.log("Stareted the docker container");
  const loggerStream = await pythonDockerContainer.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });

  // Attach events on the stream objects to start or stop reading.
  loggerStream.on("data", (chunk) => {
    rawLogBuffer.push(chunk);
  });

  await new Promise((res) => {
    loggerStream.on("end", () => {
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream.stdout);
      res(decodedStream);
    });
  });
  // remove the container when done with it
  await pythonDockerContainer.remove();
  // console.log(loggerStream);
  return pythonDockerContainer;
}

export default runPython;
