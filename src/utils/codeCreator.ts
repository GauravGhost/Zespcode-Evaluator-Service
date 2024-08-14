// This will append the code stubs to the user code.
export default function codeCreator(
  startCode: string,
  midCode: string,
  endCode: string,
): string {
  return `
    ${startCode}
     
    ${midCode}
    
    ${endCode}
  `;
}
