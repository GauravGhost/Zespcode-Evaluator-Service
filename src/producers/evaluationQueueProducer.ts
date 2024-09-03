import evaluationQueue from "../queues/evaluationQueue";
import { EVALUATION_JOB } from "../utils/constants";

export default async function (payload: Record<string, unknown>) {
  await evaluationQueue.add(EVALUATION_JOB, payload);
  console.log("Successfully added a new submission job!");
}
