import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const languageOptions = [
  { value: 'cpp', label: 'C++', id: 52 },
  { value: 'javascript', label: 'JavaScript', id: 63 },
  { value: 'java', label: 'Java', id: 62 },
  { value: 'python', label: 'Python', id: 71 }
];


const getStarterCode = (language) => {
  switch (language) {
    case 'python':
      return `# Read space-separated integers from input\nnums = list(map(int, input().split()))\n\n# Calculate sum\ntotal = sum(nums)\n\n# Print result\nprint(total)`;
    case 'cpp':
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n    int num, sum = 0;\n    \n    // Read integers until end of input\n    while (cin >> num) {\n        sum += num;\n    }\n    \n    cout << sum << endl;\n    return 0;\n}`;
    case 'java':
      return `import java.util.Scanner;\n\nclass Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        String[] numbers = scanner.nextLine().split(" ");\n        \n        int sum = 0;\n        for (String num : numbers) {\n            sum += Integer.parseInt(num);\n        }\n        \n        System.out.println(sum);\n    }\n}`;
    case 'javascript':
      return `// Read input from stdin\nconst input = require('readline').createInterface({\n    input: process.stdin,\n    output: process.stdout\n});\n\ninput.on('line', (line) => {\n    const numbers = line.split(' ').map(Number);\n    const sum = numbers.reduce((a, b) => a + b, 0);\n    console.log(sum);\n    input.close();\n});`;
    default:
      return '';
  }
};

export const CodeWriter = () => {
  const [language, setLanguage] = useState(languageOptions[0].value);
  const [languageId, setLanguageId] = useState(languageOptions[0].id);
  const [editorValue, setEditorValue] = useState(getStarterCode(languageOptions[0].value));
  const [testCase, setTestCase] = useState("1 2 3");
  const [status, setStatus] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLanguageChange = (e) => {
    const selectedValue = e.target.value;
    const selectedLanguage = languageOptions.find(option => option.value === selectedValue);
    setLanguage(selectedValue);
    setLanguageId(selectedLanguage.id);
    setEditorValue(getStarterCode(selectedValue));
  };

  const handleEditorChange = (value) => {
    setEditorValue(value || "");
  };

  const handleTestCaseChange = (e) => {
    setTestCase(e.target.value);
  };

  const getSubmissionResult = async (token) => {
    try {
      const response = await axios.get(`http://localhost:3000/submission/${token}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching result: ${error.message}`);
    }
  };

  const pollSubmissionResult = async (token) => {
    const maxAttempts = 10;
    const interval = 1000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const result = await getSubmissionResult(token);
      
      if (result.status.id >= 3) {
        return result;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
      attempts++;
    }

    throw new Error('Submission processing timeout');
  };

  const handleRunClick = async () => {
    try {
      setIsLoading(true);
      setStatus("Compiling...");
      setOutput("");
      
      if (!editorValue.trim()) {
        setStatus("Error: Please enter some code");
        return;
      }

      // Validate test case input
      const numbers = testCase.trim().split(/\s+/).map(Number);
      if (numbers.some(isNaN)) {
        setStatus("Error: Test case must contain valid numbers");
        return;
      }

      const submitResponse = await axios.post('http://localhost:3000/submission', {
        code: editorValue,
        language_id: languageId,
        input: testCase
      });

      setStatus("Running...");
      
      const result = await pollSubmissionResult(submitResponse.data.token);
      
      if (result.compile_output) {
        setOutput(result.compile_output);
        setStatus("Compilation Error");
      } else if (result.stderr) {
        setOutput(result.stderr);
        setStatus("Runtime Error");
      } else {
        setOutput(result.stdout || "No output");
        setStatus("Completed");
      }

    } catch (error) {
      console.error('Execution error:', error);
      setStatus(`Error: ${error.message}`);
      setOutput("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-4 flex items-center gap-2">
        <span className="font-medium">Language:</span>
        <select 
          value={language} 
          onChange={handleLanguageChange}
          className="p-2 border rounded"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <Editor
          height="40vh"
          theme="vs-dark"
          language={language}
          value={editorValue}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
        />

        <div className="space-y-2">
          <div className="font-medium">Test Case Input:</div>
          <input
            type="text"
            value={testCase}
            onChange={handleTestCaseChange}
            placeholder="Enter space-separated numbers (e.g., 1 2 3)"
            className="w-full p-2 border rounded"
          />
        
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleRunClick}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? 'Running...' : 'Compile & Run'}
          </button>
          <div className="text-sm">
            {status}
          </div>
        </div>

        {output && (
          <div className="mt-4">
            <div className="font-medium mb-2">Output:</div>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
              {output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeWriter;