import { Job } from "bullmq";

export interface IJob {
  name: string;
  payload?: Record<string, unknown>;
  // eslint-disable-next-line no-unused-vars
  handle: (job?: Job) => void;
  // eslint-disable-next-line no-unused-vars
  failed: (job?: Job) => void;
}
