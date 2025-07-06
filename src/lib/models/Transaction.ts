import mongoose from 'mongoose';

export interface ITransaction {
  _id: string;
  amount: number;
  date: Date;
  description: string;
  category: string;
  type: 'expense' | 'income';
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Food & Dining',
        'Transportation',
        'Shopping',
        'Entertainment',
        'Healthcare',
        'Education',
        'Housing',
        'Utilities',
        'Insurance',
        'Savings',
        'Investment',
        'Salary',
        'Freelance',
        'Other'
      ],
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['expense', 'income'],
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
transactionSchema.index({ date: -1 });
transactionSchema.index({ category: 1 });
transactionSchema.index({ type: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', transactionSchema); 