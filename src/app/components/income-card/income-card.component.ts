import { Component, ViewEncapsulation, Input } from '@angular/core';
import { MonthlyIncome } from '../../models/monthly-income.model';
import { FormGroup, FormControl } from '@angular/forms';
import { UserIncomesService } from '../../services/user-incomes.service';
import { ConfirmationService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-income-card',
  templateUrl: './income-card.component.html',
  styleUrl: './income-card.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService],
})
export class IncomeCardComponent {
  @Input() monthlyIncome: MonthlyIncome;
  originalMonthlyIncome: MonthlyIncome;
  editMode: boolean = false;

  constructor(
    private incomesService: UserIncomesService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig
  ) {
    this.monthlyIncome = {
      title: 'Income Name',
      description: 'Income Description',
      amount: 0,
      incomeCategory: 'Income Category',
      startDate: new Date(),
      endDate: new Date(),
      id: '',
    };
    this.originalMonthlyIncome = this.monthlyIncome;
  }

  toggleEditMode() {
    if (!this.editMode) {
      // We're entering edit mode, so store the original monthlyIncome
      this.originalMonthlyIncome = { ...this.monthlyIncome };
    }
    this.editMode = !this.editMode;
  }
  saveChanges() {
    // console.log(this.monthlyIncome);
    if (this.monthlyIncome.id) {
      this.incomesService
        .updateMonthlyIncome(this.monthlyIncome.id, this.monthlyIncome)
        .subscribe(
          (result) => {
            console.log('Income updated successfully');
            this.toggleEditMode();
          },
          (error) => {
            console.log('Error updating income: ', error);
          }
        );
    }
    this.toggleEditMode();
  }
  cancelEdit() {
    this.monthlyIncome = this.originalMonthlyIncome;
    this.toggleEditMode();
  }
  deleteIncome() {
    if (this.monthlyIncome.id) {
      this.incomesService.deleteMonthlyIncome(this.monthlyIncome.id).subscribe(
        (result) => {
          console.log('Income deleted successfully');
        },
        (error) => {
          console.log('Error deleting income: ', error);
        }
      );
    }
  }
  confirmDeletion() {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the Income Source named "${this.monthlyIncome.title}"?`,
      header: 'Delete Income Source',
      accept: () => this.deleteIncome(),
    });
  }
}
