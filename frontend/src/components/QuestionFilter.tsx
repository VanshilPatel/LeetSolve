import React, { useState } from 'react';
import { ChevronDown, Shuffle } from 'lucide-react';

const QuestionFilters = ({ filters, onFilterChange }) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDifficultyOpen, setIsDifficultyOpen] = useState(false);

  const handleRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * 20) + 1;
    window.location.href = `/problem/${randomIndex}`;
  };

  const handleSearch = (e) => {
    e.preventDefault();
   
  };

  return (
    <div className="flex items-center gap-6 p-6">
     
      <div className="relative">
        <button
          onClick={() => setIsDifficultyOpen(!isDifficultyOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
        >
          <span>{filters.difficulty || 'Difficulty'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        
        {isDifficultyOpen && (
          <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => {
                onFilterChange({ ...filters, difficulty: '' });
                setIsDifficultyOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              All
            </button>
            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => {
                  onFilterChange({ ...filters, difficulty });
                  setIsDifficultyOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                {difficulty}
              </button>
            ))}
          </div>
        )}
      </div>

    
      <div className="relative">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
        >
          <span>{filters.status || 'Status'}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        
        {isStatusOpen && (
          <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
            <button
              onClick={() => {
                onFilterChange({ ...filters, status: '' });
                setIsStatusOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50"
            >
              All
            </button>
            {['Solved', 'Unsolved'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  onFilterChange({ ...filters, status });
                  setIsStatusOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50"
              >
                {status}
              </button>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          placeholder="Search questions"
          className="w-full px-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </form>

      <button
        onClick={handleRandomQuestion}
        className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
      >
        <Shuffle className="h-6 w-6" />
        <span>Pick One</span>
      </button>
    </div>
  );
};

export default QuestionFilters;