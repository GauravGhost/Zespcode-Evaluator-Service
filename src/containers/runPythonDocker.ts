// import Dockerode from "dockerode";

// import { TestCases } from "../types/testCases";
import { PYTHON_IMAGE } from "../utils/constants";
import createContainer from "./containerFactory";

async function runPython(code: string) {
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    "python3",
    "-c",
    code,
    " stty -echo",
  ]);

  // starting or booting the corresponding docker container
  await pythonDockerContainer.start();
  console.log("Stareted the docker container");
  return pythonDockerContainer;
}

export default runPython;
