// components/charts/BudgetChart.tsx
'use client';

import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const COLORS = ['#22c55e', '#f97316', '#06b6d4', '#8b5cf6', '#ec4899'];

interface BudgetChartProps {
  budgets: Array<{
    category: string;
    limit: number;
    spent: number;
  }>;
}

export default function BudgetChart({ budgets }: BudgetChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return budgets
      .filter(budget => budget.limit > 0 && budget.spent > 0)
      .map(budget => ({
        name: budget.category,
        value: budget.spent,
        total: budget.limit,
        spent: budget.spent
      }));
  }, [budgets]);

  const budgetStats = useMemo(() => {
    const overBudgetCount = budgets.filter(budget => 
      budget.spent > budget.limit
    ).length;

    const underBudgetCount = budgets.filter(budget => 
      budget.spent <= budget.limit
    ).length;

    return { overBudgetCount, underBudgetCount };
  }, [budgets]);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-medium mb-1">{data.name}</p>
          <p className="text-white/80 text-sm">
            Budget: {formatCurrency(data.total)}
          </p>
          <p className="text-white/80 text-sm">
            Spent: {formatCurrency(data.spent)}
          </p>
          <p className="text-white/80 text-sm">
            Remaining: {formatCurrency(data.total - data.spent)}
          </p>
        </div>
      );
    }
    return null;
  };

  // If no budgets, return null or a placeholder
  if (chartData.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center text-white/60">
        No budget data available
      </div>
    );
  }

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                strokeWidth={activeIndex === index ? 2 : 0}
                stroke="#fff"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={36}
            content={({ payload }) => (
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload?.map((entry: any, index) => (
                  <div
                    key={`item-${index}`}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-white/80">{entry.value}</span>
                  </div>
                ))}
              </div>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Budget Statistics */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 text-emerald-400">
            <ArrowUpRight className="h-4 w-4" />
            <span className="text-sm">Under Budget</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {budgetStats.underBudgetCount} Categories
          </p>
        </div>
        <div className="backdrop-blur-lg bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center gap-2 text-rose-400">
            <ArrowDownRight className="h-4 w-4" />
            <span className="text-sm">Over Budget</span>
          </div>
          <p className="text-2xl font-bold text-white mt-1">
            {budgetStats.overBudgetCount} Categories
          </p>
        </div>
      </div>
    </div>
  );
}