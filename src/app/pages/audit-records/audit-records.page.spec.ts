import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuditRecordsPage } from './audit-records.page';

describe('AuditRecordsPage', () => {
  let component: AuditRecordsPage;
  let fixture: ComponentFixture<AuditRecordsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditRecordsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditRecordsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
