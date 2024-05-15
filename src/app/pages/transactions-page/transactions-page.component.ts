import { UserTransactionsService } from './../../services/user-transactions.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Transaction } from '../../models/transaction.model';
import { Observable, Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { Budget } from '../../models/budget.model';
import { UserBudgetsService } from '../../services/user-budgets.service';
import { UserExpensesService } from '../../services/user-expenses.service';
import { MonthlyExpense } from '../../models/monthly-expense.model';

@Component({
  selector: 'app-transactions-page',
  templateUrl: './transactions-page.component.html',
  styleUrls: ['./transactions-page.component.css']
})
export class TransactionsPageComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  expenseCategories: any[] = [];

  expenseBudgets: Budget[] = [];
  dropdownBudgets: { label: string; value: string }[] = [];
  otherBudget: Budget | null = null;


  transactions: Transaction[] = [];
  monthlyExpenses: MonthlyExpense[] = [];
  transactionSubscription: Subscription | undefined;
  expensesSubscription: Subscription | undefined;
  tempExpense: MonthlyExpense = { id: "", name: "", description: "", amount: 0 }

  selectedDate: Date = new Date();
  allFilled: boolean = true;
  selectedTransactions: Transaction[] = [];
  showAddExpenseModal: boolean = false;
  showEditExpenseModal: boolean = false;
  showMonthlyExpensesModal: boolean = false;

  tempTransaction: Transaction = { id: '', name: '', date: new Date(), category: '', amount: 0, isRecurring: false, description: '', transactionType: "Expense", budgetName: '' };
  formattedDate = this.formatDate(this.tempTransaction.date)
  constructor(
    private transactionService: UserTransactionsService,
    private expensesService: UserExpensesService,
    private budgetService: UserBudgetsService
  ) { }
  ngOnInit() {
    this.transactions = [];
    this.expenseCategories = this.transactionService.getExpenseCategories();
    this.getTransactions();
    this.getAllMonthlyExpenses();
    this.loadAllBudgets();

  }
  ngOnDestroy() {
    if (this.transactionSubscription) {
      this.transactionSubscription.unsubscribe();
    }
    if (this.expensesSubscription) {
      this.expensesSubscription.unsubscribe();
    }
  }
  loadAllBudgets() {
    this.budgetService.getAllBudgets().subscribe({
      next: (budgets) => {
        this.expenseBudgets = budgets; // Keep the original budgets
        this.dropdownBudgets = budgets.filter(budget => budget.name !== 'Other')
          .map(budget => ({
            label: budget.name,
            value: budget.id ? budget.id : '' // Ensure value is not undefined
          }));
        this.otherBudget = budgets.find(budget => budget.name === 'Other') || null;
        console.log('Budgets loaded:', this.expenseBudgets);
        console.log('Dropdown Budgets:', this.dropdownBudgets);
        console.log('Other Budget:', this.otherBudget);
      },
      error: (err) => {
        console.error('Failed to load budgets:', err);
      }
    });
  }


  getTransactions() {
    this.transactionSubscription = this.transactionService.getAllTransactions()
      .subscribe({
        next: (transactions: Transaction[]) => {
          this.transactions = transactions.filter(transaction => transaction.transactionType === "Expense");
        },
        error: (error) => {
          console.error('Error fetching transactions:', error);
        }
      });
    this.transactions.forEach(transaction => {
      console.log(transaction);
    });
  }
  getAllMonthlyExpenses() {
    this.expensesService.getAllMonthlyExpenses().subscribe(
      (expenses: MonthlyExpense[]) => {
        // Assign fetched expenses to the monthlyExpenses array
        this.monthlyExpenses = expenses;
        console.log(this.monthlyExpenses)
      },
      (error) => {
        console.error('Error fetching monthly expenses:', error);
      }
    );
  }
  addNewTransaction() {
    if (this.tempTransaction.name && this.tempTransaction.date && this.tempTransaction.category && this.tempTransaction.amount) {
      this.allFilled = true;
      this.tempTransaction.category = this.expenseCategories[Number(this.tempTransaction.category) - 1].name;
      this.transactionService.addTransaction(this.tempTransaction).subscribe(
        () => {
          this.showAddExpenseModal = false;
          this.tempTransaction = { id: '', name: '', date: new Date(), category: '', amount: 0, isRecurring: false, description: '', transactionType: "Expense", budgetName: '' };
          this.getTransactions();
        },
        (error) => {
          console.error('Error adding transaction:', error);
        }
      );

      if (this.tempTransaction.isRecurring) {
        this.tempExpense.name = this.tempTransaction.name;
        this.tempExpense.description = this.tempTransaction.category;
        this.tempExpense.amount = this.tempTransaction.amount;
        this.expensesService.addMonthlyExpense(this.tempExpense).subscribe(
          () => {
            this.showAddExpenseModal = false;
            this.tempTransaction = { id: '', name: '', date: new Date(), category: '', amount: 0, isRecurring: false, description: '', transactionType: "Expense", budgetName: '' };
            this.getTransactions();
            this.getAllMonthlyExpenses();
          },
          (error) => {
            console.error('Error adding monthly expense:', error);
          }
        );
      }
    } else {
      this.allFilled = false;
    }

  }
  createRecurringExpense() {
    this.showMonthlyExpensesModal = false;
    this.tempTransaction.isRecurring = true;
    this.openAddExpenseModal()
  }
  filterGlobal(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt) {
      this.dt.filterGlobal(inputElement.value, 'contains');
    }
  }
  //TODO: Revise later not working
  filterDate(event: any) {
    if (this.selectedDate instanceof Date) {
      const selectedYear = this.selectedDate.getFullYear();
      const selectedMonth = this.selectedDate.getMonth() + 1;

      // Construct the start and end dates for the selected month
      const startDate = new Date(selectedYear, selectedMonth - 1, 1); // Month in JavaScript Date starts from 0
      const endDate = new Date(selectedYear, selectedMonth, 0); // Last day of the selected month

      // Apply filter to the 'date' column of the table
      if (this.dt) {
        // Filter transactions within the selected month
        this.dt.filter(
          (transactionDate: Timestamp) => {
            const date = transactionDate.toDate();
            return date.getFullYear() === selectedYear && date.getMonth() + 1 === selectedMonth;
          },
          'date',
          'custom'
        );
      } else {
        console.error("DataTable instance not found.");
      }
    } else {
      console.error("Invalid date format.");
    }
  }

  onClearDate() {
    if (this.dt) {
      this.dt.clear();
    }
  }
  deleteTransaction(transaction: Transaction) {
    console.log("here");
    // Check if transaction.id is defined before accessing it
    if (transaction.id !== undefined && transaction.id !== null) {
      const transactionId = transaction.id;

      // Call deleteTransaction with the transaction ID
      this.transactionService.deleteTransaction(transactionId).subscribe({
        next: () => {
          console.log('Transaction deleted successfully.');
          // Refresh transactions after deletion
          this.getTransactions();
        },
        error: (error) => {
          console.error('Error deleting transaction:', error);
        }
      });
    } else {
      console.error('Transaction ID is undefined or null.');
    }
  }
  deleteExpense(expense: MonthlyExpense): void {
    if (!expense.id) {
      console.error('Expense ID is undefined.');
      return;
    }

    this.expensesService.deleteMonthlyExpense(expense.id).subscribe({
      next: () => {
        console.log('Expense deleted successfully.');
        // Remove the deleted expense from the monthlyExpenses array
        this.monthlyExpenses = this.monthlyExpenses.filter(e => e.id !== expense.id);
      },
      error: (error) => {
        console.error('Error deleting expense:', error);
      }
    });
    this.getAllMonthlyExpenses()
  }


  formatDate(inputDate: Date): string {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    console.log(`${day}-${month}-${year}`)
    return `${day}/${month}/${year}`;
  }

  openAddExpenseModal() {
    this.showAddExpenseModal = true;
  }
  openEditExpenseModal() {
    this.showEditExpenseModal = true;
  }
  openMonthlyExpensesModal() {
    this.showMonthlyExpensesModal = true;
  }


  deleteSelectedTransactions() {
    if (this.selectedTransactions.length > 0) {
      this.selectedTransactions.forEach(transaction => {
        this.deleteTransaction(transaction);
      });
    } else {
      console.log("No transactions selected.");
    }
  }




  editTransaction(transaction: Transaction) {
    this.tempTransaction = { ...transaction }; // Create a copy of the selected expense
    console.log(this.tempTransaction)
    this.showEditExpenseModal = true; // Open the edit modal

  }

  saveExpense() {
    if (this.tempTransaction && this.tempTransaction.id) {
      const changes: Partial<Transaction> = { ...this.tempTransaction };
      const transaction_id = this.tempTransaction.id; // Assuming transaction ID is stored as string
      delete changes.id; // Remove the ID property from changes object
      this.transactionService.updateTransaction(transaction_id, changes).subscribe({
        next: () => {
          console.log('Expense updated successfully.');
          // Refresh transactions after update
          this.getTransactions();
          this.showEditExpenseModal = false; // Close the edit modal
        },
        error: (error) => {
          console.error('Error updating expense:', error);
        }
      });
    }
  }



}
