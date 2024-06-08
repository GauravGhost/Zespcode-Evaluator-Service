import { CPP_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";
import pullImage from "./pullImage";

async function runCpp(code: string, inputTestCase: string) {
  console.log("Initializing the new cpp container container");
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
  console.log("Stareted the docker container");

  const loggerStream = await cppDockerContainer.logs({
    stdout: true,
    stderr: true,
    follow: true,
  });
  // Attach events on the stream objects to start or stop reading.
  loggerStream.on("data", (chunk) => {
    rawLogBuffer.push(chunk);
  });

  const reponse = await new Promise((res) => {
    loggerStream.on("end", () => {
      const completeBuffer = Buffer.concat(rawLogBuffer);
      const decodedStream = decodeDockerStream(completeBuffer);
      console.log("result", decodedStream.stdout);
      res(decodedStream);
    });
  });

  // remove the container when done with it
  await cppDockerContainer.remove();
  return reponse;
}

export default runCpp;
