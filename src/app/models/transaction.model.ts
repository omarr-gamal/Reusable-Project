export interface Transaction {
  id?: string;
  name?: string;
  amount: number;
  category?: string;
  description: string;
  budgetName?: string;
  transactionType: 'Income' | 'Expense';
  isRecurring?: boolean;
  date: Date;
}

export const defaultTransaction: Transaction = {
  'name': '',
  'amount': 0,
  'description': '',
  'transactionType': 'Income',
  'date': new Date(),
  'isRecurring': false
}