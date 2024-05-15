import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomPanelComponent } from './custom-panel.component';

describe('CustomPanelComponent', () => {
  let component: CustomPanelComponent;
  let fixture: ComponentFixture<CustomPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
