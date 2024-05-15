import { Component, OnInit } from '@angular/core';
import { Budget } from '../../models/budget.model';
import { UserBudgetsService } from '../../services/user-budgets.service';

@Component({
  selector: 'app-budgets-page',
  templateUrl: './budgets-page.component.html',
  styleUrl: './budgets-page.component.css'
})
export class BudgetsPageComponent implements OnInit{
  constructor(private budgetService: UserBudgetsService) {}
  budgets: Budget[] = [];
  otherBudget: Budget | null = null;
  newBudget = {name:"", description:"", amount:0};
  
  totalRecords: number = 0;
  visible: boolean = false;

   
  ngOnInit() {
    this.loadAllBudgets();
  }

  showDialog() {
    this.visible = true;
  }
  loadAllBudgets() {
    this.budgetService.getAllBudgets().subscribe({
      next: (budgets) => {
        this.budgets = budgets;
        this.budgets = budgets.filter(budget => budget.name !== 'Other');
        this.otherBudget = budgets.find(budget => budget.name === 'Other') || null;
        this.totalRecords = budgets.length;
        
        console.log('Budgets loaded:', budgets);
        console.log('Other Budget:', this.otherBudget);
      },
      error: (err) => {
        console.error('Failed to load budgets:', err);
      }
    });
  }

  calculateProgress(budget: Budget): number {
    const progress = budget.progress || 0;
    return (( progress) / budget.amount) * 100;
  }

  addBudget(newBudget: any){
    this.budgetService.addBudget(newBudget).subscribe({
      next: (id) => console.log(`Added budget with ID: ${id}`),
      error: (err) => console.error('Error adding budget:', err)
    });
    this.visible=false;
  }
  isFormValid(): boolean {
    return this.newBudget.amount !== null && this.newBudget.name.trim() !== '' &&  this.newBudget.amount >= 1;;
  }

  deleteBudget(budget_id: string){
    this.budgetService.deleteBudget(budget_id).subscribe({
      next: (success) => {
        console.log('Budget deleted successfully:', success);
      },
      error: (error) => {
        console.error('Error deleting budget:', error);
      }
    });
  }
 /*addDummyBudgets() {
    const dummyBudgets: Budget[] = [
      { name: 'Snacks', description: '', amount: 5000 },
      { name: 'Electronics', description: '', amount: 30000 },
      { name: 'Stationary', description: 'for my office', amount: 1000 },
      { name: 'Pets', description: 'dont get another dog', amount: 0 },
      { name: 'Christmas gifts', description: '', amount: 5000 },
      { name: 'Makeup', description: '', amount: 1200 },
      { name: 'Snacks', description: '', amount: 5000 },
      { name: 'Electronics', description: '', amount: 30000 },
      { name: 'Stationary', description: 'for my office', amount: 1000 },
      { name: 'Pets', description: 'dont get another dog', amount: 0 },
      { name: 'Christmas gifts', description: '', amount: 5000 },
      { name: 'Makeup', description: '', amount: 1200 },
      { name: 'Snacks', description: '', amount: 5000 },
      { name: 'Electronics', description: '', amount: 30000 },
      { name: 'Stationary', description: 'for my office', amount: 1000 },
      { name: 'Pets', description: 'dont get another dog', amount: 0 },
      { name: 'Christmas gifts', description: '', amount: 5000 },
      { name: 'Makeup', description: '', amount: 1200 }
    ];

    dummyBudgets.forEach(budget => {
      this.budgetService.addBudget(budget).subscribe({
        next: (id) => console.log(`Added budget with ID: ${id}`),
        error: (err) => console.error('Error adding budget:', err)
      });
    });
  }*/
}
