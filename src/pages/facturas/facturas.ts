import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  public listFC;
  public listFV;

  public totalFC;
  public totalFV;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.listFC = this.navParams.get("FC");
    this.listFV = this.navParams.get("FV");
    this.totalFC = this.navParams.get("TC");
    this.totalFV = this.navParams.get("TV");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacturasPage');
  }

  desplegarFV(evento){
    console.log(evento);
  }

}
