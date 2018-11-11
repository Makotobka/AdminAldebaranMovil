import { keyStorage } from './../../providers/archivo-internos/staticConfigStorage';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { IntFactura } from '../../estructuras/Factura';
import { ArchivoInternosProvider } from '../../providers/archivo-internos/archivo-internos';
import { ShowMessageProvider } from '../../providers/show-message/show-message';

/**
 * Generated class for the FacturasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-facturas',
  templateUrl: 'facturas.html',
})
export class FacturasPage {
  public Sucursal={"ID":1};
  public listFC;
  public listFV;
  public totalFC;
  public totalFV;
  public estado:boolean;
  public titulo:string;
  public FechaIni:Date;
  public FechaFin:Date;


  constructor(private show:ShowMessageProvider,private archivo:ArchivoInternosProvider ,public con:ConexionHttpProvider ,public navCtrl: NavController, public navParams: NavParams) {    
    this.estado = this.navParams.get("estado");
    this.titulo = this.navParams.get("titulo");
    this.FechaIni = new Date();
    this.FechaFin = new Date();
  }

  async ionViewDidLoad() {
    this.Sucursal = await this.archivo.leerArchivo(keyStorage.keySucursal);    
    if(this.estado){    
      let fecha = await this.archivo.leerArchivo(keyStorage.keyFechaSistema);
      await this.getResumenFacV(fecha);       
    }
  }

  desplegarFV(evento){
  }

  getResumenFacV(FechaSystema){  
    this.show.detenerTiempo("Buscando Facturas de Ventas");
    this.Sucursal={"ID":1};    
    let tempFI;
    let tempFF;
    if(FechaSystema === undefined){
      tempFI = this.FechaIni;
      tempFF = this.FechaFin;
    }else{
      tempFI=FechaSystema.split('T')[0];
      tempFF=FechaSystema.split('T')[0];
    }
    this.con.getResFac("V",tempFI,tempFF,this.Sucursal.ID).then(async (resV)=>{
      if(resV){
        this.show.changeContentLoading("Buscando Facturas de Compras");
        this.listFV = await JSON.parse(this.con.data);     
        this.totalFV = await this.getSumatoria(this.listFV)
        this.con.getResFac("C",tempFI,tempFF,this.Sucursal.ID).then(async (resC)=>{
          if(resC){
            this.listFC = await JSON.parse(this.con.data);
            this.totalFC = await this.getSumatoria(this.listFC);  
            this.show.continuarTiempo();          
          }         
        });      
      }
    });    
  }

  async getSumatoria(listContar:IntFactura[]){
    let total=0;
    await listContar.forEach(element => {
      if(element.Estado==="VIGENTE")
      total+=element.Total;
    });
    return total;
  }

}

