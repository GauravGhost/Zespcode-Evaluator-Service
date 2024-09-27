import { Job } from "bullmq";

import evaluationQueueProducer from "../producers/evaluationQueueProducer";
import { IJob } from "../types/bullMq.JobDefinition";
import { ExecutionResponse } from "../types/CodeExecutorStrategy";
import { SubmissionPayload } from "../types/submissionPayload";
import createExecutor from "../utils/ExecutorFactory";
import { testCaseCreator } from "../utils/testCaseCreator";

export default class SubmissionJob implements IJob {
  name: string;
  payload: Record<string, SubmissionPayload>;

  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }

  handle = async (job?: Job) => {
    if (job) {
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language;
      const code = this.payload[key].code;
      const testCases = this.payload[key].testCases;
      const strategy = createExecutor(codeLanguage);

      const { inputTestCase, outputTestCase } = testCaseCreator(testCases);

      console.log(
        "test cases formatter ",
        inputTestCase,
        "---",
        outputTestCase,
      );

      if (strategy !== null) {
        const response: ExecutionResponse = await strategy.execute(
          code,
          inputTestCase,
          outputTestCase,
        );
        evaluationQueueProducer({
          response,
          userId: this.payload[key].userId,
          submissionId: this.payload[key].submissionId,
        });
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
