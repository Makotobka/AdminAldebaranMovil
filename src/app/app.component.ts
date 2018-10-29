import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CajaPage } from '../pages/caja/caja';
import { DashboardEspecificoPage } from '../pages/dashboard-especifico/dashboard-especifico';
import { LoginPage } from '../pages/login/login';
import { FacturasPage } from '../pages/facturas/facturas';
import { StockPage } from '../pages/stock/stock';
import { ListaDeudaPage } from '../pages/lista-deuda/lista-deuda';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = LoginPage;

  constructor(public modal:ModalController,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  goPage(tipo:string){
    let modalPage;
    switch(tipo){
      case "Facturas por Fechas":
        modalPage = this.modal.create(FacturasPage,{estado:false,titulo:"Facturas por Fechas"});      
      break;
      case "Facturas Actuales":
        modalPage = this.modal.create(FacturasPage,{estado:true,titulo:"Facturas Actuales"});      
      break;      
      case "Stock Minimo":
        modalPage = this.modal.create(StockPage,{min:true,titulo:"Stock Minimo"});      
      break;
      case "Stock Maximo":
        modalPage = this.modal.create(StockPage,{min:false,titulo:"Stock Maximo"});      
      break;
      case "Clientes Adeudores":
        modalPage = this.modal.create(ListaDeudaPage);
      break;
    }
    modalPage.present();
  }
}

