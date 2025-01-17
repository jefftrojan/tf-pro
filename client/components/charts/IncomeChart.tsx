// components/charts/IncomeChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IncomeChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export default function IncomeChart({ data }: IncomeChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis 
            dataKey="name" 
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
          <Bar dataKey="value" fill="#34d399" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}