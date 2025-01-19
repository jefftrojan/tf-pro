// components/charts/ExpenseChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpenseChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#34d399', '#3b82f6', '#f59e0b', '#6366f1', '#ec4899', '#14b8a6', '#8b5cf6', '#f43f5e'];

export default function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
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
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}