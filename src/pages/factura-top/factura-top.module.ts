import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturaTopPage } from './factura-top';

@NgModule({
  declarations: [
    FacturaTopPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturaTopPage),
  ],
})
export class FacturaTopPageModule {}
