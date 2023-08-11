import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuditModulePageRoutingModule } from './audit-module-routing.module';

import { AuditModulePage } from './audit-module.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditModulePageRoutingModule
  ],
  declarations: [AuditModulePage]
})
export class AuditModulePageModule {}
