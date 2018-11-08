import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalleDeudaClientePage } from './detalle-deuda-cliente';

@NgModule({
  declarations: [
    DetalleDeudaClientePage,
  ],
  imports: [
    IonicPageModule.forChild(DetalleDeudaClientePage),
  ],
})
export class DetalleDeudaClientePageModule {}
