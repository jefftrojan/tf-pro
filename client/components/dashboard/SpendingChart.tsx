// components/dashboard/SpendingChart.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SpendingChartProps {
  data: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export default function SpendingChart({ data }: SpendingChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis 
            dataKey="month" 
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60' }}
          />
          <YAxis 
            stroke="#ffffff60"
            tick={{ fill: '#ffffff60' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff10',
              backdropFilter: 'blur(8px)',
              border: '1px solid #ffffff20',
              borderRadius: '8px',
            }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#ffffff60' }}
          />
          <Legend 
            wrapperStyle={{ color: '#ffffff60' }}
          />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#34d399" 
            activeDot={{ r: 8 }}
          />
          <Line 
            type="monotone" 
            dataKey="expenses" 
            stroke="#f43f5e" 
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}