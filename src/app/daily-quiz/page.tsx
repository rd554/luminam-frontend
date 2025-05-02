/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const dailyQuestions = [
  {
    id: 1,
    question: 'How are you feeling today overall?',
    options: ['Great', 'Okay', 'Tired', 'Stressed'],
  },
  {
    id: 2,
    question: 'What’s one thing that challenged you emotionally today?',
    options: ['Work', 'Family', 'Myself', 'Nothing'],
  },
  {
    id: 3,
    question: 'How did you respond to that challenge?',
    options: [
      'Avoided it',
      'Took it head on',
      'Asked for help',
      'Still processing',
    ],
  },
];

export default function DailyQuizPage() {
  const [answers, setAnswers] = useState<(string | undefined)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  const [suggestedQuest, setSuggestedQuest] = useState('');
  const [loading, setLoading] = useState(false);
  const [xp, setXp] = useState(0);
  const [showXpGain, setShowXpGain] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);
  const [acceptedQuest, setAcceptedQuest] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastCompleted = localStorage.getItem('quiz_completed_date');
    const savedXp = parseInt(localStorage.getItem('luminam_xp') || '0', 10);
    setXp(savedXp);

    if (lastCompleted === today) {
      setAlreadyTaken(true);
    }
  }, []);

  const handleAnswer = (qIndex: number, answer: string) => {
    if (alreadyTaken) return;
    const updated = [...answers];
    updated[qIndex] = answer;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    if (
      answers.length !== dailyQuestions.length ||
      answers.includes(undefined)
    ) {
      alert('Please answer all questions.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/quiz/quiz-grade/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      const parsed = await res.json();
      setGrade(parsed.grade || '—');
      setFeedback(parsed.feedback || 'No feedback available.');
      setSubmitted(true);

      const newXp = xp + 15;
      setXp(newXp);
      setShowXpGain(true);
      localStorage.setItem('luminam_xp', newXp.toString());
      setTimeout(() => setShowXpGain(false), 1000);

      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem('quiz_completed_date', today);
      setAlreadyTaken(true);

      generateQuestSuggestion(answers[0] ?? 'neutral');
    } catch (error) {
      console.error('Grading failed:', error);
      setFeedback('Could not evaluate your answers at this time.');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestSuggestion = async (mood: string) => {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful wellness coach. Suggest a simple, actionable daily quest based on someone feeling this way.',
            },
            {
              role: 'user',
              content: `Suggest a quest for someone who is feeling "${mood}". Just return the quest text.`,
            },
          ],
          max_tokens: 60,
          temperature: 0.7,
        }),
      });

      const data = await res.json();
      const quest = data?.choices?.[0]?.message?.content?.trim();
      setSuggestedQuest(
        quest || 'Take a mindful 10-minute break from screens.'
      );
    } catch (err) {
      console.error('Error generating quest:', err);
      setSuggestedQuest('Do a short gratitude journaling exercise.');
    }
  };

  const handleAcceptSuggestedQuest = async () => {
    const acceptedOn = new Date().toISOString().split('T')[0];
    const questObj = {
      text: suggestedQuest,
      accepted_on: acceptedOn,
      tag: 'mindfulness',
      completed: false,
    };

    const existing = JSON.parse(localStorage.getItem('daily_quests') || '[]');
    const updated = [...existing, questObj];
    localStorage.setItem('daily_quests', JSON.stringify(updated));
    localStorage.setItem('accepted_quest', suggestedQuest);

    try {
      await fetch('http://127.0.0.1:8000/api/quests/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questObj),
      });
    } catch (error) {
      console.error('Error saving AI-suggested quest to backend:', error);
    }

    setAcceptedQuest(suggestedQuest);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-8'>
      <div className='max-w-2xl mx-auto bg-white rounded shadow p-6 relative'>
        <h1 className='text-3xl font-bold text-purple-700 mb-6 text-center'>
          🧠 Daily Mental Wellness Quiz
        </h1>

        {alreadyTaken && !submitted ? (
          <div className='text-center text-green-700 font-semibold text-lg'>
            ✅ You’ve already completed today’s quiz. Come back tomorrow!
          </div>
        ) : (
          <>
            {!submitted &&
              dailyQuestions.map((q, index) => (
                <div key={q.id} className='mb-6'>
                  <h2 className='text-lg font-semibold mb-2 text-gray-800'>
                    {index + 1}. {q.question}
                  </h2>
                  <div className='flex flex-wrap gap-3'>
                    {q.options.map((option) => (
                      <button
                        key={option}
                        className={`px-4 py-2 rounded-full border font-medium transition ${
                          answers[index] === option
                            ? 'bg-purple-600 text-white'
                            : 'bg-white text-gray-800 border-gray-300 hover:bg-purple-100'
                        }`}
                        onClick={() => handleAnswer(index, option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className='mt-6 w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded'
              >
                {loading ? 'Grading...' : 'Submit Answers'}
              </button>
            ) : (
              <div className='mt-6 text-center'>
                <div className='text-lg font-bold text-green-700 mb-2'>
                  Grade: {grade || '—'}
                </div>
                <p className='text-gray-700'>
                  {feedback || 'No feedback available.'}
                </p>

                {suggestedQuest && (
                  <div className='mt-6 bg-purple-50 border-l-4 border-purple-400 p-4 rounded text-left'>
                    <p className='text-sm text-gray-600 mb-2 font-semibold'>
                      Suggested Quest:
                    </p>
                    <p className='text-purple-800 font-medium italic whitespace-pre-line'>
                      {suggestedQuest}
                    </p>

                    {localStorage.getItem('accepted_quest') ===
                    suggestedQuest ? (
                      <div className='mt-3'>
                        <p className='text-green-700 font-semibold'>
                          ✅ Quest Accepted
                        </p>
                        <a
                          href='/quests'
                          className='inline-block mt-2 px-4 py-2 bg-purple-700 text-white text-sm font-semibold rounded shadow hover:bg-purple-800 transition'
                        >
                          → Track this quest
                        </a>
                      </div>
                    ) : (
                      <button
                        className='mt-3 text-sm px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700'
                        onClick={handleAcceptSuggestedQuest}
                      >
                        Accept Quest
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        <AnimateXpGain show={showXpGain} amount={15} />
      </div>
    </div>
  );
}

function AnimateXpGain({ show, amount }: { show: boolean; amount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={show ? { opacity: 1, y: -20 } : { opacity: 0, y: 0 }}
      transition={{ duration: 1 }}
      className='absolute top-0 right-4 text-green-600 font-bold'
    >
      +{amount} XP!
    </motion.div>
  );
}
