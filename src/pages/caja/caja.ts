import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { ApeCaja } from '../../estructuras/ApeCaja';

/**
 * Generated class for the CajaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-caja',
  templateUrl: 'caja.html',
})
export class CajaPage {

  public selSucursal;

  constructor(public navCtrl: NavController, public navParams: NavParams, public con:ConexionHttpProvider) {
    this.selSucursal="Apertura"; // Por defecto
  }

  ionViewDidLoad() {
    this.con.getCaja(1,true).then((x)=>{
      if(x){
        let temp:ApeCaja[] = JSON.parse(this.con.data)
        console.log("=>",temp);
      }
    });
  }

  verificarSolicitud(){
    
  }
}
