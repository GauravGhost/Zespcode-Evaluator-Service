import { Job } from "bullmq";

import runCpp from "../containers/runCpp";
import { IJob } from "../types/bullMq.JobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";

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
      const keys = Object.keys(this.payload)[0];
      if (this.payload[keys].language === "cpp") {
        const response = await runCpp(
          this.payload[keys].code,
          this.payload[keys].inputCase,
        );
        console.log(response);
      }
    }
  };

  failed = (job?: Job) => {
    if (job) {
      console.log("Job failed", job.id);
    }
  };
}
