import mongoose from 'mongoose';

export interface IBudget {
  category: string;
  amount: number;
  month: string; // Format: YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new mongoose.Schema<IBudget>(
  {
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
        'Other'
      ],
    },
    amount: {
      type: Number,
      required: [true, 'Budget amount is required'],
      min: [0, 'Budget amount must be positive'],
    },
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique budget per category per month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', budgetSchema); 