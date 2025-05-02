'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const allTrophies = [
  {
    id: '7day_streak',
    title: '🔥 7-Day Streak',
    description: 'Journal for 7 days in a row!',
  },
  {
    id: 'mindfulness_master',
    title: '🧘 Mindfulness Mastery',
    description: 'Reach 100% Mindfulness skill.',
  },
  {
    id: '30_reflections',
    title: '🌸 30 Reflections',
    description: 'Complete 30 reflections.',
  },
];

export default function AchievementsPage() {
  const [unlockedTrophies, setUnlockedTrophies] = useState<string[]>([]);
  const [newTrophy, setNewTrophy] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('luminam_trophies');
    if (saved) {
      setUnlockedTrophies(JSON.parse(saved));
    }
  }, []);

  function unlockTrophy(id: string) {
    if (!unlockedTrophies.includes(id)) {
      const updated = [...unlockedTrophies, id];
      setUnlockedTrophies(updated);
      localStorage.setItem('luminam_trophies', JSON.stringify(updated));
      setNewTrophy(id);

      setTimeout(() => {
        setNewTrophy(null);
      }, 4000);
    }
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100 p-8'>
      <h1 className='text-4xl font-bold text-center text-pink-700 mb-10'>
        🏆 Achievements Gallery
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
        {allTrophies.map((trophy) => {
          const unlocked = unlockedTrophies.includes(trophy.id);
          return (
            <motion.div
              key={trophy.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-lg shadow-lg text-center ${
                unlocked ? 'bg-yellow-200' : 'bg-gray-300'
              }`}
            >
              <h2 className='text-2xl'>
                {unlocked ? trophy.title : '🔒 Locked'}
              </h2>
              <p className='mt-2 text-sm text-gray-700'>{trophy.description}</p>

              {!unlocked && (
                <button
                  className='mt-4 px-4 py-2 bg-pink-400 text-white rounded-full hover:bg-pink-500 text-sm'
                  onClick={() => unlockTrophy(trophy.id)}
                >
                  Simulate Unlock
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Trophy Celebration */}
      <AnimatePresence>
        {newTrophy && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className='absolute top-20 left-1/2 transform -translate-x-1/2 bg-yellow-200 text-yellow-900 font-bold py-4 px-8 rounded-full shadow-lg text-lg'
          >
            🎉 New Trophy Unlocked!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
