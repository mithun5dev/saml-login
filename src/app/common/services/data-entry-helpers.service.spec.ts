import { TestBed } from '@angular/core/testing';

import { DataEntryHelpersService } from './data-entry-helpers.service';

describe('DataEntryHelpersService', () => {
  let service: DataEntryHelpersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataEntryHelpersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
