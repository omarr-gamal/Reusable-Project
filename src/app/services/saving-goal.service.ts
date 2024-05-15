import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import { SavingGoal } from '../models/saving-goal.model';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  Observable, combineLatest, forkJoin, from,
  map, switchMap, take
} from 'rxjs';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class SavingGoalService {

  private savingsBalance: number = 0;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) {
    this.loadBalance();
  }

  private loadBalance(): void {
    const balance = localStorage.getItem('savingsBalance');
    this.savingsBalance = balance ? parseInt(balance, 10) : 0;
  }

  addToBalance(amount: number): void {
    if (amount > 0) {
      this.savingsBalance += amount;
      this.saveBalance();
    }
  }

  removeFromBalance(amount: number): void {
    if (amount > 0 && this.savingsBalance >= amount) {
      this.savingsBalance -= amount;
      this.saveBalance();
    } else {
      console.error('Not enough balance or invalid amount');
    }
  }

  private saveBalance(): void {
    localStorage.setItem('savingsBalance', this.savingsBalance.toString());
  }

  getBalance(): number {
    return this.savingsBalance;
  }




  addsavingGoal(savingGoal: SavingGoal): Observable<String> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }

        const userId = user.uid;
        const savingGoals = this.afs.collection(`users/${userId}/savingGoals`);
        return from(savingGoals.add(savingGoal)).pipe(
          map((docRef) => {
            return docRef.id;
          }),
        );
      })
    )
  }

  /**
   * Retrieves all savingGoals for the authenticated user.
   * 
   * @return {Observable<savingGoal[]>} - An observable that emits an array of savingGoal objects including their ID.
   */
  getAllsavingGoals(): Observable<SavingGoal[]> {
    return this.auth.user$.pipe(
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const expenses = this.afs.collection<SavingGoal>(`users/${userId}/savingGoals`);
        return expenses.valueChanges({ idField: 'id' });
      })
    )
  }

  /**
   * Updates a savingGoal for the authenticated user.
   *
   * @param {string} savingGoal_id - The ID of the savingGoal to update.
   * @param {Partial<savingGoal>} changes - The partial changes to apply to the savingGoal. For example {'name': 'new name'} will update the name of the savingGoal.
   * @return {Observable<Boolean>} An observable that emits a boolean indicating the update success.
   */
  updatesavingGoal(savingGoal_id: string, changes: Partial<SavingGoal>): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const savingGoalDoc = this.afs.doc<SavingGoal>(`users/${userId}/savingGoals/${savingGoal_id}`);
        return from(savingGoalDoc.update(changes)).pipe(
          map(() => true)
        );
      })
    )
  }

  deletesavingGoal(savingGoal_id: string): Observable<Boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return new Observable<never>(observer => {
            observer.error('User not authenticated');
          });
        }
        const userId = user.uid;
        const savingGoalDoc = this.afs.doc<SavingGoal>(`users/${userId}/savingGoals/${savingGoal_id}`);
        return from(savingGoalDoc.delete()).pipe(
          map(() => true)
        );
      })
    )
  }
}
