import { TestBed } from '@angular/core/testing';

import { UserExpensesService } from './user-expenses.service';

describe('UserExpensesService', () => {
  let service: UserExpensesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExpensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
