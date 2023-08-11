import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuditModulePage } from './audit-module.page';

const routes: Routes = [
  {
    path: '',
    component: AuditModulePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditModulePageRoutingModule {}
