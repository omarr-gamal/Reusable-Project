import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { Transaction } from '../models/transaction.model';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Observable, combineLatest, from,
  map, switchMap, take
} from 'rxjs';
import { User } from '../models/user.model';

export interface BalanceVSTime {
  date: string;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserTransactionsService {
  expenseCategories = [
    { id: 1, name: "Rent", color: "#FF6384" },
    { id: 2, name: "Food", color: "#36A2EB" },
    { id: 3, name: "Groceries", color: "#FFCE56" },
    { id: 4, name: "Transportation", color: "#4BC0C0" },
    { id: 5, name: "HealthCare", color: "#9966FF" },
    { id: 6, name: "Entertainment", color: "#FF9F40" },
    { id: 7, name: "Clothing", color: "#4D5360" },
    { id: 8, name: "Education", color: "#B2912F" },
    { id: 9, name: "Utilities", color: "#36ebc4" },
    { id: 10, name: "Miscellaneous", color: "#EBCCD1" },
    { id: 11, name: "Monthly Expenses", color: "#00C853" }
  ];


  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) { }

  getExpenseCategories() {
    return this.expenseCategories;
  }

  // getBalanceVSTime() {
  // first get all user transactions then loop over the transactions and 
  // generate the balance versus time like this 
  // [
  //   { date: '2021-01-01', balance: 200 },
  //   { date: '2021-01-02', balance: 450 },
  //   { date: '2021-01-05', balance: 320 },
  //   { date: '2021-01-21', balance: 1150 },
  //   { date: '2021-02-02', balance: 80 },
  // ];
  // }

  private _formatTransactions(transactions: Transaction[]): Transaction[] {
    return transactions.map(transaction => {
      const t = {
        ...transaction,
        date: (transaction.date as any).toDate(),
        name: 'test',
      };
      return t;
    });
  }

  getBalanceVSTime() {
    const transactions$ = this.getAllTransactions();

    return combineLatest([transactions$, this.auth.user$]).pipe(
      map(([transactions, user]) => {
        var formattedTransactions = this._formatTransactions(transactions);

        const groupedTransactions: { [date: string]: Transaction[] } = {};
        for (const transaction of formattedTransactions) {
          const dateKey = (new Date(transaction.date)).toDateString(); // Use toDateString() to only consider date, ignoring time
          if (!groupedTransactions[dateKey]) {
            groupedTransactions[dateKey] = [];
          }
          groupedTransactions[dateKey].push(transaction);
        }

        console.log(user!.joinedAt!)

        // Calculate balance versus time
        let balance = 0;
        const initialDate: Date = new Date(user!.joinedAt!); // Use joinedAt or current date as initial date
        const balanceVSTime: BalanceVSTime[] = [];

        balanceVSTime.push({ date: initialDate.toISOString().split('T')[0], balance: 0 }); // Add initial balance

        const sortedDateKeys = Object.keys(groupedTransactions).sort();

        // Calculate balance versus time for each day
        for (const dateKey of sortedDateKeys) {
          const transactionsOfDay = groupedTransactions[dateKey];
          for (const transaction of transactionsOfDay) {
            if (transaction.transactionType === "Expense") balance -= transaction.amount;
            else balance += transaction.amount;
          }
          balanceVSTime.push({ date: (new Date(dateKey)).toISOString().split('T')[0], balance });
        }

        // Sort balanceVSTime by date
        balanceVSTime.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return balanceVSTime;
      })
    );
  }

  addTransaction(transaction: Transaction): Observable<String> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }

        const userId = user.uid;
        const transactions = this.afs.collection(`users/${userId}/transactions`);

        var newBalance = user.mainWalletAmount;
        if (!transaction.isRecurring) {
          if (transaction.transactionType === "Income") newBalance += transaction.amount;
          else newBalance -= transaction.amount;
        }

        const usersCollection = this.afs.collection<User>(`users`);
        usersCollection.doc(user.uid).update({ "mainWalletAmount": newBalance })

        return from(transactions.add(transaction)).pipe(
          map((docRef) => {
            return docRef.id;
          })
        );
      })
    );
  }

  getAllTransactions(): Observable<Transaction[]> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }

        const userId = user.uid;
        const transactions = this.afs.collection<Transaction>(`users/${userId}/transactions`);

        return transactions.valueChanges({ idField: 'id' });
      })
    )
  }
  getExpenseTransactions(): Observable<Transaction[]> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const transactions = this.afs.collection<Transaction>(`users/${userId}/transactions`, ref => ref.where('transactionType', '==', 'Expense'));
        return transactions.valueChanges({ idField: 'id' });
      })
    );
  }


  updateTransaction(transaction_id: string, changes: Partial<Transaction>): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }

        const userId = user.uid;
        const transactions = this.afs.collection<Transaction>(`users/${userId}/transactions`);

        return from(transactions.doc(transaction_id).update(changes)).pipe(
          map(() => true)
        );
      })
    )
  }

  deleteTransaction(transaction_id: string): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }

        const userId = user.uid;
        const transactions = this.afs.collection<Transaction>(`users/${userId}/transactions`);

        return from(transactions.doc(transaction_id).delete()).pipe(
          map(() => true)
        );
      })
    )
  }
}
