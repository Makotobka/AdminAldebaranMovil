import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Stock, Res_Stock } from '../../estructuras/Stock';
import { ArchivoInternosProvider } from '../../providers/archivo-internos/archivo-internos';
import { keyStorage } from '../../providers/archivo-internos/staticConfigStorage';

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
  private estado:boolean;
  public titulo:string;

  constructor(private archivo:ArchivoInternosProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.estado = navParams.get("min");
    this.titulo = this.navParams.get("titulo");
  }

  async ionViewDidLoad() {

    if(!this.estado){
      this.ltStok = await this.archivo.leerArchivo(keyStorage.keyListaStockMax)
      this.ltStokResumen = await this.archivo.leerArchivo(keyStorage.keyListaStockResumenMax)
    }else{
      this.ltStok = await this.archivo.leerArchivo(keyStorage.keyListaStockMin)
      this.ltStokResumen = await this.archivo.leerArchivo(keyStorage.keyListaStockResumenMin)
    }
   
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
    
  }

  getCantidad(item){    
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

  orderLista(lista:any[]){
    for (let i = 0; i < lista.length; i++) {
      for (let j = i+1; j < lista.length; j++) {
        if(lista[i].Deuda.valueOf()<=lista[j].Deuda.valueOf()){
          const temp = lista[i];
          lista[i] = lista[j];
          lista[j] = temp;            
        }
      }
    }
  }
  
}


