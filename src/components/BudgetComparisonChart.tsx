'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BudgetComparisonChartProps {
  data: Array<{
    category: string;
    budget: number;
    actual: number;
    remaining: number;
    percentage: number;
  }>;
  isLoading?: boolean;
}

export default function BudgetComparisonChart({ data, isLoading = false }: BudgetComparisonChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const chartData = data.map(item => ({
    category: item.category,
    budget: item.budget,
    actual: item.actual,
    remaining: item.remaining
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual Spending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No budget data available for this month.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual Spending</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="category" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                formatCurrency(value), 
                name === 'budget' ? 'Budget' : name === 'actual' ? 'Actual' : 'Remaining'
              ]}
              labelFormatter={(label) => `Category: ${label}`}
            />
            <Legend />
            <Bar 
              dataKey="budget" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
              name="Budget"
            />
            <Bar 
              dataKey="actual" 
              fill="#ef4444" 
              radius={[4, 4, 0, 0]}
              name="Actual"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 