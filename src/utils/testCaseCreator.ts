import { testCase, TestCases } from "../types/testCases";

export const inputCaseCreator = (inputArray: string[]) => {
  const length = inputArray.length;
  const inputString = `${length}\n`;
  inputArray.forEach((input) => {
    inputString.concat(`${input}\n`);
  });
};

export const outputCaseCreator = (outputArray: string[]) => {
  const outputString = "";
  outputArray.forEach((output) => {
    outputString.concat(`${output}\n`);
  });
};

export const testCaseCreator = (
  testCases: TestCases,
): { inputTestCase: string; outputTestCase: string } => {
  const length = testCases.length;
  let inputString = `${length}\n`;
  let outputString = "";
  testCases.forEach((testCase: testCase) => {
    inputString += `${testCase.input}\n`; // Use += to concatenate
    outputString += `${testCase.output}\n`;
  });

  return {
    inputTestCase: inputString,
    outputTestCase: outputString,
  };
};
