import { TestBed } from '@angular/core/testing';

import { PromiseServiceService } from './promise-service.service';

describe('PromiseServiceService', () => {
  let service: PromiseServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PromiseServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
