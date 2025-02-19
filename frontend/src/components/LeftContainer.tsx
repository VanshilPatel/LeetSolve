import * as React from "react";

import ProblemDescription from './ProblemDescription';

const LeftContainer:React.FC = () => {
  return (
    <div className="w-1/2 p-4 border-r overflow-y-auto">
      <ProblemDescription />
      
    
    </div>
  );
};

export default LeftContainer;