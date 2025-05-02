'use client';

import { useEffect, useState } from 'react';

interface Quest {
  text: string;
  date: string;
  xp: number;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('daily_quests') || '[]');
    const structured = saved.map((text: string) => ({
      text,
      date: new Date().toLocaleDateString(),
      xp: 15,
    }));
    setQuests(structured);

    const completedQuests = JSON.parse(
      localStorage.getItem('completed_quests') || '[]'
    );
    setCompleted(completedQuests);
  }, []);

  const handleComplete = (questText: string) => {
    const updated = [...completed, questText];
    setCompleted(updated);
    localStorage.setItem('completed_quests', JSON.stringify(updated));
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl font-bold text-purple-700 mb-8 text-center'>
          🌟 Your Accepted Quests
        </h1>

        {quests.length === 0 ? (
          <p className='text-center text-gray-600 text-lg'>
            No quests accepted yet. Take today’s quiz to get started!
          </p>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
            {quests.map((quest, index) => {
              const isCompleted = completed.includes(quest.text);

              return (
                <div
                  key={index}
                  className={`transition-transform transform hover:scale-[1.02] bg-white rounded-xl shadow-md border-l-4 p-5 flex flex-col justify-between ${
                    isCompleted
                      ? 'border-gray-400 opacity-70'
                      : 'border-purple-500'
                  }`}
                >
                  <div className='min-h-[160px]'>
                    <h2
                      className={`text-lg font-semibold mb-2 ${
                        isCompleted
                          ? 'text-gray-500 line-through'
                          : 'text-purple-800'
                      } line-clamp-4`}
                    >
                      {quest.text}
                    </h2>
                    <p className='text-sm text-gray-500'>
                      Accepted on: {quest.date}
                    </p>
                  </div>

                  <div className='mt-4 flex justify-between items-center'>
                    <span
                      className={`inline-block text-xs font-semibold px-4 py-1 rounded-full shadow-md ${
                        isCompleted
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}
                    >
                      {isCompleted ? '✅ Completed' : `+${quest.xp} XP`}
                    </span>

                    {!isCompleted && (
                      <button
                        className='inline-block text-xs font-semibold bg-green-200 text-green-900 px-4 py-1 rounded-full shadow-md hover:bg-green-300 transition'
                        onClick={() => handleComplete(quest.text)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
