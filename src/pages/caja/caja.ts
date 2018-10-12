import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.selSucursal="Apertura"; // Por defecto
  }

  ionViewDidLoad() {
    
  }

  verificarSolicitud(){
    
  }
}
