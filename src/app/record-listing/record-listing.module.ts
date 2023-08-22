import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecordListingPageRoutingModule } from './record-listing-routing.module';

import { RecordListingPage } from './record-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecordListingPageRoutingModule
  ],
  declarations: [RecordListingPage]
})
export class RecordListingPageModule {}
