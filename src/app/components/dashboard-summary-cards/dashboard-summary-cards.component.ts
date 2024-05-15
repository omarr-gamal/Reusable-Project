import { Component, OnInit } from '@angular/core';
import { UserIncomesService } from '../../services/user-incomes.service';
import { UserTransactionsService } from '../../services/user-transactions.service';
import { MonthlyIncome } from '../../models/monthly-income.model';
import { Transaction } from '../../models/transaction.model';
import { AuthService } from '../../services/auth.service';
import { SavingGoalService } from '../../services/saving-goal.service'; // Import SavingGoalService

@Component({
  selector: 'app-dashboard-summary-cards',
  templateUrl: './dashboard-summary-cards.component.html',
  styleUrls: ['./dashboard-summary-cards.component.css'],
})
export class DashboardSummaryCardsComponent implements OnInit {
  monthlyIncomeAmount: number = 0;
  expensesAmount: number = 0;
  incomeAmount: number = 0;
  balance: number = 0;
  savings: number = 0; // This will now be managed by SavingGoalService

  constructor(
    private userIncomeService: UserIncomesService,
    private userTransactionsService: UserTransactionsService,
    private authService: AuthService,
    private savingGoalService: SavingGoalService // Inject SavingGoalService
  ) { }

  ngOnInit() {
    this.userIncomeService.getAllMonthlyIncomes().subscribe({
      next: (incomes: MonthlyIncome[]) => {
        this.monthlyIncomeAmount = incomes.reduce((sum, current) => sum + current.amount, 0);
      },
      error: (error) => {
        console.error('Error fetching incomes', error);
        this.monthlyIncomeAmount = 0;
      }
    });

    this.userTransactionsService.getAllTransactions().subscribe({
      next: (transactions: Transaction[]) => {
        this.expensesAmount = transactions
          .filter(t => t.transactionType === 'Expense')
          .reduce((sum, current) => sum + current.amount, 0);
        this.incomeAmount = transactions
          .filter(t => t.transactionType === "Income")
          .reduce((sum, current) => sum + current.amount, 0);
      },
      error: (error) => {
        console.error('Error fetching transactions', error);
        this.expensesAmount = 0;
      }
    });

    this.authService.user$.subscribe(user => {
      if (user) {
        this.balance = user.mainWalletAmount;
      } else {
        this.balance = 0;
      }
    });

    this.savings = this.savingGoalService.getBalance();
  }
}
