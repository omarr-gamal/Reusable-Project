import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { BalanceVSTime, UserTransactionsService } from '../../services/user-transactions.service';
import { SavingGoalService } from '../../services/saving-goal.service';
@Component({
  selector: 'app-dashboard-monthly-chart',
  templateUrl: './dashboard-monthly-chart.component.html',
  styleUrls: ['./dashboard-monthly-chart.component.css']
})
export class DashboardMonthlyChartComponent implements OnInit {
  pieChartData: any;
  balanceOverTime: any;
  options: any;
  showPieChart: boolean = false;

  constructor(
    private authService: AuthService,
    private userTransactionsService: UserTransactionsService,
    private savingGoalService: SavingGoalService
  ) { }

  ngOnInit() {
    this.initPieChart();
    this.userTransactionsService.getBalanceVSTime().subscribe(data => {
      this.updateLineChartData(data);
      console.log(data);
    });
  }

  updateLineChartData(data: BalanceVSTime[]) {
    this.balanceOverTime = {
      labels: data.map(d => d.date),
      datasets: [
        {
          label: 'Balance Over Time',
          data: data.map(d => d.balance),
          fill: true,
          borderColor: '#42A5F5',
          tension: 0.4
        }
      ]
    };
    this.options = {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    };
  }

  initPieChart() {
    this.authService.user$.subscribe(user => {
      if (user) {
        let savingBalance = this.savingGoalService.getBalance();
        this.updatePieChartData(user.mainWalletAmount, savingBalance);
        this.showPieChart = true;
      } else {
        this.showPieChart = false;
      }
    });
  }

  updatePieChartData(mainWalletAmount: number, savingWalletAmount: number) {
    this.pieChartData = {
      labels: ['Balance', 'Savings'],
      datasets: [{
        data: [mainWalletAmount, savingWalletAmount],
        backgroundColor: ['#42A5F5', '#9CCC65'],
        hoverBackgroundColor: ['#64B5F6', '#AED581']
      }]
    };
  }
}
