import submissionQueue from "../queues/submissionQueue";
import { SUBMISSION_JOB } from "../utils/constants";

export default async function (payload: Record<string, unknown>) {
  await submissionQueue.add(SUBMISSION_JOB, payload);
  console.log("Successfully added a new submission job!");
}
