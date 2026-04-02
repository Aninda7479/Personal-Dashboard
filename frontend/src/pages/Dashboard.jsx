import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HabitCard from '../components/HabitCard';
import StreakBadge from '../components/StreakBadge';
import WeeklyChart from '../components/WeeklyChart';
import QuoteCard from '../components/QuoteCard';
import PillarCard from '../components/PillarCard';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { Heart, DollarSign, Users, Smile } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [habits, setHabits] = useState({ pushups: 0, pullups: 0, squats: 0, situps: 0, plank_minutes: 0.0 });
  const [streak, setStreak] = useState(0);
  const [quote, setQuote] = useState({ quote: '', author: '' });
  const [weeklyData, setWeeklyData] = useState([]);
  const [pillarsSummary, setPillarsSummary] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [habitRes, streakRes, quoteRes, weekRes, pillarsRes] = await Promise.all([
          client.get('/habits/today'),
          client.get('/habits/streak'),
          client.get('/quotes/today'),
          client.get('/habits/week'),
          client.get('/pillars/summary')
        ]);
        
        setHabits(habitRes.data);
        setStreak(streakRes.data.streak);
        setQuote(quoteRes.data);
        setWeeklyData(weekRes.data);
        setPillarsSummary(pillarsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data', err);
      } finally {
        setInitialLoad(false);
      }
    };
    fetchData();
  }, []);

  const saveHabits = async (newHabits) => {
    setIsSaving(true);
    try {
      await client.put('/habits/today', newHabits);
      
      const weekRes = await client.get('/habits/week');
      setWeeklyData(weekRes.data);
      
    } catch (err) {
      console.error('Failed to save habits', err);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (initialLoad) return;
    const timeoutId = setTimeout(() => {
      saveHabits(habits);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [habits]);

  const updateHabit = (field, val) => {
    setHabits(prev => ({ ...prev, [field]: Math.max(0, val) }));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-primary text-primary transition-colors">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 hide-scrollbar relative bg-primary">
          
          {/* Rustic decorative shapes */}
          <div className="absolute top-[0%] right-[5%] w-[30vw] max-w-[400px] h-[30vw] max-h-[400px] rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.15] animate-pulse pointer-events-none" style={{ backgroundColor: '#E07A5F', animationDuration: '8s' }}></div>
          <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-[100px] opacity-[0.15] animate-pulse pointer-events-none" style={{ backgroundColor: '#81B29A', animationDuration: '10s' }}></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 mt-2 relative z-10">
            {/* Soft material hero card */}
            <div className="col-span-1 lg:col-span-1 flex flex-col justify-center bg-card rounded-[24px] p-8 sm:p-10 border border-subtle shadow-[0_8px_40px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-20 rounded-full blur-[40px] pointer-events-none translate-x-8 -translate-y-8" style={{ backgroundColor: '#A3B18A' }}></div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-3 tracking-tight text-primary relative z-10">
                {getGreeting()}, <br/><span style={{ color: '#A3B18A' }}>{user?.name?.split(' ')[0]} ✨</span>
              </h2>
              <p className="text-secondary font-medium mt-1 relative z-10">Your sanctuary for growth.</p>
              {isSaving && <span className="text-xs uppercase font-bold animate-pulse mt-5 tracking-wide relative z-10" style={{ color: '#A3B18A' }}>Auto-saving...</span>}
            </div>
            
            <div className="col-span-1">
              <StreakBadge days={streak} />
            </div>
            
            <div className="col-span-1">
              <QuoteCard quote={quote.quote} author={quote.author} />
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 mt-10 relative z-10 text-primary">
            <span className="w-1.5 h-6 rounded-full inline-block shadow-sm" style={{ backgroundColor: '#A3B18A' }}></span>
            Daily Routines
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-12 relative z-10">
            <HabitCard label="Push-ups" icon="💪" value={habits.pushups} onIncrement={() => updateHabit('pushups', (habits.pushups || 0) + 5)} onDecrement={() => updateHabit('pushups', (habits.pushups || 0) - 5)} onChange={(val) => updateHabit('pushups', val)} color="var(--neon-fitness)" unit="reps" personalBest={100} />
            <HabitCard label="Pull-ups" icon="🏋️" value={habits.pullups} onIncrement={() => updateHabit('pullups', (habits.pullups || 0) + 5)} onDecrement={() => updateHabit('pullups', (habits.pullups || 0) - 5)} onChange={(val) => updateHabit('pullups', val)} color="var(--neon-fitness)" unit="reps" personalBest={30} />
            <HabitCard label="Squats" icon="🦵" value={habits.squats} onIncrement={() => updateHabit('squats', (habits.squats || 0) + 5)} onDecrement={() => updateHabit('squats', (habits.squats || 0) - 5)} onChange={(val) => updateHabit('squats', val)} color="var(--neon-fitness)" unit="reps" personalBest={150} />
            <HabitCard label="Sit-ups" icon="🔄" value={habits.situps} onIncrement={() => updateHabit('situps', (habits.situps || 0) + 5)} onDecrement={() => updateHabit('situps', (habits.situps || 0) - 5)} onChange={(val) => updateHabit('situps', val)} color="var(--neon-fitness)" unit="reps" personalBest={100} />
            <HabitCard label="Plank" icon="⏱️" value={habits.plank_minutes} onIncrement={() => updateHabit('plank_minutes', parseFloat(((habits.plank_minutes || 0) + 0.5).toFixed(1)))} onDecrement={() => updateHabit('plank_minutes', parseFloat(((habits.plank_minutes || 0) - 0.5).toFixed(1)))} onChange={(val) => updateHabit('plank_minutes', parseFloat(val))} color="var(--neon-fitness)" unit="min" personalBest={5} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12 relative z-10">
            <div className="lg:col-span-2 bg-card p-6 sm:p-8 rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.03)] border border-subtle">
              <h3 className="text-xl font-bold mb-6 text-primary">Activity Overview (Last 7 Days)</h3>
              <WeeklyChart data={weeklyData} />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 mt-10 relative z-10 text-primary">
            <span className="w-1.5 h-6 rounded-full inline-block shadow-sm" style={{ backgroundColor: '#81B29A' }}></span>
            Life Pillars
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 relative z-10">
            <PillarCard pillar="health" score={pillarsSummary?.health?.score} note={pillarsSummary?.health?.note} color="var(--neon-health)" icon={Heart} path="/health" />
            <PillarCard pillar="wealth" score={pillarsSummary?.wealth?.score} note={pillarsSummary?.wealth?.note} color="var(--neon-wealth)" icon={DollarSign} path="/wealth" />
            <PillarCard pillar="love" score={pillarsSummary?.love?.score} note={pillarsSummary?.love?.note} color="var(--neon-love)" icon={Users} path="/love" />
            <PillarCard pillar="happiness" score={pillarsSummary?.happiness?.score} note={pillarsSummary?.happiness?.note} color="var(--neon-happy)" icon={Smile} path="/happiness" />
          </div>

        </main>
      </div>
    </div>
  );
}
