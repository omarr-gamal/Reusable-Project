import { Component, Input } from '@angular/core';
import { MonthlyIncome } from '../../models/monthly-income.model';

@Component({
  selector: 'app-income-report',
  templateUrl: './income-report.component.html',
  styleUrl: './income-report.component.css',
})
export class IncomeReportComponent {
  display: boolean = false;
  @Input() monthlyIncomes: MonthlyIncome[] = [];
  customizeTooltip = ({ originalValue }: Record<string, string>) => ({
    text: `${parseInt(originalValue)}%`,
  });
  showIncomeReport() {
    this.display = true;
  }
  hideIncomeReport() {
    this.display = false;
  }
  getTotalIncome() {
    return this.monthlyIncomes.reduce((sum, income) => sum + income.amount, 0);
  }
}
