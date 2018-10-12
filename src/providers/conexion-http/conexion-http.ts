import { Injectable } from '@angular/core';
import { Http, RequestOptions, ResponseContentType, Headers, RequestMethod } from '@angular/http';
import { urlAPI } from './app.URLAPI';

/*
  Generated class for the ConexionHttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConexionHttpProvider {

  private dirCone="http://localhost:54134/";

  private opciones:RequestOptions;

  public metodo:string;               //-- Metodo de solicitud realizado
  public codigo:number;               //-- codigo HTTP estandar.
  public mensaje:string;              //-- Mensaje correspondiente al codigo HTPP .
  public data:any;
  public isOnline;

  constructor(public http: Http) {    
    this.isOnline=true;
  }

  formatearHeaders(metodo:RequestMethod, respuestatipo:ResponseContentType){
    //-- Creas un encabeza con los datos estandares
    var op:RequestOptions;
    // Encabezados
    var headers = new Headers();
      headers.append('Content-Type','application/json;charset=utf-8');
      headers.append('Accept','application/json');
    op = new RequestOptions(      {headers: headers}    );
    // Credenciales
    op.withCredentials=true;
    this.opciones = op;
    // Campos para los diferentes metodos
    this.opciones.method = metodo;
    this.opciones.responseType = respuestatipo;
    this.metodo = metodo.toString();
    // Limpiar registros de eventos para escuchar los nuevos.
    this.codigo = -1;
    this.mensaje = null;
    this.data = null;
  }

  llenarDatosRespons(respuesta:any){
    console.log(respuesta)
    this.data = respuesta._body;
    this.mensaje = respuesta.statusText;
    this.codigo = respuesta.status;

    if(!respuesta.ok){
      if(this.codigo==0){
        console.log("Sin señal")
        //this.serGlo.showToast(msgError.msgServerNull);
      }else{
        console.log("Error")
        //this.serGlo.showToast("Error HTTP: "+this.codigo+" ; " +this.mensaje);
      }
      //console.log("Codigo HTTP: ",this.codigo)
    }
  }

  async getCaja(IDSU:number, EST:Boolean){
    if(this.isOnline){
      let parametros:string;
      this.formatearHeaders(RequestMethod.Get,ResponseContentType.Json);
      parametros = "/"+IDSU+"/"+EST;
      let respuesta = await this.http.get(urlAPI.getCajasAbiertasCerradas+parametros).toPromise();
      await this.llenarDatosRespons(respuesta);
    }else{

    }
  }

}
