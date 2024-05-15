import { Component, inject } from '@angular/core';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPen, faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'

import { Firestore } from '@angular/fire/firestore';
import { AuthService } from './services/auth.service';
import { UserTransactionsService } from './services/user-transactions.service';
import { UserBudgetsService } from './services/user-budgets.service';
import { UserIncomesService } from './services/user-incomes.service';
import { UserExpensesService } from './services/user-expenses.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Budgy';

  // Icons
  faTrashAlt = faTrashAlt
  faPen = faPen
  faCheck = faCheck
  faXmark = faXmark 

  constructor(
    public ts: UserTransactionsService, 
    public bs: UserBudgetsService,
    public is: UserIncomesService,
    public es: UserExpensesService,
    public auth: AuthService
  ) { }

}
