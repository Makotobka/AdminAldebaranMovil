import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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

  constructor(public view:ViewController ,public navCtrl: NavController, public navParams: NavParams) {    
    this.FechaFin = this.navParams.get("FechaFin");
    this.FechaIni = this.navParams.get("FechaIni");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');
  }

  Guardar(){
    //this.myDate = this.myDate.split("T")[0];
    let tempIni = this.FechaIni.split("T")[0];
    let tempFin = this.FechaFin.split("T")[0];
    this.view.dismiss({"FechaFin":tempFin,"FechaIni":tempIni})
  }

}
