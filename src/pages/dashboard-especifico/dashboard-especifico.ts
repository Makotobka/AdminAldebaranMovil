import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';

/**
 * Generated class for the DashboardEspecificoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard-especifico',
  templateUrl: 'dashboard-especifico.html',
})
export class DashboardEspecificoPage {

  public chartData: number [] =  [];
  public chartLabels: string[] = [];
  public chartColor1: any[] = [{backgroundColor:['#d53e4f','#f46d43','#fdae61','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2']}]; 
  public baseOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.chartData=[23,64.2];
  }

}
