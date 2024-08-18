export default interface CodeExecutorStrategy {
  // eslint-disable-next-line no-unused-vars
  execute(
    // eslint-disable-next-line no-unused-vars
    code: string,
    // eslint-disable-next-line no-unused-vars
    inputTestCase: string,
    // eslint-disable-next-line no-unused-vars
    outputTestCase: string,
  ): Promise<ExecutionResponse>;
  // eslint-disable-next-line semi
}

export type ExecutionResponse = { output: string; status: string };
