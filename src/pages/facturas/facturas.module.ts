import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturasPage } from './facturas';

@NgModule({
  declarations: [
    FacturasPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturasPage),
  ],
})
export class FacturasPageModule {}
