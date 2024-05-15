import { Component } from '@angular/core';

import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../../services/auth.service';

import { UserBudgetsService } from '../../services/user-budgets.service';
import { UserIncomesService } from '../../services/user-incomes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(
    public firestore: Firestore, 
    public auth: AuthService, 
    public userBudgetsService: UserBudgetsService,
    public userIncomesService: UserIncomesService
  ) {
    
  }
}
