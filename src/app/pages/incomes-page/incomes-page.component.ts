import { Component, OnInit } from '@angular/core';
import { MonthlyIncome } from '../../models/monthly-income.model';
import { UserIncomesService } from '../../services/user-incomes.service';

@Component({
  selector: 'app-incomes-page',
  templateUrl: './incomes-page.component.html',
  styleUrl: './incomes-page.component.css',
  providers: [UserIncomesService],
})
export class IncomesPageComponent implements OnInit {
  monthlyIncomes: MonthlyIncome[] = [];

  constructor(private userIncomesService: UserIncomesService) {}

  ngOnInit() {
    //console.log('Fetching incomes');
    this.userIncomesService.getAllMonthlyIncomes().subscribe(
      (incomes) => {
        this.monthlyIncomes = incomes;
      }
      // (error) => {
      //   console.log('Error fetching incomes: ', error);
      // }
    );
  }
}
