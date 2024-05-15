import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { MonthlyExpense } from '../models/monthly-expense.model';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Observable, from,
  map, switchMap, take
} from 'rxjs';
import { UserTransactionsService } from './user-transactions.service';
import { defaultTransaction } from '../models/transaction.model';


@Injectable({
  providedIn: 'root'
})
export class UserExpensesService {

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private transactionsService: UserTransactionsService
  ) { }

  addMonthlyExpense(monthlyExpense: MonthlyExpense): Observable<String> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }

        const userId = user.uid;
        const expenses = this.afs.collection(`users/${userId}/monthly_expenses`);

        this.transactionsService.addTransaction({
          ...defaultTransaction,
          transactionType: "Expense",
          amount: monthlyExpense.amount? monthlyExpense.amount : 0,
          name: 'Monthly Expense from ' + monthlyExpense.name,
        }).subscribe()

        return from(expenses.add(monthlyExpense)).pipe(
          map((docRef) => {
            return docRef.id;
          })
        );
      })
    );
  }

  getAllMonthlyExpenses(): Observable<MonthlyExpense[]> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const expenses = this.afs.collection<MonthlyExpense>(`users/${userId}/monthly_expenses`);
        return expenses.valueChanges({ idField: 'id' });
      })
    )
  }

  updateMonthlyExpense(expense_id: string, changes: Partial<MonthlyExpense>): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const expenseDoc = this.afs.doc<MonthlyExpense>(`users/${userId}/monthly_expenses/${expense_id}`);
        return from(expenseDoc.update(changes)).pipe(
          map(() => true)
        );
      })
    )
  }

  deleteMonthlyExpense(expense_id: string): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const expenseDoc = this.afs.doc<MonthlyExpense>(`users/${userId}/monthly_expenses/${expense_id}`);
        return from(expenseDoc.delete()).pipe(
          map(() => true)
        );
      })
    )
  }
}
