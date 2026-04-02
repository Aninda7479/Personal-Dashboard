import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function WeeklyChart({ data }) {
  const chartData = [...(data || [])].reverse();
  
  if (!chartData || chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-secondary border border-subtle rounded-2xl bg-card">No data available</div>;
  }
  
  const formattedData = chartData.map(item => {
    const dateObj = new Date(item.date);
    return {
      name: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      total: item.total
    };
  });

  return (
    <div className="h-64 w-full bg-card rounded-2xl p-4 border border-subtle pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3A" vertical={false} />
          <XAxis dataKey="name" stroke="#8888AA" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis stroke="#8888AA" tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip 
            cursor={{fill: '#1C1C27'}} 
            contentStyle={{backgroundColor: '#13131A', borderColor: '#2A2A3A', borderRadius: '8px', color: '#F0F0FF'}}
            itemStyle={{color: '#00F5A0'}}
          />
          <Bar dataKey="total" fill="#00F5A0" radius={[4, 4, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
