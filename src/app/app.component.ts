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
import { ArchivoInternosProvider } from '../providers/archivo-internos/archivo-internos';
import { ConexionHttpProvider } from '../providers/conexion-http/conexion-http';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = LoginPage;

  constructor(private con:ConexionHttpProvider,private archivo:ArchivoInternosProvider, public modal:ModalController,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.InformacionArranque();
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
      case "Deudas de Clientes":
        modalPage = this.modal.create(ListaDeudaPage,{isCliente:true});
      break;
      case "Deudas a Proveedores":
        modalPage = this.modal.create(ListaDeudaPage,{isCliente:false});
      break;

    }
    modalPage.present();
  }

  async InformacionArranque(){
    let resOnline = await this.archivo.leerArchivo("keyIsOnline");
    if(resOnline === null || resOnline === undefined){
      this.con.isOnline = true;
    }else{
      this.con.isOnline = resOnline;
    }
    console.log(resOnline);
  }
}

