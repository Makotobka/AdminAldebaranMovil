import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleCajaPage } from './detalle-caja';

@NgModule({
  declarations: [
    DetalleCajaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleCajaPage),
  ],
})
export class DetalleCajaPageModule {}
