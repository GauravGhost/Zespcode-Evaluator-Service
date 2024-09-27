export const isBooleanSame = (response: string, output: string) => {
  const res = response.split("\n");
  const modifiedResponse = res.map((bool) => (bool === "1" ? "true" : "false"));
  return modifiedResponse.join("\n") == output;
};
