import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMonthlyChartComponent } from './dashboard-monthly-chart.component';

describe('DashboardMonthlyChartComponent', () => {
  let component: DashboardMonthlyChartComponent;
  let fixture: ComponentFixture<DashboardMonthlyChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardMonthlyChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardMonthlyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
