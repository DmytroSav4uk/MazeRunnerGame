import { TestBed } from '@angular/core/testing';

import { PublicFunctions } from './public-functions';

describe('PublicFunctions', () => {
  let service: PublicFunctions;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PublicFunctions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
