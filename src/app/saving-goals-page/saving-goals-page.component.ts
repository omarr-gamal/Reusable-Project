import { Component, OnInit } from '@angular/core';
import { SavingGoalService } from '../services/saving-goal.service';
import { SavingGoal } from '../models/saving-goal.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-saving-goals-page',
  templateUrl: './saving-goals-page.component.html',
  styleUrls: ['./saving-goals-page.component.css']
})
export class SavingGoalsPageComponent implements OnInit {
  savingGoals: SavingGoal[] = [];
  newSavingGoal: SavingGoal = { name: "", description: "", amount: 0 };
  visible: boolean = false;
  amountToAddOrRemove: number = 0;
  currentBalance: number = 0;


  constructor(private savingGoalService: SavingGoalService,) {
    this.updateBalanceDisplay();

  }

  ngOnInit() {
    this.loadAllSavingGoals();

  }
  updateBalanceDisplay() {
    this.currentBalance = this.savingGoalService.getBalance();
  }
  addToBalance() {
    this.savingGoalService.addToBalance(this.amountToAddOrRemove);
    this.updateBalanceDisplay();
  }
  removeFromBalance() {
    this.savingGoalService.removeFromBalance(this.amountToAddOrRemove);
    this.updateBalanceDisplay();
  }


  loadAllSavingGoals() {
    this.savingGoalService.getAllsavingGoals().subscribe({
      next: (goals) => {
        this.savingGoals = goals;
        console.log('Saving goals loaded:', goals);
      },
      error: (err) => console.error('Failed to load saving goals:', err)
    });
  }

  showDialog() {
    this.visible = true;
  }

  addSavingGoal() {
    if (this.isFormValid()) {
      this.savingGoalService.addsavingGoal(this.newSavingGoal).subscribe({
        next: (id) => {
          console.log(`Added saving goal with ID: ${id}`);
          this.visible = false;
          this.loadAllSavingGoals();
        },
        error: (err) => console.error('Error adding saving goal:', err)
      });
    }
  }

  isFormValid(): boolean {
    return this.newSavingGoal.amount !== null &&
      this.newSavingGoal.name.trim() !== '' &&
      this.newSavingGoal.amount > 0;
  }

  deleteSavingGoal(goalId: string) {
    this.savingGoalService.deletesavingGoal(goalId).subscribe({
      next: (success) => {
        console.log('Saving goal deleted successfully:', success);
        this.loadAllSavingGoals();
      },
      error: (err) => console.error('Error deleting saving goal:', err)
    });
  }
  calculateProgress(goal: SavingGoal): number {
    if (goal.amount === 0) {
      return 0;
    }
    const progress = (this.currentBalance / goal.amount) * 100;
    const cappedProgress = Math.min(parseFloat(progress.toFixed(2)), 100);
    return cappedProgress;
  }


}
