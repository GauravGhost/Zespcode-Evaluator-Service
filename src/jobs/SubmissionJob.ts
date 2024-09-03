import { Job } from "bullmq";

import { IJob } from "../types/bullMq.JobDefinition";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutorFactory";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;

  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    console.log("Handler of the job called");
    if (job) {
      console.log("job getting executed");
      const keys = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[keys].language;
      const code = this.payload[keys].code;
      const inputTestCase = this.payload[keys].inputCase;
      const outputTestCase = this.payload[keys].outputCase;
      const strategy = createExecutor(codeLanguage);
      console.log(code);
      if (strategy !== null) {
        const response: ExecutionResponse = await strategy.execute(
          code,
          inputTestCase,
          outputTestCase,
        );
        console.log("response", response);
        if (response.status === "SUCCESS") {
          console.log("code executed successfully");
          console.log("if response", response);
        } else {
          console.log("Something went wrong with code execution");
          console.log(response);
        }
      }
    }
  };

  failed = (job?: Job) => {
    if (job) {
      console.log("Job failed", job.id);
    }
  };
}
