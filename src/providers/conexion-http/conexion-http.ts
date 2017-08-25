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
    this.data = respuesta._body;
    this.mensaje = respuesta.statusText;
    this.codigo = respuesta.status;
    
    if(!respuesta.ok){
      if(this.codigo==0){
        console.log("Sin señal")
      }else{
        console.log("Error")
      }
    }

    
  }

  async getCaja(IDSU:number, EST:Boolean){
    try{
      if(this.isOnline){
        let parametros:string;
        this.formatearHeaders(RequestMethod.Get,ResponseContentType.Json);
        parametros +=IDSU+"/"+EST;
        console.log(this.dirCone+urlAPI.getCajasAbiertasCerradas+parametros);
        let respuesta = await this.http.get(this.dirCone+urlAPI.getCajasAbiertasCerradas+parametros).toPromise();
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        return true;
      }
    }catch{
      return false
    }
    
  }

  async getResFac(Accion:string, FechaIni:string, FechaFin:string,IDSU:number){
    const url = this.dirCone+urlAPI.getResumenacturaComVen;
    try{
      if(this.isOnline){
        let parametros:string = await Accion+"/"+FechaIni+"/"+FechaFin+"/"+IDSU;   
        let respuesta = await this.http.get(url+parametros).toPromise();    
        console.log(respuesta)    ;
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        return true;
      }
    }catch (e){
      console.log(e);
      await this.llenarDatosRespons(e);
      return false
    }
  }

  async getStockBajo(IDSU:number,ACC:String){
    const url = this.dirCone+urlAPI.getStockBajo;
    try{
      if(this.isOnline){
        let parametros:string=IDSU.toString()+"/"+ACC;
        console.log(url+parametros)        
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        return true;
      }
    }catch{
      return false
    }
  }

  async getResStockBajo(IDSU:number,ACC:String){
    const url = this.dirCone+urlAPI.getResumenStockBajo;
    try{
      if(this.isOnline){
        let parametros:string=IDSU.toString()+"/"+ACC;        
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        return true;
      }
    }catch{
      return false
    }
  }

  async getAllSucursal(){
    const url = this.dirCone+urlAPI.getAllSucursal;
    try{
      if(this.isOnline){            
        let respuesta = await this.http.get(url).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        return true;
      }
    }catch{
      return false
    }
  }

  async getFactAnuales(Accion:string, IDSU:number, AñoActual:boolean){
    //[Route("F/getMesCV/{Acc}/{IDSU}/{AnoAct}")]
    const url = this.dirCone+urlAPI.getFacCVAños;
    try{
      if(this.isOnline){     
        let parametros:string=Accion+"/"+IDSU+"/"+AñoActual;        
        //console.log(url+parametros)     
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        return true;
      }
    }catch{
      return false
    }
  }

  async getUsuarioPorCaja(IDSU:number){
    const url = this.dirCone+urlAPI.getUsuarioPorCaja;
    try{
      if(this.isOnline){     
        let parametros:string=IDSU.toString();   
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        return true;
      }
    }catch{
      return false
    }
  }
  
}
