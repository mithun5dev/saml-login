import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuditModulePage } from './audit-module.page';

describe('AuditModulePage', () => {
  let component: AuditModulePage;
  let fixture: ComponentFixture<AuditModulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditModulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditModulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
