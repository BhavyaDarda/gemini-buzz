import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { time: '00:00', views: 1200, engagement: 8.5, viral: 6.2 },
  { time: '04:00', views: 2100, engagement: 9.2, viral: 7.1 },
  { time: '08:00', views: 4500, engagement: 12.8, viral: 8.9 },
  { time: '12:00', views: 8900, engagement: 15.4, viral: 9.2 },
  { time: '16:00', views: 12400, engagement: 18.2, viral: 9.7 },
  { time: '20:00', views: 15600, engagement: 21.3, viral: 9.9 },
];

export const TrendChart = () => {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mockData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="time" 
            className="text-xs"
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            className="text-xs"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-primary)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="views" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
          />
          <Line 
            type="monotone" 
            dataKey="viral" 
            stroke="hsl(var(--viral))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--viral))', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(var(--viral))', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};