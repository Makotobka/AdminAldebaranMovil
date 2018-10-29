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

  constructor(private archivo:ArchivoInternosProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  async ionViewDidLoad() {    
    this.ltDeudaCliente = await this.archivo.leerArchivo(keyStorage.keyListaDeudaCliente);
    this.ltDeudaResCliente = await this.archivo.leerArchivo(keyStorage.keyListaResumenDeudaCliente);
    console.log(this.ltDeudaResCliente);
    await this.ContenarDeudas();
    //console.log(this.ltDeudaResCliente);
  }

  ContenarDeudas(){    
    for (let i = 0; i < this.ltDeudaResCliente.length; i++) {
      const principal:Deuda = this.ltDeudaResCliente[i];
      principal.lista=[];
      for (let j = 0; j < this.ltDeudaCliente.length; j++) {
        const hija:Deuda = this.ltDeudaCliente[j];
        if(principal.Nombre === hija.Nombre){
          principal.lista.push(hija);
        }
      }
    }
  }

}
