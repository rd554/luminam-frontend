export default function Profile() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-yellow-100'>
      <main className='flex flex-col items-center justify-center flex-1 px-4 text-center'>
        <h1 className='text-4xl font-bold mb-4 text-gray-800'>
          🧑‍🚀 Your Luminam Profile
        </h1>
        <p className='text-lg text-gray-600'>
          See your emotional journey stats, achievements, and streaks!
        </p>
        <div className='mt-8 bg-white p-6 rounded-lg shadow-md max-w-lg'>
          <p className='text-gray-700'>[Profile Analytics Coming Soon 🚀]</p>
        </div>
      </main>
    </div>
  );
}
