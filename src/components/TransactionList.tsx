'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ITransaction } from '@/lib/models/Transaction';
import TransactionForm from './TransactionForm';
import { Edit, Trash2, Plus } from 'lucide-react';

interface TransactionListProps {
  transactions: ITransaction[];
  onUpdate: (id: string, data: Partial<ITransaction>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAdd: (data: Partial<ITransaction>) => Promise<void>;
  isLoading?: boolean;
}

export default function TransactionList({
  transactions,
  onUpdate,
  onDelete,
  onAdd,
  isLoading = false
}: TransactionListProps) {
  const [editingTransaction, setEditingTransaction] = useState<ITransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (transaction: ITransaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setEditingTransaction(null);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (data: Partial<ITransaction>) => {
    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        await onUpdate(editingTransaction._id, data);
      } else {
        await onAdd(data);
      }
      setIsDialogOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Food & Dining': 'bg-orange-100 text-orange-800',
      'Transportation': 'bg-blue-100 text-blue-800',
      'Shopping': 'bg-purple-100 text-purple-800',
      'Entertainment': 'bg-pink-100 text-pink-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Education': 'bg-green-100 text-green-800',
      'Housing': 'bg-gray-100 text-gray-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Insurance': 'bg-indigo-100 text-indigo-800',
      'Savings': 'bg-emerald-100 text-emerald-800',
      'Investment': 'bg-teal-100 text-teal-800',
      'Salary': 'bg-green-100 text-green-800',
      'Freelance': 'bg-cyan-100 text-cyan-800',
      'Other': 'bg-slate-100 text-slate-800',
    };
    return colors[category] || 'bg-slate-100 text-slate-800';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}
              </DialogTitle>
            </DialogHeader>
            <TransactionForm
              transaction={editingTransaction || undefined}
              onSubmit={handleSubmit}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No transactions found. Add your first transaction to get started!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {transaction.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(transaction.category)}>
                        {transaction.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === 'expense' ? 'destructive' : 'default'}>
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}>
                        {transaction.type === 'expense' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(transaction._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 