// components/charts/ExpenseChart.tsx
'use client';

import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface ExpenseData {
  name: string;
  amount: number;
  previousAmount: number;
}

const data: ExpenseData[] = [
  { name: 'Mon', amount: 120, previousAmount: 100 },
  { name: 'Tue', amount: 85, previousAmount: 95 },
  { name: 'Wed', amount: 150, previousAmount: 130 },
  { name: 'Thu', amount: 90, previousAmount: 110 },
  { name: 'Fri', amount: 200, previousAmount: 180 },
  { name: 'Sat', amount: 250, previousAmount: 220 },
  { name: 'Sun', amount: 180, previousAmount: 170 },
];

const timeRanges = ['This Week', 'Last Week', 'This Month', 'Last Month'];

export default function ExpenseChart() {
  const [selectedRange, setSelectedRange] = useState(timeRanges[0]);
  const [showRanges, setShowRanges] = useState(false);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          <p className="text-white/80 text-sm mb-1">
            Current: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-white/80 text-sm">
            Previous: ${payload[1].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="relative">
        <button
          onClick={() => setShowRanges(!showRanges)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white transition-colors"
        >
          {selectedRange}
          <ChevronDown className="h-4 w-4 text-white/60" />
        </button>

        {showRanges && (
          <div className="absolute top-full mt-2 w-48 backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg shadow-xl overflow-hidden z-10">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => {
                  setSelectedRange(range);
                  setShowRanges(false);
                }}
                className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors"
              >
                {range}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.6)"
              tick={{ fill: 'rgba(255,255,255,0.6)' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="previousAmount" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={entry.amount > entry.previousAmount ? '#ef4444' : '#22c55e'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total Expenses</p>
          <p className="text-2xl font-bold text-white mt-1">$1,075</p>
          <p className="text-rose-400 text-sm mt-1">+12% vs last period</p>
        </div>
        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/60 text-sm">Average Daily</p>
          <p className="text-2xl font-bold text-white mt-1">$153.57</p>
          <p className="text-emerald-400 text-sm mt-1">-5% vs last period</p>
        </div>
        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/60 text-sm">Highest Day</p>
          <p className="text-2xl font-bold text-white mt-1">$250</p>
          <p className="text-white/60 text-sm mt-1">Saturday</p>
        </div>
      </div>
    </div>
  );
}