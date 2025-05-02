'use client';

import { useEffect, useState } from 'react';

interface ReflectionHistory {
  [date: string]: {
    entry: string;
    reflection: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<ReflectionHistory>({});

  useEffect(() => {
    async function fetchHistory() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reflection/history/`
      );
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      } else {
        console.error('Failed to fetch reflection history.');
      }
    }

    fetchHistory();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-8'>
      <h1 className='text-4xl font-bold text-center text-indigo-700 mb-10'>
        📜 Reflection History
      </h1>

      <div className='space-y-6 max-w-4xl mx-auto'>
        {Object.entries(history).length === 0 && (
          <p className='text-center text-gray-600'>No reflections saved yet.</p>
        )}

        {Object.entries(history).map(([date, { entry, reflection }]) => (
          <div
            key={date}
            className='bg-white rounded-lg shadow-lg p-6 transition hover:shadow-2xl'
          >
            <h2 className='text-xl font-bold text-indigo-600'>
              {new Date(date).toDateString()}
            </h2>
            <details className='mt-4 cursor-pointer'>
              <summary className='font-semibold text-gray-800 hover:underline'>
                View Journal & Reflection
              </summary>
              <div className='mt-2 space-y-2'>
                <div>
                  <h3 className='text-md font-bold text-gray-700'>
                    📝 Journal Entry:
                  </h3>
                  <p className='text-gray-700'>{entry}</p>
                </div>
                <div>
                  <h3 className='text-md font-bold text-gray-700 mt-2'>
                    💬 AI Reflection:
                  </h3>
                  <p className='text-gray-700'>{reflection}</p>
                </div>
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
