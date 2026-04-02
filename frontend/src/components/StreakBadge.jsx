export default function StreakBadge({ days }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-subtle flex flex-col items-center justify-center h-full transition-all hover:border-gray-600 relative overflow-hidden"
      style={{ boxShadow: days > 0 ? '0 0 15px rgba(255, 217, 61, 0.2)' : 'none', borderColor: days > 0 ? 'var(--neon-wealth)' : 'var(--border-subtle)' }}
    >
      <div className={`text-5xl mb-2 ${days > 0 ? 'animate-bounce' : 'opacity-50 grayscale'}`}>🔥</div>
      <div className="text-center">
        {days > 0 ? (
          <>
            <div className="text-4xl font-display font-bold" style={{ color: 'var(--neon-wealth)' }}>{days}</div>
            <div className="text-secondary text-sm uppercase tracking-wider mt-1 font-bold">Day Streak</div>
          </>
        ) : (
          <div className="text-sm font-display text-secondary mt-2">Start your streak today!</div>
        )}
      </div>
    </div>
  );
}
