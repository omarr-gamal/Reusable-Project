import { TestBed } from '@angular/core/testing';

import { UserIncomesService } from './user-incomes.service';

describe('UserIncomesService', () => {
  let service: UserIncomesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIncomesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
