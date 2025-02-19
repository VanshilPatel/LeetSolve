import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProblemDescription = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await fetch(`http://localhost:3000/problem/${id}`);
        if (!response.ok) {
          throw new Error('Problem not found');
        }
        const data = await response.json();
        setProblem(data.problem);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Problem not found</div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-yellow-500';
      case 'Hard':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="problem-container">
    <h1 className="mt-7 mb-2 text-2xl font-bold">{problem.id}.   {problem.title}</h1>
    
    <span
    className={`text-sm border rounded-md p-1 font-semibold
    ${problem.difficulty === 'Easy' ? 'bg-green-500' : 
    problem.difficulty === 'Medium' ? 'bg-yellow-400' : 
    problem.difficulty === 'Hard' ? 'bg-red-400' : 'bg-gray-300'}
    `}
    >
    {problem.difficulty}
    </span>
    
    
    <h2 className="mt-2 font-normal">{problem.description}</h2>

    <div className="mt-8">
        <h3 className="text-base font-medium mb-4">Sample Test Cases:</h3>
        {problem.testcase.map((t, index) => {
  const [label, value] = t.split(": "); // Splitting "Input: 1 2 3" into ["Input", "1 2 3"]

  return (
    <div key={index} className="bg-gray-100 p-4 rounded mb-2">
      <div className="font-medium">{label}:</div>
      <div className="text-gray-600">{value}</div>
    </div>
  );
})}

<h3 className="text-base font-medium mb-4">Constraints:</h3>

    <div className="bg-gray-100 p-1 rounded h-40">
   
    {problem.constraints.map((constraint)=>{
      return (
            <p className="text-gray-700 p-1">{constraint}</p>
      )
    })}
     </div>

   



      </div>
    </div>
  );
};

export default ProblemDescription;