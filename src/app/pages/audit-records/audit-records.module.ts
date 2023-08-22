import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuditRecordsPageRoutingModule } from './audit-records-routing.module';

import { AuditRecordsPage } from './audit-records.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AuditRecordsPageRoutingModule
  ],
  declarations: [AuditRecordsPage]
})
export class AuditRecordsPageModule {}
