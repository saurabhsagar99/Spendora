import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('MONGODB_URI starts with:', process.env.MONGODB_URI?.substring(0, 20) + '...');
    
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'MONGODB_URI environment variable is not set',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
    
    await dbConnect();
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'MongoDB connected successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'MongoDB connection failed',
        error: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 