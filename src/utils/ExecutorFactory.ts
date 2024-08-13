import PythonExecutor from "../containers/pythonExecutor";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";
import CppExecutor from "../containers/cppExecutor";
import JavaExecutor from "../containers/javaExecutor";

function createExecutor(codeLanguage: string): CodeExecutorStrategy | null {
  if (codeLanguage === "PYTHON") {
    return new PythonExecutor();
  } else if (codeLanguage === "CPP") {
    return new CppExecutor();
  } else if (codeLanguage === "JAVA") {
    return new JavaExecutor();
  } else {
    return null;
  }
}

export default createExecutor;
