import { TestBed } from '@angular/core/testing';

import { SavesService } from './saves-service';

describe('SavesService', () => {
  let service: SavesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
