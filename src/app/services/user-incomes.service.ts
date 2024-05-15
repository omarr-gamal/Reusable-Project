import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { MonthlyIncome } from '../models/monthly-income.model';

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
export class UserIncomesService {

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private transactionsService: UserTransactionsService
  ) { }

  addMonthlyIncome(monthlyIncome: MonthlyIncome): Observable<String> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        
        const userId = user.uid;
        const incomes = this.afs.collection(`users/${userId}/monthly_incomes`);

        this.transactionsService.addTransaction({
          ...defaultTransaction,
          transactionType: "Income",
          amount: monthlyIncome.amount,
          name: 'Monthly Income from ' + monthlyIncome.title,
          category: monthlyIncome.incomeCategory
        }).subscribe()

        return from(incomes.add(monthlyIncome)).pipe(
          map((docRef) => {
            return docRef.id;
          })
        );
      })
    );
  }

  getAllMonthlyIncomes(): Observable<MonthlyIncome[]> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const incomes = this.afs.collection<MonthlyIncome>(`users/${userId}/monthly_incomes`);
        return incomes.valueChanges({ idField: 'id' });
      })
    )
  }

  updateMonthlyIncome(income_id: string, changes: Partial<MonthlyIncome>): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const incomeDoc = this.afs.doc<MonthlyIncome>(`users/${userId}/monthly_incomes/${income_id}`);
        return from(incomeDoc.update(changes)).pipe(
          map(() => true)
        );
      })
    )
  }

  deleteMonthlyIncome(income_id: string): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const incomeDoc = this.afs.doc<MonthlyIncome>(`users/${userId}/monthly_incomes/${income_id}`);
        return from(incomeDoc.delete()).pipe(
          map(() => true)
        );
      })
    )
  }
}
