/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Skills = {
  Resilience: number;
  'Self-Compassion': number;
  Focus: number;
  Patience: number;
  Mindfulness: number;
  Courage: number;
};

const moods = [
  '😀 Happy',
  '😔 Sad',
  '😠 Angry',
  '😌 Relaxed',
  '😟 Anxious',
  '💪 Motivated',
];

export default function JournalPage() {
  const [selectedMood, setSelectedMood] = useState('');
  const [entry, setEntry] = useState('');
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);

  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(1);
  const [lastJournalDate, setLastJournalDate] = useState<string | null>(null);

  const [skills, setSkills] = useState<Skills>({
    Resilience: 20,
    'Self-Compassion': 20,
    Focus: 20,
    Patience: 20,
    Mindfulness: 20,
    Courage: 20,
  });

  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [masteryMessage, setMasteryMessage] = useState('');
  const [showXpGain, setShowXpGain] = useState(false);
  const [hoverHistory, setHoverHistory] = useState(false);

  const [moodCounts, setMoodCounts] = useState<{ [mood: string]: number }>({});

  const skillIcons: { [key in keyof Skills]: string } = {
    Resilience: '🛡️',
    'Self-Compassion': '💖',
    Focus: '🎯',
    Patience: '⌛',
    Mindfulness: '🧘',
    Courage: '🦁',
  };

  useEffect(() => {
    const saved = localStorage.getItem('mood_counts');
    if (saved) {
      setMoodCounts(JSON.parse(saved));
    }
  }, []);

  const updateMoodCount = (mood: string) => {
    const updated = { ...moodCounts };
    updated[mood] = (updated[mood] || 0) + 1;
    setMoodCounts(updated);
    localStorage.setItem('mood_counts', JSON.stringify(updated));
  };

  const unlockTrophy = (id: string) => {
    const saved = localStorage.getItem('luminam_trophies');
    const trophies = saved ? JSON.parse(saved) : [];
    if (!trophies.includes(id)) {
      trophies.push(id);
      localStorage.setItem('luminam_trophies', JSON.stringify(trophies));
      alert('🏆 New Trophy Unlocked!');
    }
  };

  const handleReflection = async () => {
    if (!selectedMood || !entry.trim()) {
      alert('Select a mood and write something to reflect.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reflection/`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entry, mood: selectedMood }),
        }
      );
      const data = await res.json();
      setReflection(data.reflection);
      setEntry('');

      updateMoodCount(selectedMood);

      setXp((prev) => prev + 10);
      setShowXpGain(true);
      setTimeout(() => setShowXpGain(false), 1000);

      const keys = Object.keys(skills) as (keyof Skills)[];
      const randomSkill = keys[Math.floor(Math.random() * keys.length)];
      const boost = Math.floor(Math.random() * 5) + 1;

      setSkills((prev) => {
        const updated = {
          ...prev,
          [randomSkill]: Math.min(prev[randomSkill] + boost, 100),
        };
        if (updated[randomSkill] === 100 && prev[randomSkill] < 100) {
          handleSkillMastery(randomSkill);
        }
        return updated;
      });

      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      if (lastJournalDate) {
        const last = new Date(lastJournalDate);
        const diff = (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
        if (Math.floor(diff) === 1) {
          const newStreak = streak + 1;
          setStreak(newStreak);
          if (newStreak === 7) unlockTrophy('7day_streak');
          handleStreakCelebration(newStreak);
        } else if (Math.floor(diff) > 1) {
          setStreak(1);
        }
      }

      setLastJournalDate(todayStr);
    } catch (e) {
      console.error(e);
      setReflection('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleStreakCelebration = (s: number) => {
    const messages: { [key: number]: string } = {
      3: '🔥 3-Day Streak! Keep going!',
      7: '🏆 7-Day Streak! Consistency!',
      14: '🌟 2 Weeks Strong!',
      30: '🚀 1 Month! You’re amazing!',
    };
    if (messages[s]) {
      setCelebrationMessage(messages[s]);
      setTimeout(() => setCelebrationMessage(''), 4000);
    }
  };

  const handleSkillMastery = (skill: keyof Skills) => {
    const msg = `${skillIcons[skill]} ${skill} Mastered!`;
    if (skill === 'Mindfulness') unlockTrophy('mindfulness_master');
    setMasteryMessage(msg);
    setTimeout(() => setMasteryMessage(''), 5000);
  };

  const moodChartData = {
    labels: Object.keys(moodCounts),
    datasets: [
      {
        label: 'Mood Frequency',
        data: Object.values(moodCounts),
        backgroundColor: 'rgba(168, 85, 247, 0.6)',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className='relative flex min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100'>
      {/* XP + Streak */}
      <div className='absolute top-4 left-4 z-10 flex gap-3 items-center'>
        <div className='bg-yellow-200 text-yellow-900 font-bold px-4 py-2 rounded-full shadow'>
          ✨ XP: {xp}
        </div>
        <div className='bg-red-100 text-red-700 font-bold px-4 py-2 rounded-full shadow'>
          🔥 Streak: {streak} days
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 p-12 flex flex-col items-center w-full space-y-6'>
        <h1 className='text-3xl font-bold text-gray-800 mb-4'>
          📝 Journal Your Thoughts
        </h1>

        <select
          value={selectedMood}
          onChange={(e) => setSelectedMood(e.target.value)}
          className='p-2 w-full max-w-md rounded border text-gray-700'
        >
          <option value=''>-- Select Mood --</option>
          {moods.map((mood) => (
            <option key={mood} value={mood}>
              {mood}
            </option>
          ))}
        </select>

        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder='Write your thoughts here...'
          className='w-full max-w-2xl h-40 p-4 border rounded text-gray-800 placeholder-gray-400'
        />

        <button
          onClick={handleReflection}
          disabled={loading}
          className='px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg disabled:opacity-50'
        >
          {loading ? 'Reflecting...' : 'Reflect with AI'}
        </button>

        {reflection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='w-full max-w-2xl mt-6 bg-white border border-gray-200 rounded p-6 shadow'
          >
            <h2 className='text-lg text-gray-600 font-bold  mb-2'>
              💬 AI Reflection
            </h2>
            <p className='text-gray-700'>{reflection}</p>
          </motion.div>
        )}

        {Object.keys(moodCounts).length > 0 && (
          <div className='w-full max-w-xl mt-8 bg-white p-6 rounded shadow'>
            <h3 className='text-xl font-bold text-purple-700 mb-4'>
              📊 Mood Trends
            </h3>
            <Bar
              data={moodChartData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className='group relative bg-white border-l border-gray-300 w-16 hover:w-72 transition-all duration-300 ease-in-out shadow-inner overflow-hidden'>
        <h2 className='hidden group-hover:block text-center text-lg font-semibold text-purple-600 mt-6 mb-4'>
          🌱 Skills
        </h2>
        <div className='flex flex-col items-center mt-4 space-y-6 w-full px-4'>
          {Object.keys(skills).map((skill) => (
            <div key={skill} className='flex items-center w-full'>
              <span className='text-xl'>
                {skillIcons[skill as keyof Skills]}
              </span>
              <div className='hidden group-hover:flex flex-col ml-3 w-full'>
                <span className='text-sm font-medium text-gray-700'>
                  {skill}
                </span>
                <div className='h-4 bg-gray-200 rounded-full overflow-hidden mt-1 relative'>
                  <div
                    className='h-full bg-purple-500 text-white text-xs text-center font-semibold'
                    style={{ width: `${skills[skill as keyof Skills]}%` }}
                  >
                    {skills[skill as keyof Skills]}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reflection History */}
        <div className='absolute bottom-4 left-4 group-hover:left-6 transition-all duration-300'>
          <a
            href='/history'
            className='flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium'
          >
            <span className='text-xl'>🔍</span>
            <span className='text-sm opacity-0 transform -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300'>
              Reflection History
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
