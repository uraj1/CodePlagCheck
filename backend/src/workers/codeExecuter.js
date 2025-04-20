import { workerData, parentPort } from 'worker_threads';
import { VM } from 'vm2';

const executeJavaScript = (code) => {
  const vm = new VM({
    timeout: 3000,
    sandbox: {
      console: {
        log: (...args) => output.push(args.join(' ')),
        error: (...args) => errors.push(args.join(' ')),
      }
    }
  });
  
  const output = [];
  const errors = [];
  
  try {
    vm.run(code);
    return { output, errors };
  } catch (error) {
    errors.push(error.message);
    return { output, errors };
  }
};

const executePython = (code) => {
  // For demo, we'll just return that Python execution is not supported
  return {
    output: [],
    errors: ['Python execution is not supported in this environment']
  };
};

try {
  const { code, language } = workerData;
  let result;
  
  switch (language) {
    case 'javascript':
    case 'typescript':
      result = executeJavaScript(code);
      break;
    case 'python':
      result = executePython(code);
      break;
    default:
      result = {
        output: [],
        errors: [`Execution not supported for language: ${language}`]
      };
  }
  
  parentPort?.postMessage(result);
} catch (error) {
  parentPort?.postMessage({
    output: [],
    errors: [error.message]
  });
}