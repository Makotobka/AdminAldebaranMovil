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
    await this.ContenarDeudas();
  }

  ContenarDeudas(){    
    if(this.isCliente){
      for (let i = 0; i < this.ltDeudaResCliente.length; i++) {
        const principal:Deuda = this.ltDeudaResCliente[i];
        principal.lista=[];
        for (let j = 0; j < this.ltDeudaCliente.length; j++) {
          const hija:Deuda = this.ltDeudaCliente[j];
          if(principal.Nombre === hija.Nombre){
            principal.lista.push(hija);
          }
        }
        this.orderLista(principal.lista);        
        this.listaData.push(principal);
      }
    }else{
      for (let i = 0; i < this.ltDeudaProveedor.length; i++) {
        const principal:Deuda = this.ltDeudaProveedor[i];
        principal.lista=[];
        this.listaData.push(principal);
      }
    }
    this.orderLista(this.listaData);    
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
