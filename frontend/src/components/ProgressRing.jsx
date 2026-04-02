export default function ProgressRing({ score, color, label }) {
  const radius = 70;
  const stroke = 14;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const scoreValue = score || 0;
  const strokeDashoffset = circumference - (scoreValue / 10) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-3xl border border-subtle">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            stroke="var(--bg-elevated)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-display font-bold text-primary leading-none">
            {scoreValue}
            <span className="text-2xl text-secondary">/10</span>
          </div>
        </div>
      </div>
      {label && <div className="mt-4 text-sm font-display font-bold text-secondary uppercase tracking-widest">{label}</div>}
    </div>
  );
}
