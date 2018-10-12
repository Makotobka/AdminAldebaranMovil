import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CajaPage } from './caja';

@NgModule({
  declarations: [
    CajaPage,
  ],
  imports: [
    IonicPageModule.forChild(CajaPage),
  ],
})
export class CajaPageModule {}
