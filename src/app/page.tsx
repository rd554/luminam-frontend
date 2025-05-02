import Link from 'next/link';

// console.log('API KEY:', process.env.NEXT_PUBLIC_OPENAI_API_KEY);

export default function Home() {
  return (
    <main className='min-h-screen bg-gradient-to-br from-yellow-50 to-pink-100 flex flex-col items-center justify-center px-4'>
      <h1 className='text-4xl font-bold text-gray-800 mb-6'>
        Welcome to Luminam
      </h1>
      <p className='text-lg text-gray-600 mb-12 text-center max-w-xl'>
        Reflect. Grow. Unlock your inner clarity.
      </p>

      <div className='flex flex-wrap justify-center gap-6'>
        <Link
          href='/journal'
          className='bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition'
        >
          ✍️ Journal
        </Link>

        <Link
          href='/quests'
          className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition'
        >
          🎯 Quests
        </Link>

        <Link
          href='/daily-quiz'
          className='bg-pink-500 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition'
        >
          🧠 Daily Quiz
        </Link>
      </div>
      {/* <div className='group'>
        <a
          href='/trophies'
          className='flex items-center gap-2 text-sm text-gray-700 hover:text-purple-700 transition font-medium px-3 py-2'
        >
          <span className='text-xl'>🏆</span>
          <span className='opacity-0 group-hover:opacity-100 transition duration-200'>
            Trophies
          </span>
        </a>
      </div> */}
    </main>
  );
}
