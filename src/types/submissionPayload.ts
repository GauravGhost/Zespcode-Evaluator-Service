import { TestCases } from "./testCases";

export type SubmissionPayload = {
  code: string;
  language: string;
  testCases: TestCases;
  userId: string;
  submissionId: string;
};
