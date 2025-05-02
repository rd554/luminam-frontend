'use client';

import { useEffect, useState } from 'react';

interface Trophy {
  name: string;
  emoji: string;
  description: string;
}

const allTrophies: Trophy[] = [
  {
    name: 'Mindfulness Master',
    emoji: '🧘‍♂️',
    description: '7 days of journaling',
  },
  { name: 'Quest Seeker', emoji: '🗺️', description: '10 quests accepted' },
  {
    name: 'Emotional Explorer',
    emoji: '🌈',
    description: '5 different moods logged',
  },
  {
    name: 'Insightful Thinker',
    emoji: '🧠',
    description: '3 Insightful quiz grades',
  },
  { name: 'Consistency Champ', emoji: '⏳', description: '3-day quiz streak' },
  {
    name: 'Reflection Rookie',
    emoji: '✍️',
    description: 'First journal entry',
  },
  {
    name: 'First Quest Accepted',
    emoji: '🚀',
    description: 'Accepted your first quest',
  },
];

export default function TrophiesPage() {
  const [unlocked, setUnlocked] = useState<string[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('unlocked_trophies') || '{}');
    setUnlocked(Object.keys(data).filter((key) => data[key]));
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 p-6'>
      <h1 className='text-3xl font-bold text-orange-700 mb-6 text-center'>
        🏆 Your Trophies
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 max-w-4xl mx-auto'>
        {allTrophies.map((trophy) => {
          const isUnlocked = unlocked.includes(trophy.name);
          return (
            <div
              key={trophy.name}
              className={`rounded-xl p-5 shadow-md transition ${
                isUnlocked
                  ? 'bg-white text-gray-800 border-l-4 border-green-400'
                  : 'bg-gray-100 text-gray-400 opacity-60'
              }`}
            >
              <div className='text-4xl mb-2'>{trophy.emoji}</div>
              <h3 className='font-bold text-lg'>{trophy.name}</h3>
              <p className='text-sm'>{trophy.description}</p>
              {!isUnlocked && <p className='text-xs mt-1 italic'>Locked</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
