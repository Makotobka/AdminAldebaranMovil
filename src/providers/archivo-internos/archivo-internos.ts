import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/*
  Generated class for the ArchivoInternosProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ArchivoInternosProvider {

  constructor(private storage: Storage) {
  }

  async leerArchivo(key:string){
    let aux,temp;
    temp = await this.storage.get(key).then(async (val)=>{
      aux = await val
    }).catch((err)=>{
      console.log("storage=> ",err);
    })
    return aux;
  }

  async escribirArchivo(key:string, value:any){
    return this.storage.set(key, value);
  }

  copiarLista(listaOriginal){
    return JSON.parse(JSON.stringify(listaOriginal));
  }

}
