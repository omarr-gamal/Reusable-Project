import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSummaryCardsComponent } from './dashboard-summary-cards.component';

describe('DashboardSummaryCardsComponent', () => {
  let component: DashboardSummaryCardsComponent;
  let fixture: ComponentFixture<DashboardSummaryCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardSummaryCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardSummaryCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
