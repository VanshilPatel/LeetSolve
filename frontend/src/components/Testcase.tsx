import * as React from "react";

import { X } from "lucide-react";

interface TestCaseProps {
  testCase: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  isRemovable: boolean;
  result?: {
    stdout?: string;
    stderr?: string;
    compile_output?: string;
    error?: string;
  };
}

const TestCase: React.FC<TestCaseProps> = ({ testCase, onChange, onRemove, isRemovable, result }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={testCase}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter space-separated numbers (e.g., 1 2 3)"
          className="flex-1 p-2 border rounded"
        />
        {isRemovable && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-500 hover:text-red-500 rounded-full"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {result && (
        <div className="ml-4">
          <div className="text-sm font-medium">Result:</div>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {result.stdout || result.stderr || result.compile_output || result.error || "No output"}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestCase;