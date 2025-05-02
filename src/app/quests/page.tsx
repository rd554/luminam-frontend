'use client';

import { useEffect, useState } from 'react';

interface Quest {
  text: string;
  acceptedOn: string;
  tag?: string;
  completed?: boolean;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [customQuest, setCustomQuest] = useState('');
  const [customTag, setCustomTag] = useState('mindfulness');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tagOptions = [
    'mindfulness',
    'focus',
    'gratitude',
    'joy',
    'calm',
    'resilience',
    'motivation',
  ];
  const tagEmojiMap: Record<string, string> = {
    mindfulness: '🧘',
    focus: '🎯',
    gratitude: '🙏',
    joy: '😊',
    calm: '🌿',
    motivation: '⚡',
    resilience: '🛡️',
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('daily_quests') || '[]');
    const parsed: Quest[] = stored
      .filter(
        (q: any) =>
          typeof q === 'string' || (q.text && (q.acceptedOn || q.accepted_on))
      )
      .map((q: any) => {
        if (typeof q === 'string') {
          return {
            text: q,
            acceptedOn: new Date().toISOString().split('T')[0],
          };
        }
        return {
          text: q.text,
          acceptedOn: q.acceptedOn || q.accepted_on,
          tag: q.tag,
          completed: q.completed || false,
        };
      });
    setQuests(parsed);
  }, []);

  const handleComplete = (index: number) => {
    const updated = [...quests];
    updated[index].completed = true;
    setQuests(updated);
    localStorage.setItem('daily_quests', JSON.stringify(updated));
  };

  const addCustomQuest = async () => {
    if (!customQuest.trim()) return;

    const newQuest: Quest = {
      text: customQuest.trim(),
      acceptedOn: new Date().toISOString().split('T')[0],
      tag: customTag,
      completed: false,
    };

    const updated = [...quests, newQuest];
    setQuests(updated);
    localStorage.setItem('daily_quests', JSON.stringify(updated));
    setCustomQuest('');

    // ✅ Save to backend
    try {
      await fetch('http://127.0.0.1:8000/api/quests/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: customQuest.trim(),
          tag: customTag,
          accepted_on: new Date().toISOString().split('T')[0],
          completed: false,
        }),
      });
    } catch (err) {
      console.error('Failed to save custom quest to backend:', err);
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-6'>
      <h1 className='text-3xl font-bold text-purple-700 mb-6 text-center'>
        🌟 Your Accepted Quests
      </h1>

      {/* Add Your Own Quest UI */}
      <div className='mb-6 p-4 bg-white rounded shadow-md'>
        <h2 className='text-lg font-bold mb-3 text-purple-700'>
          ➕ Add Your Own Quest
        </h2>
        <input
          type='text'
          value={customQuest}
          onChange={(e) => setCustomQuest(e.target.value)}
          placeholder='Enter your custom quest...'
          className='w-full p-2 border border-gray-300 rounded mb-3 text-gray-800'
        />
        <div className='flex items-center gap-3'>
          <select
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            className='border p-2 rounded text-sm text-gray-800'
          >
            {tagOptions.map((tag) => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={addCustomQuest}
            className='bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded'
          >
            Add Quest
          </button>
        </div>
      </div>

      <div className='mb-6 flex flex-wrap gap-2 justify-center'>
        {Object.entries(tagEmojiMap).map(([tag, emoji]) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag === activeTag ? null : tag)}
            className={`px-3 py-1 rounded-full text-sm font-medium border transition ${
              activeTag === tag
                ? 'bg-purple-700 text-white'
                : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-100'
            }`}
          >
            {emoji} {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>

      {/* Quest Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {quests
          .filter((quest) => !activeTag || quest.tag === activeTag)
          .map((quest, index) => (
            <div
              key={index}
              className={`relative rounded-lg shadow-md p-4 transition-all duration-300 ${
                quest.completed ? 'bg-gray-100 opacity-70' : 'bg-white'
              }`}
            >
              {/* Tag */}
              {quest.tag && (
                <span className='inline-block bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full mb-2'>
                  {tagEmojiMap[quest.tag] || '🏷️'} #{quest.tag}
                </span>
              )}

              <p
                className={`text-purple-800 font-medium text-md mb-2 line-clamp-4 ${
                  quest.completed ? 'line-through text-gray-500' : ''
                }`}
              >
                {quest.text}
              </p>

              <p className='text-sm text-gray-500'>
                Accepted on: {quest.acceptedOn}
              </p>

              <div className='mt-3 flex justify-between items-center'>
                <span className='bg-yellow-300 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full shadow'>
                  +15 XP
                </span>

                {!quest.completed ? (
                  <button
                    onClick={() => handleComplete(index)}
                    className='text-sm bg-green-400 hover:bg-green-500 text-white font-semibold px-4 py-1 rounded-full shadow transition'
                  >
                    Mark Complete
                  </button>
                ) : (
                  <span className='text-green-700 font-medium text-sm'>
                    ✅ Completed
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
