import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { IntFactura } from '../../estructuras/Factura';
import { FacturasPage } from '../facturas/facturas';
import { ConfiguracionPage } from '../configuracion/configuracion';

/**
 * Generated class for the DashboardGeneralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard-general',
  templateUrl: 'dashboard-general.html',
})
export class DashboardGeneralPage {

  private IDSU:number=1;

  public listFC;
  public listFV;

  public totalFC;
  public totalFV;

  private FechaIni="";
  private FechaFin="";

  constructor(public modal:ModalController ,public con:ConexionHttpProvider,public navCtrl: NavController, public navParams: NavParams) {
    let temp: string = new Date().toISOString();
    let tempAux = temp.split("T")[0];
    this.FechaFin = tempAux;
    this.FechaIni = tempAux;
  }

  ionViewDidLoad() {
    this.sincronizar();
  }

  getResumenFacV(){
    //this.myDate = this.myDate.split("T")[0];
    this.con.getResFac("V",this.FechaIni,this.FechaFin).then((op)=>{
      this.listFV = JSON.parse(this.con.data);     
      this.totalFV = this.getSumatoria(this.listFV)
      console.log(this.listFV)
      this.con.getResFac("C",this.FechaIni,this.FechaFin).then(()=>{
        this.listFC = JSON.parse(this.con.data);
        this.totalFC = this.getSumatoria(this.listFC);
      });      
    });    
  }

  getSumatoria(listContar:IntFactura[]){
    let total=0;
    listContar.forEach(element => {
      if(element.Estado==="VIGENTE")
      total+=element.Total;
    });
    return total;
  }

  detalleFacturacion(){
    let goPage = this.modal.create(FacturasPage,{FV:this.listFV,FC:this.listFC,TV:this.totalFV,TC:this.totalFC});
    goPage.present();
  }

  sincronizar(){
    this.getResumenFacV();
    this.getStockBajo();
  }

  configurar(){
    let config = this.modal.create(ConfiguracionPage,{"FechaFin":this.FechaFin,"FechaIni":this.FechaIni});
    config.present();
    config.onDidDismiss((data)=>{
      console.log(data);
      if(data!==null && data!==undefined){
        this.FechaFin = data.FechaFin
        this.FechaIni = data.FechaIni
        this.sincronizar();
      }      
    })
  }

  getStockBajo(){
    
    this.con.getStockBajo(this.IDSU).then(data=>{
      console.log(data);
    })
  }
}
