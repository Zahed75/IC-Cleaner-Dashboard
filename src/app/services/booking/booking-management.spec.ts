import { TestBed } from '@angular/core/testing';

import { BookingManagement } from './booking-management';

describe('BookingManagement', () => {
  let service: BookingManagement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingManagement);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
