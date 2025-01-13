// components/charts/IncomeChart.tsx
'use client';

import { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface IncomeData {
  name: string;
  income: number;
  target: number;
}

const data: IncomeData[] = [
  { name: 'Jan', income: 4000, target: 3800 },
  { name: 'Feb', income: 4200, target: 3800 },
  { name: 'Mar', income: 4500, target: 3800 },
  { name: 'Apr', income: 4800, target: 3800 },
  { name: 'May', income: 4300, target: 3800 },
  { name: 'Jun', income: 5000, target: 3800 },
];

const periods = ['6 Months', '1 Year', 'YTD', 'All Time'];

export default function IncomeChart() {
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  
  const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
  const averageIncome = totalIncome / data.length;
  const lastMonthIncome = data[data.length - 1].income;
  const previousMonthIncome = data[data.length - 2].income;
  const monthlyGrowth = ((lastMonthIncome - previousMonthIncome) / previousMonthIncome) * 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-medium mb-2">{label}</p>
          <p className="text-emerald-400 text-sm mb-1">
            Income: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-white/60 text-sm">
            Target: ${payload[1].value.toLocaleString()}
          </p>
          <p className="text-white/60 text-sm mt-1">
            {payload[0].value >= payload[1].value ? 'Above' : 'Below'} Target
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header with Period Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-white/60" />
          <div className="flex gap-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white/20 text-white'
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Income Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/60 text-sm">Average Monthly</p>
          <p className="text-2xl font-bold text-white mt-1">
            ${averageIncome.toLocaleString()}
          </p>
          <div className="flex items-center gap-1 text-emerald-400 text-sm mt-1">
            <TrendingUp className="h-4 w-4" />
            <span>+8.2% avg growth</span>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/60 text-sm">Last Month</p>
          <p className="text-2xl font-bold text-white mt-1">
            ${lastMonthIncome.toLocaleString()}
          </p>
          <div className={`flex items-center gap-1 text-sm mt-1 ${
            monthlyGrowth >= 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{monthlyGrowth.toFixed(1)}% vs previous</span>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <p className="text-white/60 text-sm">Total ({selectedPeriod})</p>
          <p className="text-2xl font-bold text-white mt-1">
            ${totalIncome.toLocaleString()}
          </p>
          <p className="text-white/60 text-sm mt-1">
            From {data[0].name} to {data[data.length - 1].name}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
              </linearGradient>
            </defs>
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
            <Area
              type="monotone"
              dataKey="target"
              stroke="#94a3b8"
              strokeDasharray="5 5"
              fill="url(#targetGradient)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              fill="url(#incomeGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}