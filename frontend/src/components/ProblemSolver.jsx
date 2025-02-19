import React, { useState } from 'react';
import LeftContainer from './LeftContainer';
import RightContainer from './RightContainer.jsx';

const ProblemSolver = () => {
  const [testCases, setTestCases] = useState([{ id: 1, value: "1 2 3" }]);
  const [testResults, setTestResults] = useState({});
  const [status, setStatus] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleAddTestCase = () => {
    const newId = Math.max(...testCases.map(tc => tc.id), 0) + 1;
    setTestCases([...testCases, { id: newId, value: "" }]);
  };

  const handleRemoveTestCase = (id) => {
    setTestCases(testCases.filter(tc => tc.id !== id));
    setTestResults(prev => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleTestCaseChange = (id, value) => {
    setTestCases(testCases.map(tc => 
      tc.id === id ? { ...tc, value } : tc
    ));
  };

  const validateTestCases = () => {
    return testCases.every(tc => {
      const numbers = tc.value.trim().split(/\s+/).map(Number);
      return numbers.length > 0 && numbers.every(n => !isNaN(n));
    });
  };

  const handleSubmit = async (code, languageId) => {
    setIsRunning(true);
    setStatus("Running test cases...");
    setTestResults({});

    try {
      if (!validateTestCases()) {
        throw new Error("Invalid test cases. Please check your input.");
      }

      const results = {};
      for (const testCase of testCases) {
        try {
          const response = await fetch('http://localhost:3000/submission', {
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

          const result = await response.json();
          results[testCase.id] = result;
        } catch (error) {
          results[testCase.id] = { error: error.message };
        }
      }

      setTestResults(results);
      setStatus("All test cases completed");
    } catch (error) {
      setStatus(`Error: ${error.message}`);
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