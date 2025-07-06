import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Transaction from '@/lib/models/Transaction';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    
    const query: Record<string, unknown> = {};
    
    if (month) {
      const startDate = new Date(month + '-01');
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(100);
    
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { amount, date, description, category, type } = body;
    
    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }
    
    if (!description || description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }
    
    if (!type || !['expense', 'income'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either expense or income' },
        { status: 400 }
      );
    }
    
    const transaction = new Transaction({
      amount,
      date: date ? new Date(date) : new Date(),
      description: description.trim(),
      category,
      type,
    });
    
    const savedTransaction = await transaction.save();
    return NextResponse.json(savedTransaction, { status: 201 });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
} 