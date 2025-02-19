import React from 'react';
import { CodeWriter } from './CodeWriter';
import TestCase from './TestCase';

const RightContainer = ({ 
  testCases, 
  testResults, 
  status, 
  onAddTestCase, 
  onRemoveTestCase, 
  onTestCaseChange, 
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