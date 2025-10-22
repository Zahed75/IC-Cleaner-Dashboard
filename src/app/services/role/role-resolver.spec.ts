import { TestBed } from '@angular/core/testing';

import { RoleResolver } from './role-resolver';

describe('RoleResolver', () => {
  let service: RoleResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
