import { useState, useEffect } from 'react';
import { CheckCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from "react";


interface Problem {
  id: number;
  title: string;
  acceptance: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status?: 'Solved' | 'Unsolved';
}

interface QuestionsTableProps {
  data: Problem[];
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({ data }) => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [isPerPageOpen, setIsPerPageOpen] = useState<boolean>(false);

  useEffect(() => {
    setProblems(data || []);
  }, [data]);

  const totalPages = Math.ceil(problems.length / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentProblems = problems.slice(startIndex, endIndex);

  const getDifficultyColor = (difficulty: 'Easy' | 'Medium' | 'Hard'): string => {
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
    <div className="flex justify-between p-6 gap-6">
      <div className="flex-1">
        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acceptance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProblems.map((problem) => (
                <tr key={problem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {problem.status === "Solved" && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={`/problem/${problem.id}`}
                      className="text-gray-900 hover:text-blue-600"
                    >
                      {problem.id}. {problem.title}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {problem.acceptance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getDifficultyColor(problem.difficulty)}>
                      {problem.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="relative">
            <button
              onClick={() => setIsPerPageOpen(!isPerPageOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50"
            >
              {perPage} / page
              <ChevronDown className="h-4 w-4" />
            </button>
            
            {isPerPageOpen && (
              <div className="absolute mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setPerPage(num);
                      setIsPerPageOpen(false);
                      setPage(1);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  >
                    {num} / page
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    page === i + 1
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionsTable;