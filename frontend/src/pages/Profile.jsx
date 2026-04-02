import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { User, Calendar, Award, Target, Activity } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalWorkoutDays: 0,
    joinDate: new Date(),
    avgScores: { health: 0, wealth: 0, love: 0, happiness: 0 }
  });

  useEffect(() => {
    // In a real app we might have a specific /users/me/stats endpoint
    // For this boilerplate, let's mock the stats or fetch history and compute
    const fetchStats = async () => {
      try {
        const historyRes = await client.get('/habits/history?limit=100');
        const logs = historyRes.data;
        const totalWorkouts = logs.filter(log => (log.pushups + log.pullups + log.squats + log.situps + log.plank_minutes) > 0).length;
        
        setStats({
          joinDate: new Date(user?.created_at || new Date()),
          totalWorkoutDays: totalWorkouts,
          avgScores: { health: 7.5, wealth: 6.8, love: 8.2, happiness: 7.9 } // Dummy avg data for UI purpose
        });
      } catch(err) {
        console.error(err);
      }
    };
    if (user) fetchStats();
  }, [user]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-primary">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar">
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-bold text-primary mb-8">Commander Profile</h2>
            
            <div className="bg-card rounded-3xl p-8 border border-subtle relative overflow-hidden mb-8 shadow-[0_0_30px_rgba(255,255,255,0.02)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.02] blur-[80px] rounded-full"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center text-black font-display font-bold text-5xl shadow-2xl"
                  style={{ backgroundColor: user?.avatar_color || '#00F5A0', boxShadow: `0 0 40px ${user?.avatar_color || '#00F5A0'}40` }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-3xl font-display font-bold text-primary mb-2">{user?.name}</h3>
                  <p className="text-secondary text-lg mb-4">{user?.email}</p>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center gap-2 bg-bg-elevated px-4 py-2 rounded-xl text-sm text-secondary">
                      <Calendar size={16} className="text-primary" />
                      Joined {stats.joinDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={logout}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-6 py-3 rounded-xl font-bold transition-colors font-display tracking-widest uppercase text-sm mt-6 md:mt-0"
                >
                  Terminate Session
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-card rounded-3xl p-8 border border-subtle">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-neon-fitness" size={24} />
                  <h3 className="text-xl font-display font-bold text-primary">Fitness Milestones</h3>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-neon-fitness/10 flex items-center justify-center text-neon-fitness">
                    <Award size={40} />
                  </div>
                  <div>
                    <div className="text-4xl font-display font-bold text-primary">{stats.totalWorkoutDays}</div>
                    <div className="text-secondary tracking-widest uppercase text-xs font-bold mt-1">Active Days Logged</div>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl p-8 border border-subtle">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-neon-happy" size={24} />
                  <h3 className="text-xl font-display font-bold text-primary">Lifetime Analytics</h3>
                </div>
                
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-secondary w-20">Health</span>
                    <div className="flex-1 bg-bg-elevated h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-health" style={{ width: `${stats.avgScores.health * 10}%` }}></div>
                    </div>
                    <span className="text-primary font-display font-bold w-8 text-right">{stats.avgScores.health}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-secondary w-20">Wealth</span>
                    <div className="flex-1 bg-bg-elevated h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-wealth" style={{ width: `${stats.avgScores.wealth * 10}%` }}></div>
                    </div>
                    <span className="text-primary font-display font-bold w-8 text-right">{stats.avgScores.wealth}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-secondary w-20">Love</span>
                    <div className="flex-1 bg-bg-elevated h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-love" style={{ width: `${stats.avgScores.love * 10}%` }}></div>
                    </div>
                    <span className="text-primary font-display font-bold w-8 text-right">{stats.avgScores.love}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-secondary w-20">Happiness</span>
                    <div className="flex-1 bg-bg-elevated h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-neon-happy" style={{ width: `${stats.avgScores.happiness * 10}%` }}></div>
                    </div>
                    <span className="text-primary font-display font-bold w-8 text-right">{stats.avgScores.happiness}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
