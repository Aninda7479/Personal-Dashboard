export default function HabitCard({ label, icon, value, onIncrement, onDecrement, onChange, color, unit, personalBest = 100 }) {
  const progressPercent = Math.min(100, Math.max(0, (value / (personalBest || 1)) * 100));
  
  return (
    <div className={`bg-card rounded-2xl p-6 border transition-all duration-300 relative overflow-hidden group`} style={{ borderColor: value > 0 ? color : 'var(--border-subtle)', boxShadow: value > 0 ? `0 0 15px ${color}20` : 'none' }}>
      <div 
        className="absolute bottom-0 left-0 h-1 opacity-50 transition-all duration-500"
        style={{ width: `${progressPercent}%`, backgroundColor: color }}
      ></div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-display font-bold text-lg">{label}</h3>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6">
        <button 
          onClick={onDecrement}
          className="w-12 h-12 rounded-full bg-bg-elevated hover:bg-gray-700 flex items-center justify-center text-xl font-bold transition-transform active:scale-95 text-primary"
        >-</button>
        
        <div className="flex-1 flex flex-col items-center justify-center relative">
            <input 
              type="number"
              value={value === 0 ? '' : value}
              placeholder="0"
              onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
              className="bg-transparent text-center text-4xl font-display font-bold w-full outline-none focus:ring-0 placeholder-gray-600 appearance-none"
              style={{ color: value > 0 ? color : 'var(--text-secondary)' }}
            />
          {unit && <span className="text-secondary text-sm mt-1 absolute -bottom-5">{unit}</span>}
        </div>
        
        <button 
          onClick={onIncrement}
          className="w-12 h-12 rounded-full bg-bg-elevated hover:bg-gray-700 flex items-center justify-center text-xl font-bold transition-transform active:scale-95 text-primary"
        >+</button>
      </div>
    </div>
  );
}
