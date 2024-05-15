import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserIncomesService } from '../../services/user-incomes.service';

@Component({
  selector: 'app-add-income-dialog',
  templateUrl: './add-income-dialog.component.html',
  styleUrl: './add-income-dialog.component.css',
})
export class AddIncomeDialogComponent {
  display: boolean = false;
  incomeForm: FormGroup = new FormGroup({});
  incomeCategories: string[] = ['Salary', 'Business', 'Investment', 'Other'];

  constructor(
    private formBuilder: FormBuilder,
    private incomeService: UserIncomesService
  ) {}

  ngOnInit(): void {
    this.incomeForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      amount: [null, Validators.required],
      incomeCategory: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, this.validateEndDate.bind(this)]],
    });
  }

  showDialog() {
    this.display = true;
  }
  saveIncome() {
    console.log('Saving income');
    console.log(this.incomeForm.value);
    this.incomeService.addMonthlyIncome(this.incomeForm.value).subscribe(
      (response) => {
        console.log('Income saved', response);
      },
      (error) => {
        console.error('Error saving income', error);
      }
    );
    this.display = false;
  }

  // Custom validator function for end date validation
  validateEndDate(control: FormGroup) {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      return { endDateInvalid: true };
    }

    return null;
  }
}
