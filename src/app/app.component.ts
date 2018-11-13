import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CajaPage } from '../pages/caja/caja';
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
  public listaOpciones:any[];

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
      case "FCM":
        //modalPage = this.modal.create(FacturasPage,{estado:false,titulo:"Facturas por Fechas"});      
      break;
      case "FBF":
        modalPage = this.modal.create(FacturasPage,{estado:false,titulo:"Facturas por Fechas"});      
      break;
      case "FGH":
        modalPage = this.modal.create(FacturasPage,{estado:true,titulo:"Facturas Actuales"});      
      break;      
      case "SMin":
        modalPage = this.modal.create(StockPage,{min:true,titulo:"Stock Minimo"});      
      break;
      case "SMax":
        modalPage = this.modal.create(StockPage,{min:false,titulo:"Stock Maximo"});      
      break;
      case "ACC":
        modalPage = this.modal.create(ListaDeudaPage,{isCliente:true});
      break;
      case "ACP":
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
    this.listaOpciones = [
      {
        Nombre:"Facturas",
        lvl:1,
        icono:"paper",
        lista:[
          {     
            codigo:"FGH",
            Nombre:"Generadas Hoy",
            lvl:2,
            eventClick:"goPage('Facturas Actuales')"
          },
          {
            codigo:"FBF",
            Nombre:"Buscar por Fechas",
            lvl:2,
            eventClick:"goPage('Facturas por Fechas')"
          },
          {
            codigo:"FCM",
            Nombre:"Comparacion de Meses",
            lvl:2,
            eventClick:"goPage('Facturas comparacion')"
          },
        ]
      },
      {
        Nombre:"Stock",
        lvl:1,
        icono:"cash",
        lista:[
          {
            codigo:"SMin",
            Nombre:"Minimo",
            lvl:2,
            eventClick:"goPage('Stock Minimo')"
          },
          {
            codigo:"SMax",
            Nombre:"Maximo",
            lvl:2,
            eventClick:"goPage('Stock Maximo')"
          }
        ]
      },
      {
        Nombre:"Activos",
        lvl:1,
        icono:"cash",
        lista:[
          {
            codigo:"ACC",
            Nombre:"Cuentas X Cobrar",
            lvl:2,
            eventClick:"goPage('Deudas de Clientes')"
          },
          {
            codigo:"ACP",
            Nombre:"Cuentas X Pagar",
            lvl:2,
            eventClick:"goPage('Deudas a Proveedores')"
          }
        ]
      }
    ]
  }

  getIconoPadre(enable:boolean){
    console.log("vvv")
    if(enable){
      return "remove";
    }else{
      return "add";
    }

  }
}

