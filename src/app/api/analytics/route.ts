import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/lib/models/Transaction';
import Budget from '@/lib/models/Budget';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    
    const startDate = new Date(month + '-01');
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    
    // Get monthly expenses by category
    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          type: 'expense'
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    // Get monthly income by category
    const monthlyIncome = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
          type: 'income'
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    // Get total expenses and income
    const totalExpenses = monthlyExpenses.reduce((sum, item) => sum + item.total, 0);
    const totalIncome = monthlyIncome.reduce((sum, item) => sum + item.total, 0);
    
    // Get recent transactions
    const recentTransactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate }
    })
      .sort({ date: -1 })
      .limit(5);
    
    // Get budgets for the month
    const budgets = await Budget.find({ month });
    
    // Calculate budget vs actual for each category
    const budgetComparison = budgets.map(budget => {
      const actualExpense = monthlyExpenses.find(exp => exp._id === budget.category);
      const actualAmount = actualExpense ? actualExpense.total : 0;
      const remaining = budget.amount - actualAmount;
      const percentage = budget.amount > 0 ? (actualAmount / budget.amount) * 100 : 0;
      
      return {
        category: budget.category,
        budget: budget.amount,
        actual: actualAmount,
        remaining,
        percentage: Math.round(percentage * 100) / 100
      };
    });
    
    return NextResponse.json({
      monthlyExpenses,
      monthlyIncome,
      totalExpenses,
      totalIncome,
      recentTransactions,
      budgetComparison,
      month
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
} 