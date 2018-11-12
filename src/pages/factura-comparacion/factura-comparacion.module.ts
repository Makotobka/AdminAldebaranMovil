import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FacturaComparacionPage } from './factura-comparacion';

@NgModule({
  declarations: [
    FacturaComparacionPage,
  ],
  imports: [
    IonicPageModule.forChild(FacturaComparacionPage),
  ],
})
export class FacturaComparacionPageModule {}
