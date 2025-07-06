'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ITransaction } from '@/lib/models/Transaction';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetComparisonChart from '@/components/BudgetComparisonChart';
import DashboardCards from '@/components/DashboardCards';
import BudgetForm from '@/components/BudgetForm';
import { Settings } from 'lucide-react';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [analytics, setAnalytics] = useState<{
    monthlyExpenses: Array<{ _id: string; total: number }>;
    monthlyIncome: Array<{ _id: string; total: number }>;
    totalExpenses: number;
    totalIncome: number;
    recentTransactions: ITransaction[];
    budgetComparison: Array<{
      category: string;
      budget: number;
      actual: number;
      remaining: number;
      percentage: number;
    }>;
    month: string;
  } | null>(null);
  // const [budgets, setBudgets] = useState<Array<{
  //   _id: string;
  //   category: string;
  //   amount: number;
  //   month: string;
  // }>>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);



  // Load all data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response1 = await fetch(`/api/transactions?month=${selectedMonth}`);
      const response2 = await fetch(`/api/analytics?month=${selectedMonth}`);
      const response3 = await fetch(`/api/budgets?month=${selectedMonth}`);
      
      if (response1.ok) {
        const data = await response1.json();
        setTransactions(data);
      }
      
      if (response2.ok) {
        const data = await response2.json();
        setAnalytics(data);
      }
      
      if (response3.ok) {
        // const data = await response3.json();
        // setBudgets(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    loadData();
  }, [selectedMonth, loadData]);

  // Transaction handlers
  const handleAddTransaction = async (data: Partial<ITransaction>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add transaction');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTransaction = async (id: string, data: Partial<ITransaction>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update transaction');
      }
    } catch (error) {
      console.error('Error updating transaction:', error);
      alert('Failed to update transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        await loadData();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete transaction');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction');
    }
  };

  // Budget handlers
  const handleSetBudget = async (data: { category: string; amount: number; month: string }) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        await loadData();
        setIsBudgetDialogOpen(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to set budget');
      }
    } catch (error) {
      console.error('Error setting budget:', error);
      alert('Failed to set budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Personal Finance Visualizer</h1>
            <p className="text-gray-600 mt-2">Track your expenses, income, and budgets</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const month = date.toISOString().slice(0, 7);
                  const monthName = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  });
                  return (
                    <SelectItem key={month} value={month}>
                      {monthName}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Set Budgets
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Set Monthly Budgets</DialogTitle>
                </DialogHeader>
                <BudgetForm
                  onSubmit={handleSetBudget}
                  onCancel={() => setIsBudgetDialogOpen(false)}
                  isLoading={isSubmitting}
                  currentMonth={selectedMonth}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Dashboard Cards */}
        {analytics && (
          <div className="mb-8">
            <DashboardCards
              totalExpenses={analytics.totalExpenses || 0}
              totalIncome={analytics.totalIncome || 0}
              recentTransactions={analytics.recentTransactions || []}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid gap-6 mb-8 lg:grid-cols-2">
          {/* Monthly Expenses Chart */}
          <MonthlyExpensesChart
            data={analytics?.monthlyExpenses || []}
            isLoading={isLoading}
          />

          {/* Category Pie Chart */}
          <CategoryPieChart
            data={analytics?.monthlyExpenses || []}
            isLoading={isLoading}
            title="Expense Categories"
          />
        </div>

        {/* Budget Comparison Chart */}
        {analytics?.budgetComparison && analytics.budgetComparison.length > 0 && (
          <div className="mb-8">
            <BudgetComparisonChart
              data={analytics.budgetComparison}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Budget Summary Cards */}
        {analytics?.budgetComparison && analytics.budgetComparison.length > 0 && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                     {analytics.budgetComparison.map((budget) => (
                    <div key={budget.category} className="p-4 border rounded-lg">
                      <h3 className="font-medium text-sm text-gray-900 mb-2">
                        {budget.category}
                      </h3>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Budget:</span>
                          <span className="font-medium">{formatCurrency(budget.budget)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Actual:</span>
                          <span className={`font-medium ${budget.actual > budget.budget ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(budget.actual)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Remaining:</span>
                          <span className={`font-medium ${budget.remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(budget.remaining)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div 
                            className={`h-2 rounded-full ${budget.percentage > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                          {budget.percentage.toFixed(1)}% used
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transactions List */}
        <TransactionList
          transactions={transactions}
          onAdd={handleAddTransaction}
          onUpdate={handleUpdateTransaction}
          onDelete={handleDeleteTransaction}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
