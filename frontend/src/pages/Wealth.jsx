import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProgressRing from '../components/ProgressRing';
import client from '../api/client';
import { DollarSign, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const TAGS = ['#income', '#savings', '#investment', '#expense', '#business'];

export default function Wealth() {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchWealth = async () => {
      try {
        const historyRes = await client.get('/pillars/wealth');
        setHistory(historyRes.data);
        const todayRes = await client.get('/pillars/wealth/today');
        if (todayRes.data) {
          setScore(todayRes.data.score);
          setNote(todayRes.data.note || '');
          setSelectedTags(todayRes.data.tags || []);
        }
      } catch (err) {
        if (err.response?.status !== 404) console.error('Error fetching wealth data', err);
      }
    };
    fetchWealth();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await client.put('/pillars/wealth/today', { score, note, tags: selectedTags });
      setSaveMessage('Saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
      
      const historyRes = await client.get('/pillars/wealth');
      setHistory(historyRes.data);
    } catch (err) {
      setSaveMessage('Failed to save.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const chartData = [...history].map(item => {
    const d = new Date(item.date);
    return { name: `${d.getMonth()+1}/${d.getDate()}`, score: item.score };
  });

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-primary">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 hide-scrollbar">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-neon-wealth/20 text-neon-wealth rounded-xl shadow-[0_0_15px_rgba(255,217,61,0.3)]">
              <DollarSign size={32} />
            </div>
            <h2 className="text-4xl font-display font-bold text-primary tracking-wide">Wealth & Finance</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-1 bg-card rounded-3xl p-8 border border-subtle relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-wealth opacity-5 blur-[60px] rounded-full"></div>
              <h3 className="text-xl font-display font-bold mb-6 text-primary text-center">Today's Wealth Score</h3>
              
              <ProgressRing score={score} color="var(--neon-wealth)" />
              
              <div className="mt-10">
                <input 
                  type="range" min="1" max="10" value={score} 
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-2 bg-bg-elevated rounded-lg appearance-none cursor-pointer accent-neon-wealth"
                />
                <div className="flex justify-between text-secondary text-sm mt-2 font-display font-bold">
                  <span>1</span><span>10</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-card rounded-3xl p-8 border border-subtle">
              <h3 className="text-xl font-display font-bold mb-4 text-primary">Daily Journal</h3>
              <textarea 
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Any income, investments, or significant expenses today?"
                className="w-full bg-bg-elevated border border-subtle rounded-xl p-4 text-primary focus:outline-none focus:border-neon-wealth transition-colors placeholder-gray-600 resize-none h-32 mb-6"
                maxLength={500}
              />
              
              <h4 className="text-sm uppercase font-bold text-secondary tracking-wider mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2 mb-8">
                {TAGS.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTags.includes(tag) ? 'bg-neon-wealth text-black shadow-[0_0_10px_rgba(255,217,61,0.4)]' : 'bg-bg-elevated text-secondary hover:text-primary border border-subtle'}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className={`text-sm text-neon-wealth`}>{saveMessage}</span>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-neon-wealth text-black font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity font-display flex items-center gap-2 shadow-[0_4px_14px_rgba(255,217,61,0.4)] disabled:opacity-50"
                >
                  <Save size={20} />
                  {isSaving ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-8 border border-subtle mb-10">
            <h3 className="text-xl font-display font-bold mb-6 text-primary">30-Day Trend</h3>
            {chartData.length > 0 ? (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" vertical={false} />
                    <XAxis dataKey="name" stroke="#8888AA" tickLine={false} axisLine={false} fontSize={12} />
                    <YAxis stroke="#8888AA" tickLine={false} axisLine={false} fontSize={12} domain={[0, 10]} />
                    <Tooltip 
                      cursor={{stroke: '#2A2A3A', strokeWidth: 2}} 
                      contentStyle={{backgroundColor: '#13131A', borderColor: '#2A2A3A', borderRadius: '8px', color: '#F0F0FF'}}
                      itemStyle={{color: '#FFD93D'}}
                    />
                    <Line type="monotone" dataKey="score" stroke="#FFD93D" strokeWidth={3} dot={{fill: '#FFD93D', r: 4}} activeDot={{r: 6, fill: '#FFD93D', stroke: '#1C1C27', strokeWidth: 2}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-72 flex items-center justify-center text-secondary">Not enough data to display trend.</div>
            )}
          </div>
          
          <div className="pb-10">
            <h3 className="text-xl font-display font-bold mb-6 text-primary">Recent Entries</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...history].reverse().slice(0, 6).map(entry => (
                <div key={entry.id} className="bg-bg-elevated p-5 rounded-2xl border border-subtle">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-bold text-secondary">{new Date(entry.date).toLocaleDateString()}</span>
                    <span className="font-display font-bold text-neon-wealth">{entry.score}/10</span>
                  </div>
                  <p className="text-primary text-sm line-clamp-3 mb-3">{entry.note || 'No notes for this day.'}</p>
                  <div className="flex flex-wrap gap-1">
                    {entry.tags?.map(t => <span key={t} className="text-xs bg-black text-secondary px-2 py-1 rounded">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
