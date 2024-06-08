import { JAVA_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";

async function runJava(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  const runCommand = `echo '${code.replace(/'/g, `'\\"`)}' > Main.java && javac Main.java && echo '${inputTestCase.replace(/'/g, `'\\"`)}' | java Main`;
  const javaDockerContainer = await createContainer(JAVA_IMAGE, [
    "bin/sh",
    "-c",
    runCommand,
  ]);

  // starting or booting the corresponding docker container
  await javaDockerContainer.start();
  console.log("Stareted the docker container");
  const loggerStream = await javaDockerContainer.logs({
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
      console.log("result", decodedStream.stdout);
      res(decodedStream);
    });
  });
  // remove the container when done with it
  await javaDockerContainer.remove();
  // console.log(loggerStream);
  return javaDockerContainer;
}

export default runJava;
