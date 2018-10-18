import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';

/**
 * Generated class for the ConfiguracionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {

  public FechaIni;
  public FechaFin;
  public Sucursal;  
  public ltSucursal:any[]=[];

  constructor(public con:ConexionHttpProvider,public view:ViewController ,public navCtrl: NavController, public navParams: NavParams) {    
    this.FechaFin = this.navParams.get("FechaFin");
    this.FechaIni = this.navParams.get("FechaIni");
    this.Sucursal = this.navParams.get("Sucursal");
    if(this.Sucursal=== undefined){
      this.Sucursal={"ID":1,"AGENCIA":"No Seleccionado"};
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');
    this.cargarSucursales();
  }

  async cargarSucursales(){
    await this.con.getAllSucursal().then(async ()=>{
      this.ltSucursal = await JSON.parse(this.con.data);
    })
  }

  Guardar(){    
    let tempIni = this.FechaIni.split("T")[0];
    let tempFin = this.FechaFin.split("T")[0];
    let tempSuc;
    //console.log(this.Sucursal);
    for (let index = 0; index < this.ltSucursal.length; index++) {
      const element = this.ltSucursal[index];
      if(element.AGENCIA === this.Sucursal){
        tempSuc = element;
        break;
      }
    }

    if(tempSuc===undefined){
      tempSuc={"ID":1,"AGENCIA":"No Seleccionado"};
    }

    this.view.dismiss({"FechaFin":tempFin,"FechaIni":tempIni,"Sucursal":tempSuc})
  }

}
