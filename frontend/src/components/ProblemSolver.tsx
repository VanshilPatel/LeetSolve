import { useState } from 'react';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer';
import * as React from "react";


interface TestCase {
  id: number;
  value: string;
}

interface TestResult {
  error?: string;
  output?: string;
  status?: string;
  // Add other result properties based on your API response
}

interface TestResults {
  [key: number]: TestResult;
}

interface SubmissionResponse {
  // Define the shape of your API response
  error?: string;
  output?: string;
  status?: string;
}

const ProblemSolver: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([{ id: 1, value: "1 2 3" }]);
  const [testResults, setTestResults] = useState<TestResults>({});
  const [status, setStatus] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleAddTestCase = (): void => {
    const newId = Math.max(...testCases.map(tc => tc.id), 0) + 1;
    setTestCases([...testCases, { id: newId, value: "" }]);
  };

  const handleRemoveTestCase = (id: number): void => {
    setTestCases(testCases.filter(tc => tc.id !== id));
    setTestResults(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleTestCaseChange = (id: number, value: string): void => {
    setTestCases(testCases.map(tc => 
      tc.id === id ? { ...tc, value } : tc
    ));
  };

  const validateTestCases = (): boolean => {
    return testCases.every(tc => {
      const numbers = tc.value.trim().split(/\s+/).map(Number);
      return numbers.length > 0 && numbers.every(n => !isNaN(n));
    });
  };

  const handleSubmit = async (code: string, languageId: number): Promise<void> => {
    setIsRunning(true);
    setStatus("Running test cases...");
    setTestResults({});

    try {
      if (!validateTestCases()) {
        throw new Error("Invalid test cases. Please check your input.");
      }

      const results: TestResults = {};
      for (const testCase of testCases) {
        try {
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/submission/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              code,
              language_id: languageId,
              input: testCase.value
            })
          });

          const result: SubmissionResponse = await response.json();
          results[testCase.id] = result;
        } catch (error) {
          results[testCase.id] = { 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          };
        }
      }

      setTestResults(results);
      setStatus("All test cases completed");
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex h-screen">
      <LeftContainer />
      <RightContainer
        testCases={testCases}
        testResults={testResults}
        status={status}
        onAddTestCase={handleAddTestCase}
        onRemoveTestCase={handleRemoveTestCase}
        onTestCaseChange={handleTestCaseChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProblemSolver;