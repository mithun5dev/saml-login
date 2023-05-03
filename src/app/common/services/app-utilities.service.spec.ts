import { TestBed } from '@angular/core/testing';

import { AppUtilitiesService } from './app-utilities.service';

describe('AppUtilitiesService', () => {
  let service: AppUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
