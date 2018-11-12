import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ArchivoInternosProvider } from '../../providers/archivo-internos/archivo-internos';
import { Deuda } from '../../estructuras/Deuda';
import { keyStorage } from '../../providers/archivo-internos/staticConfigStorage';

/**
 * Generated class for the ListaDeudaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lista-deuda',
  templateUrl: 'lista-deuda.html',
})
export class ListaDeudaPage {

  public ltDeudaCliente:Deuda[]=[];
  public ltDeudaResCliente:Deuda[]=[];  
  public ltDeudaProveedor:Deuda[]=[];
  public listaData:Deuda[]=[];
  public isCliente:boolean=true;    

  constructor(private archivo:ArchivoInternosProvider,public navCtrl: NavController, public navParams: NavParams) {
    this.isCliente = this.navParams.get("isCliente");
  }

  async ionViewDidLoad() {    
    this.ltDeudaCliente = await this.archivo.leerArchivo(keyStorage.keyListaDeudaCliente);
    this.ltDeudaResCliente = await this.archivo.leerArchivo(keyStorage.keyListaResumenDeudaCliente); 
    this.ltDeudaProveedor = await this.archivo.leerArchivo(keyStorage.keyListaDeudaEmpresa); 
    //console.log(this.ltDeudaProveedor)
    await this.ContenarDeudas();
  }

  ContenarDeudas(){    
    if(this.isCliente){
      this.AgruparLista(this.ltDeudaCliente)
    }else{
      
      this.AgruparLista(this.ltDeudaProveedor)
      
    }
    console.log(this.listaData)
    //this.orderLista(this.listaData);    
  }

  AgruparLista(lista:any[]){    
    for (let i = 0; i < lista.length; i++) {
      const item = lista[i];
      let exis=false;
      if(this.listaData.length>0){
        for (let j = 0; j < this.listaData.length; j++) {
          const padre = this.listaData[j];          
          if(padre.Nombre === item.Nombre){
            //console.log(padre.Deuda)
            //console.log(item)
            padre.Deuda = padre.Deuda.valueOf()+item.Deuda.valueOf();
            padre.lista.push(item)
            exis=true;
            break;
          }
        }
      }
      
      if(!exis){
        let temp:Deuda = {
          IDC:0,
          IDF:0,
          Deuda:item.Deuda,
          Nombre:item.Nombre,
          Fecha:undefined,
          lista:[item]
        }
        this.listaData.push(temp);
      }
    } 
    this.orderLista(this.listaData);
    for(let c in this.listaData){
      this.orderListaFechas(this.listaData[c].lista)
    }
    
  }

  orderListaFechas(lista:Deuda[]){
    for (let i = 0; i < lista.length; i++) {
      for (let j = i+1; j < lista.length; j++) {
        let A:Date = new Date(lista[i].Fecha)
        let B:Date = new Date(lista[j].Fecha)
        if(A<=B){
          const temp = lista[i];
          lista[i] = lista[j];
          lista[j] = temp;            
        }
      }
    }
  }

  orderLista(lista:Deuda[]){
    for (let i = 0; i < lista.length; i++) {
      for (let j = i+1; j < lista.length; j++) {
        let A:number = lista[i].Deuda.valueOf()
        let B:number = lista[j].Deuda.valueOf()
        if(A<=B){
          const temp = lista[i];
          lista[i] = lista[j];
          lista[j] = temp;            
        }
      }
    }
  }

}
