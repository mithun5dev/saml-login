import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RecordListingPage } from './record-listing.page';

describe('RecordListingPage', () => {
  let component: RecordListingPage;
  let fixture: ComponentFixture<RecordListingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordListingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RecordListingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
