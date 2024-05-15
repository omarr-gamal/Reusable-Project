import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingGoalsPageComponent } from './saving-goals-page.component';

describe('SavingGoalsPageComponent', () => {
  let component: SavingGoalsPageComponent;
  let fixture: ComponentFixture<SavingGoalsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SavingGoalsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavingGoalsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
