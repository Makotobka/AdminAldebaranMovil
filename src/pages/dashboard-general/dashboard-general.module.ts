import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardGeneralPage } from './dashboard-general';

@NgModule({
  declarations: [
    DashboardGeneralPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardGeneralPage),
  ],
})
export class DashboardGeneralPageModule {}
