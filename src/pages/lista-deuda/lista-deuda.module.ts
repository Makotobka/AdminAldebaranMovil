import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListaDeudaPage } from './lista-deuda';

@NgModule({
  declarations: [
    ListaDeudaPage,
  ],
  imports: [
    IonicPageModule.forChild(ListaDeudaPage),
  ],
})
export class ListaDeudaPageModule {}
