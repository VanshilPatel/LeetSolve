import React, { useState, useEffect } from 'react';
import QuestionFilters from './QuestionFilter';
import TableDiv from './TableDiv';

const Home = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    difficulty: '',
    status: '',
    search: ''
  });

  // Fetch problems only once when component mounts
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/problems`);
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        setProblems(data.problems);
        setFilteredProblems(data.problems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  // Apply filters whenever filters state changes
  useEffect(() => {
    const applyFilters = () => {
      const filtered = problems.filter(problem => {
        const matchesDifficulty = !filters.difficulty || 
          problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
        const matchesStatus = !filters.status || 
          problem.status.toLowerCase() === filters.status.toLowerCase();
        const matchesSearch = !filters.search || 
          problem.title.toLowerCase().includes(filters.search.toLowerCase());
        
        return matchesDifficulty && matchesStatus && matchesSearch;
      });
      
      setFilteredProblems(filtered);
    };

    applyFilters();
  }, [filters, problems]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <QuestionFilters
        filters={filters}
        onFilterChange={setFilters}
      />
      <TableDiv 
        data={filteredProblems}
      />
    </div>
  );
};

export default Home;