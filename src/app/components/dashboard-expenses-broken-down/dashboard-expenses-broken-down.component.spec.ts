import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExpensesBrokenDownComponent } from './dashboard-expenses-broken-down.component';

describe('DashboardExpensesBrokenDownComponent', () => {
  let component: DashboardExpensesBrokenDownComponent;
  let fixture: ComponentFixture<DashboardExpensesBrokenDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardExpensesBrokenDownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardExpensesBrokenDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
