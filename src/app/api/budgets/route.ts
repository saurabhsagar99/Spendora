import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Budget from '@/lib/models/Budget';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);
    
    const budgets = await Budget.find({ month }).sort({ category: 1 });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { category, amount, month } = body;
    
    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Budget amount must be a positive number' },
        { status: 400 }
      );
    }
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }
    
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json(
        { error: 'Month must be in YYYY-MM format' },
        { status: 400 }
      );
    }
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({ category, month });
    
    if (existingBudget) {
      // Update existing budget
      const updatedBudget = await Budget.findByIdAndUpdate(
        existingBudget._id,
        { amount },
        { new: true, runValidators: true }
      );
      return NextResponse.json(updatedBudget);
    } else {
      // Create new budget
      const budget = new Budget({
        category,
        amount,
        month,
      });
      
      const savedBudget = await budget.save();
      return NextResponse.json(savedBudget, { status: 201 });
    }
  } catch (error) {
    console.error('Error creating/updating budget:', error);
    return NextResponse.json(
      { error: 'Failed to create/update budget' },
      { status: 500 }
    );
  }
} 