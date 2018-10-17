import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { IntFactura } from '../../estructuras/Factura';
import { ArchivoInternosProvider } from '../../providers/archivo-internos/archivo-internos';
import { keyStorage } from '../../providers/archivo-internos/staticConfigStorage';

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
  public FechaIni = new Date().toISOString();
  public FechaFin =new Date().toISOString();
  public estado:boolean
  public titulo:string;


  constructor(private archivo:ArchivoInternosProvider ,public con:ConexionHttpProvider ,public navCtrl: NavController, public navParams: NavParams) {    
    this.estado = this.navParams.get("estado");
    this.titulo = this.navParams.get("titulo");
  }

  async ionViewDidLoad() {
    this.Sucursal = await this.archivo.leerArchivo(keyStorage.keySucursal);
    if(this.estado){      
     
      this.getResumenFacV();
    }
  }

  desplegarFV(evento){
    //console.log(evento);
  }

  getResumenFacV(){  
    this.Sucursal={"ID":1};
    let tempFI=this.FechaIni.split('T')[0];
    let tempFF=this.FechaFin.split('T')[0];

    this.con.getResFac("V",tempFI,tempFF,this.Sucursal.ID).then(async (resV)=>{
      if(resV){
        this.listFV = await JSON.parse(this.con.data);     
        this.totalFV = await this.getSumatoria(this.listFV)
        this.con.getResFac("C",tempFI,tempFF,this.Sucursal.ID).then(async (resC)=>{
          if(resC){
            this.listFC = await JSON.parse(this.con.data);
            this.totalFC = await this.getSumatoria(this.listFC);            
          }         
        });      
      }else{
        console.log("Mensaje: ",this.con.mensaje,"\NCodigo: ",this.con.codigo)
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

