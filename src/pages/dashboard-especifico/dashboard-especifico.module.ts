import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {ChartsModule} from 'ng2-charts/charts/charts';
import { DashboardEspecificoPage } from './dashboard-especifico';
import '../../../../node_modules/chart.js/dist/Chart.bundle.min.js'; 

@NgModule({
  declarations: [
    DashboardEspecificoPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardEspecificoPage),
    ChartsModule
  ],
  exports:[
    DashboardEspecificoPage
  ]
})
export class DashboardEspecificoPageModule {}
