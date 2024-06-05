import DockerStreamOutput from "../types/dockerStreamOutput";
import { HEADER_SIZE } from "../utils/constants";

function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
  let offset = 0; // this variable keep track of the current position in the buffer while parsing.

  // The output that will store the accumulated stdout and stderr output as string.
  const output: DockerStreamOutput = { stdout: "", stderr: "" };
  // Loop until offset reaches end of the buffer
  while (offset < buffer.length) {
    // Chennel is read from buffer and has value of type stream.
    const channel = buffer[offset];

    // This len variable hold the length of the value
    // We will read this variable on an offset of 4 bytes from the start of the chunks.
    const len = buffer.readUInt32BE(offset + 4);

    // As we have read the header, we can move forward to the value of the chunk.
    offset += HEADER_SIZE;
    if (channel === 1) {
      // stdout stream
      output.stdout += buffer.toString("utf-8", offset, offset + len);
    } else if (channel === 2) {
      // stderr stream
      output.stderr += buffer.toString("utf-8", offset, offset + len);
    }
    offset += len;
  }
  return output;
}

export default decodeDockerStream;
