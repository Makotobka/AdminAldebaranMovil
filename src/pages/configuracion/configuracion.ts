import { keyStorage } from './../../providers/archivo-internos/staticConfigStorage';
import { ArchivoInternosProvider } from './../../providers/archivo-internos/archivo-internos';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { varColorBarra } from '../../app/app.config';

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

  public isDisabled;
  public FechaIni;
  public FechaFin;
  public Sucursal;  
  private antFechaIni;
  public ltSucursal:any[]=[];

  @ViewChild('tgCon') toogleConexion;
  
  constructor(private archivo:ArchivoInternosProvider,public con:ConexionHttpProvider,public view:ViewController ,public navCtrl: NavController, public navParams: NavParams) {    
    this.FechaFin = this.navParams.get("FechaFin");
    this.FechaIni = this.navParams.get("FechaIni");
    this.Sucursal = this.navParams.get("Sucursal");
    //console.log(this.Sucursal)
    this.antFechaIni = this.navParams.get("FechaIni");
    if(this.Sucursal=== undefined){
      this.Sucursal={"ID":1,"AGENCIA":"No Seleccionado"};
    }
    console.log(this.Sucursal)
  }

  ionViewDidLoad() {
    const name = this.Sucursal.AGENCIA
    this.cargarSucursales();
    this.toogleConexion.checked = this.con.isOnline;
  }

  async cargarSucursales(){
    await this.con.getAllSucursal().then(async ()=>{
      this.ltSucursal = await JSON.parse(this.con.data);
    })
  }

  Guardar(){    
    this.archivo.escribirArchivo(keyStorage.keyFechaSistema,this.FechaIni);
    let tempIni = this.FechaIni.split("T")[0];
    let tempFin = this.FechaFin.split("T")[0];
    let tempSuc;
    console.log(this.ltSucursal)
    console.log(this.Sucursal)
    for (let index = 0; index < this.ltSucursal.length; index++) {
      const element = this.ltSucursal[index];
      if(element.AGENCIA === this.Sucursal.AGENCIA || element.AGENCIA === this.Sucursal){
        tempSuc = element;
        break;
      }
    }
    console.log(tempSuc)
    if(tempSuc === undefined){
      tempSuc={"ID":1,"AGENCIA":"No Seleccionado"};
    }

    this.con.isOnline = this.toogleConexion.checked;  
    if(!this.toogleConexion.checked){
      this.FechaIni = this.antFechaIni
    }
    
    this.view.dismiss({"FechaFin":tempFin,"FechaIni":tempIni,"Sucursal":tempSuc})
  }

  getEstado(){
    if(this.con.isOnline){
      return "Conectado";
    }else{
      return "Desconectado";
    }
  }
}

