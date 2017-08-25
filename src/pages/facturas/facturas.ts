import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, DateTime } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { IntFactura } from '../../estructuras/Factura';

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
  public Sucursal={"ID":1};;
  public listFC;
  public listFV;

  public totalFC;
  public totalFV;

  public FechaIni = new Date().toISOString();
  public FechaFin =new Date().toISOString();


  constructor(public con:ConexionHttpProvider ,public navCtrl: NavController, public navParams: NavParams) {
    this.Sucursal = this.navParams.get("Sucursal");
    console.log(this.FechaIni)
    console.log(this.FechaFin)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacturasPage');
  }

  desplegarFV(evento){
    console.log(evento);
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
          }else{
            //console.log("Mensaje: ",this.con.mensaje,"\NCodigo: ",this.con.codigo)
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

