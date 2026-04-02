import { NavLink } from 'react-router-dom';

export default function PillarCard({ pillar, score, note, color, icon: Icon, path }) {
  return (
    <NavLink to={path} className="block bg-card rounded-2xl p-6 border transition-all duration-300 cursor-pointer text-left group overflow-hidden relative"
      style={{ borderColor: 'var(--border-subtle)' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 4px 20px ${color}22`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity" style={{ color: color }}>
        <Icon size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}15`, color: color }}>
              <Icon size={24} />
            </div>
            <h3 className="font-display font-bold text-xl capitalize text-primary">{pillar}</h3>
          </div>
          <div className="text-3xl font-display font-bold" style={{ color: color }}>
            {score || '-'}
            <span className="text-sm text-secondary font-body font-normal ml-1">/10</span>
          </div>
        </div>
        
        <div className="mt-4 border-t border-subtle pt-4">
          {note ? (
            <p className="text-secondary text-sm line-clamp-2">{note}</p>
          ) : (
            <p className="text-secondary text-sm italic opacity-50">Log today&apos;s entry...</p>
          )}
        </div>
      </div>
    </NavLink>
  );
}
