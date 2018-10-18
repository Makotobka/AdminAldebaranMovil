import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Stock, Res_Stock } from '../../estructuras/Stock';

/**
 * Generated class for the StockPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html',
})
export class StockPage {

  public ltStok:Stock[];
  public ltStokResumen:Res_Stock[];
  public ltStockGrupo=[];


  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.ltStok = navParams.get("ltStok")
    this.ltStokResumen = navParams.get("ltStokResumen")

    //console.log(this.ltStok)    
    //console.log(this.ltStokResumen)    
    //console.log(this.ltStockGrupo);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad StockPage');
    this.cargarDatosGrupo();
  }

  cargarDatosGrupo(){
    this.ltStockGrupo= [];
    for (let index = 0; index <  this.ltStok.length; index++) {
      const item =  this.ltStok[index];
      if(this.ltStockGrupo.length>0){
        let isExisxt=true;
        for (let c = 0; c < this.ltStockGrupo.length; c++) {
          const element = this.ltStockGrupo[c];
          if(element.Grupo === item.Grupo){
            isExisxt=false;
            element.lista.push(item);       
            break;     
          }else{
            isExisxt=true;
          }
        }

        if(isExisxt){
          this.ltStockGrupo.push({"Grupo":item.Grupo,"lista":[item]})  
        }
      }else{
        this.ltStockGrupo.push({"Grupo":item.Grupo,"lista":[item]})
      }
    }
    //console.log(this.ltStockGrupo);
  }

  getCantidad(item){    
    //console.log(item);
    let cantidad=0;
    for (let index = 0; index < this.ltStokResumen.length; index++) {
      const element = this.ltStokResumen[index];
      if(element.Grupo === item.Grupo){
        cantidad = element.Cantidad;
        break;
      }
    }    
    return cantidad;
  }
  
}


