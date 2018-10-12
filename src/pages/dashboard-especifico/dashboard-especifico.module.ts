import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardEspecificoPage } from './dashboard-especifico';

@NgModule({
  declarations: [
    DashboardEspecificoPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardEspecificoPage),
  ],
})
export class DashboardEspecificoPageModule {}
