import { Component, OnInit } from '@angular/core';
import { UserTransactionsService } from '../../services/user-transactions.service';
import { UserExpensesService } from '../../services/user-expenses.service';
import { Transaction } from '../../models/transaction.model';
import { MonthlyExpense } from '../../models/monthly-expense.model';

@Component({
  selector: 'app-dashboard-expenses-broken-down',
  templateUrl: './dashboard-expenses-broken-down.component.html',
  styleUrls: ['./dashboard-expenses-broken-down.component.css']
})
export class DashboardExpensesBrokenDownComponent implements OnInit {
  data: any;
  tableData: { category: string, amount: number, percentage: string }[] = [];
  expenses: Transaction[] = [];
  totalExpenses: number = 0;
  expenseCategories: any[] = [];

  constructor(
    private userTransactionsService: UserTransactionsService,
    private userExpensesService: UserExpensesService
  ) { }

  ngOnInit() {
    this.expenseCategories = this.userTransactionsService.getExpenseCategories();
    this.fetchTransactionsAndExpenses();
  }

  fetchTransactionsAndExpenses() {
    this.userTransactionsService.getExpenseTransactions().subscribe({
      next: (expenses: Transaction[]) => {
        this.expenses = expenses;
        this.totalExpenses = expenses.reduce((sum, current) => sum + current.amount, 0);
        this.fetchMonthlyExpenses();
      },
      error: error => console.error('Error fetching expense transactions:', error)
    });
  }

  fetchMonthlyExpenses() {
    this.userExpensesService.getAllMonthlyExpenses().subscribe({
      next: (monthlyExpenses: MonthlyExpense[]) => {
        this.mergeExpensesAndCalculate(monthlyExpenses);
      },
      error: error => console.error('Error fetching monthly expenses:', error)
    });
  }

  mergeExpensesAndCalculate(monthlyExpenses: MonthlyExpense[]) {
    const monthlyExpenseAsTransactions: Transaction[] = monthlyExpenses.map(me => ({
      id: me.id ?? '',
      name: me.name ?? 'Unnamed',
      description: me.description ?? 'no description',
      amount: me.amount ?? 0,
      date: new Date(),
      category: 'Monthly Expenses',
      isRecurring: true,
      transactionType: 'Expense'
    }));

    this.expenses = [...this.expenses, ...monthlyExpenseAsTransactions];
    this.totalExpenses += monthlyExpenseAsTransactions.reduce((sum, current) => sum + current.amount, 0);
    this.assignPercentages();
    this.updateChartData();
  }

  assignPercentages() {
    this.expenses = this.expenses.map(expense => ({
      ...expense,
      percentage: ((expense.amount / this.totalExpenses) * 100).toFixed(2) + '%'
    }));
  }
  prepareTableData(aggregatedExpenses: Map<string, number>) {
    this.tableData = Array.from(aggregatedExpenses).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / this.totalExpenses) * 100).toFixed(2) + '%'
    }));
  }

  updateChartData() {
    const aggregatedExpenses = this.aggregateExpensesByCategory();
    this.prepareTableData(aggregatedExpenses);
    this.data = {
      labels: Array.from(aggregatedExpenses.keys()),
      datasets: [{
        data: Array.from(aggregatedExpenses.values()),
        backgroundColor: Array.from(aggregatedExpenses.keys()).map(category => this.getColor(category)),
        hoverBackgroundColor: Array.from(aggregatedExpenses.keys()).map(category => this.getHoverColor(category))
      }]
    };
  }


  aggregateExpensesByCategory(): Map<string, number> {
    const aggregationMap = new Map<string, number>();
    for (const expense of this.expenses) {
      const category = expense.category || 'Unknown Category';
      const currentAmount = aggregationMap.get(category) || 0;
      aggregationMap.set(category, currentAmount + expense.amount);
    }
    return aggregationMap;
  }

  getColor(category: string): string {
    const categoryColor = this.expenseCategories.find(cat => cat.name === category)?.color;
    return categoryColor || '#ccc';
  }

  getHoverColor(category: string): string {
    return this.getColor(category) + 'cc';
  }
}
