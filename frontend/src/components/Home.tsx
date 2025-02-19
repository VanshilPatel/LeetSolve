import { useState, useEffect } from 'react';
import QuestionFilters from './QuestionFilter';
import TableDiv from './TableDiv';
import * as React from "react";




interface Problem {
  id: number;
  title: string;
  acceptance: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status?: 'Solved' | 'Unsolved';
}

interface Filters {
  difficulty: string;
  status: string;
  search: string;
}

const Home: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    difficulty: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    const fetchProblems = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/problems`);
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data: { problems: Problem[] } = await response.json();
        setProblems(data.problems);
        setFilteredProblems(data.problems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  useEffect(() => {
    const applyFilters = (): void => {
      const filtered = problems.filter((problem: Problem) => {
        const matchesDifficulty = !filters.difficulty || 
          problem.difficulty.toLowerCase() === filters.difficulty.toLowerCase();
        const matchesStatus = !filters.status || 
          problem.status?.toLowerCase() === filters.status.toLowerCase();
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