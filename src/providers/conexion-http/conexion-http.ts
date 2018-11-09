import { Injectable } from '@angular/core';
import { Http, RequestOptions, ResponseContentType, Headers, RequestMethod } from '@angular/http';
import { urlAPI } from './app.URLAPI';
import { ArchivoInternosProvider } from '../archivo-internos/archivo-internos';
import { keyStorage } from '../archivo-internos/staticConfigStorage';

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

  constructor(public http: Http, public archivo:ArchivoInternosProvider) {    
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
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{                
        let temp;
        if(Accion ==='C'){
          temp = await this.archivo.leerArchivo(keyStorage.keylistFC)
        }else{
          temp = await this.archivo.leerArchivo(keyStorage.keylistFV)
        }        
        this.data = await JSON.stringify(temp);
        return true;
      }
    }catch (e){
      await this.llenarDatosRespons(e);
      return false
    }
  }

  async getStockBajo(IDSU:number,ACC:String){
    const url = this.dirCone+urlAPI.getStockBajo;
    try{
      if(this.isOnline){
        let parametros:string=IDSU.toString()+"/"+ACC;
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        let temp;
        if(ACC==='B'){
          temp = await this.archivo.leerArchivo(keyStorage.keyListaStockMin)
        }else{
          temp = await this.archivo.leerArchivo(keyStorage.keyListaStockMax)
        }
        this.data = await JSON.stringify(temp);
        
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
        let temp
        if(ACC==='B'){
          temp = await this.archivo.leerArchivo(keyStorage.keyListaStockResumenMin)
        }else{
          temp = await this.archivo.leerArchivo(keyStorage.keyListaStockResumenMax)
        }
        console.log("data Res",temp);
        this.data = await JSON.stringify(temp);
        
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

  async getFactAnuales(Accion:string, IDSU:number, AñoActual:number){
    const url = this.dirCone+urlAPI.getFacCVAños;
    try{
      if(this.isOnline){     
        let parametros:string=Accion+"/"+IDSU+"/"+AñoActual;        
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        let temp
        if(Accion==='V'){
          temp = await this.archivo.leerArchivo(keyStorage.keydataAñosV)
        }else{
          temp = await this.archivo.leerArchivo(keyStorage.keydataAñosC)
        }
        this.data = await JSON.stringify(temp);
        return true;
      }
    }catch{
      return false
    }
  }

  async getUsuarioPorCaja(IDSU:number,IDPT:number,Fecha:Date){
    const url = this.dirCone+urlAPI.getUsuarioPorCaja;
    try{
      if(this.isOnline){     
        //console.log("Fehc aneviada ",Fecha.toISOString().split('T')[0]);
        let parametros:string=IDSU.toString()+"/"+IDPT.toString()+"/"+Fecha.toISOString().split('T')[0];      
        let respuesta = await this.http.get(url+parametros).toPromise();            
        await this.llenarDatosRespons(respuesta);
        //console.log(JSON.parse(this.data));
        return true;
      }else{
        return false;
      }
    }catch{
      return false
    }
  }

  async getPuntosVenta(IDSU:number){
    const url = await this.dirCone+urlAPI.getPunVenta;
    try{
      if(this.isOnline){     
        let parametros:string=IDSU.toString();   
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{        
        let temp = await this.archivo.leerArchivo(keyStorage.keyltPV)        
        this.data = await JSON.stringify(temp);
        return true;
      }
    }catch{
      return false
    }
  }

  async getValPunVenta(IDSU:number,Fecha:Date){
    const url = await this.dirCone+urlAPI.getValPunVen;
    try{
      if(this.isOnline){     
        let parametros:string=IDSU.toString()+"/"+Fecha.toISOString().split('T')[0];
        console.log(parametros)
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        let temp = await this.archivo.leerArchivo(keyStorage.keyltValCaja);
        this.data = JSON.stringify(temp);
        return true;
      }
    }catch{
      return false
    }
  }

  //getDeudas:"DC/getDeuda/",//-
  //getProDiaDeuda:"getProDiaDeuda"//-

  async getDeudas(IDSU:number,Accion:string){
    const url = await this.dirCone+urlAPI.getDeudas;
    try{
      if(this.isOnline){     
        let parametros:string=IDSU.toString()+"/"+Accion;
        //console.log(parametros)
        let respuesta = await this.http.get(url+parametros).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        let temp;
        switch(Accion){          
          case "RESCOBRAR":
            temp = await this.archivo.leerArchivo(keyStorage.keyListaResumenDeudaCliente);
          break;
          case "COBRAR":
            temp = await this.archivo.leerArchivo(keyStorage.keyListaDeudaCliente);
          break;
          case "PAGAR":
            temp = await this.archivo.leerArchivo(keyStorage.keyListaDeudaEmpresa);
          break;
        }
        this.data = JSON.stringify(temp);
        return true;
      }
    }catch{
      return false
    }
  }

  async getPromDeudaDia(){
    const url = await this.dirCone+urlAPI.getProDiaDeuda;
    try{
      if(this.isOnline){     
        let respuesta = await this.http.get(url).toPromise();        
        await this.llenarDatosRespons(respuesta);
        return true;
      }else{
        let temp = await this.archivo.leerArchivo(keyStorage.keypromedioUsuarioPago);        
        this.data = await JSON.stringify(temp)
        return true;
      }
    }catch{
      return false
    }
  }
  
}
