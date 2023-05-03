import { TestBed } from '@angular/core/testing';

import { LoginIntervalService } from './login-interval.service';

describe('LoginIntervalService', () => {
  let service: LoginIntervalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginIntervalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
