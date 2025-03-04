import * as React from "react";

import  CodeWriter  from './CodeWriter';
import TestCase from './Testcase';

interface TestCase {
  id: number;
  value: string;
}

interface TestResult {
  error?: string;
  output?: string;
  status?: string;

}

interface TestResults {
  [key: number]: TestResult;
}

interface RightContainerProps {
  testCases: TestCase[];
  testResults: TestResults;
  status: string;
  onAddTestCase: () => void;
  onRemoveTestCase: (id: number) => void;
  onTestCaseChange: (id: number, value: string) => void;
  onSubmit: (code: string, languageId: number) => Promise<void>;
}

const RightContainer: React.FC<RightContainerProps> = ({ 

  status, 
  onSubmit 
}) => {
  return (
    <div className="w-1/2 p-4 flex flex-col">
      <CodeWriter onSubmit={onSubmit} />
    
      {status && (
        <div className="mt-4 text-sm text-gray-600">
          {status}
        </div>
      )}
    </div>
  );
};

export default RightContainer;