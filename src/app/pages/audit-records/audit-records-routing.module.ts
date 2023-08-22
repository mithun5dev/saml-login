import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditRecordsPage } from './audit-records.page';

const routes: Routes = [
  {
    path: '',
    component: AuditRecordsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRecordsPageRoutingModule {}
