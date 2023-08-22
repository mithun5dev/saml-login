import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecordListingPage } from './record-listing.page';

const routes: Routes = [
  {
    path: '',
    component: RecordListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordListingPageRoutingModule {}
