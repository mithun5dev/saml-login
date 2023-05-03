import { TestBed } from '@angular/core/testing';

import { IndicatorRecordUserAccessServiceService } from './indicator-record-user-access-service.service';

describe('IndicatorRecordUserAccessServiceService', () => {
  let service: IndicatorRecordUserAccessServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicatorRecordUserAccessServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
