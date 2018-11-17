import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { IntFactura } from '../../estructuras/Factura';
import { FacturasPage } from '../facturas/facturas';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { Stock, Res_Stock } from '../../estructuras/Stock';
import { StockPage } from '../stock/stock';
import { PuntoVenta } from '../../estructuras/PuntoVenta';
import { Chart } from 'chart.js';
import { ArchivoInternosProvider } from '../../providers/archivo-internos/archivo-internos';
import { keyStorage } from '../../providers/archivo-internos/staticConfigStorage';
import { Deuda } from '../../estructuras/Deuda';
import { templateJitUrl } from '@angular/compiler';
import { ShowMessageProvider } from '../../providers/show-message/show-message';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { varColorBarra, colorGraficoStandar } from '../../app/app.config';

/**
 * Generated class for the DashboardGeneralPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard-general',
  templateUrl: 'dashboard-general.html',
})
export class DashboardGeneralPage {
  private Sucursal={"ID":0,"CIUDAD":"DESCONOCIDA","AGENCIA":"DESCONOCIDA"};  
        
  //#region Facturas
    private dataAñosC;
    private dataAñosV;
    public listFC;
    public listFV;
    public totalFC;
    public totalFV;
    private FechaIni="";
    private FechaFin="";
    
    @ViewChild('CanvasFact') CanvasFactura;
  //{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //#endregion
  //#region Stock
  @ViewChild('CanvasPIE') CanbasStock;
    public ltstockMinRes:any=[];
    public ltstockMaxRes:any=[];
    public ltstokMin:any=[];
    public ltstokMax:any=[];
    public appType = "Minimos";
    private cantMinMostrar=5;
    public ltStok:Stock[]=[];
    public ltStokResumen:Res_Stock[]=[];
    public totalStock;
    public GrupoMayorStockBajo: Res_Stock = {Cantidad:0,Grupo:"Desconocido"};    
    
  //#endregion
  //#region Caja
  
    @ViewChild('barHoriCaja') CanvasCaja;
    public typeCaja;
    public ltPV:PuntoVenta[];
    public ltValCaja:any[];
    public selectPunVen={Nombre:''}
    public totalUsuarios=0;
    public totalVentasPunVenta=0;
    public totalVentasUsuarios=0;    
  //#endregion
  //#region Deudas
    @ViewChild('barHoriDeuda') CanvasDeuda;  
    public totalDeudaPagar=0;
    public totalDeudaCobrar=0;
    public totalProDiaDeuda=0;
    public minimoProPago=0;
    public maximoProPago=0;
    public ltDeudaResCobro:Deuda[]=[];
    public ltDeudaCobro:Deuda[]=[];
    public ltDeudaPagar:Deuda[]=[];
    public promedioUsuarioPago:any[]=[];
  //#endregion

  constructor(private show:ShowMessageProvider,private archivo:ArchivoInternosProvider,public modal:ModalController ,public con:ConexionHttpProvider,public navCtrl: NavController, public navParams: NavParams) {
    let temp: string = new Date().toISOString();
    let tempAux = temp.split("T")[0];
    this.FechaFin = tempAux;
    this.FechaIni = tempAux;
    
  }

  async selectOp(val:number){   
    this.ltStokResumen=[]
    this.ltStok=[]
    if(val === 1){
      if(this.ltstockMinRes.length>0){        
        this.ltStokResumen = this.ltstockMinRes;
      }
      if(this.ltstokMin.length>0){        
        this.ltStok = this.ltstokMin;
      }     
    }else{
      if(this.ltstockMaxRes.length>0){
        this.ltStokResumen = this.ltstockMaxRes;
      }
      if(this.ltstokMax.length>0){
        this.ltStok = this.ltstokMax;
      }

      
    }

    await this.contarDatosStock();
    await this.llenarDatosGraficoStock();
  }

  async ionViewDidLoad() {
    this.Sucursal = await this.archivo.leerArchivo(keyStorage.keySucursal);    
    if(this.Sucursal === null || this.Sucursal === undefined){
      this.Sucursal = {"ID":0,"CIUDAD":"DESCONOCIDA","AGENCIA":"DESCONOCIDA"};
    }

    if(this.Sucursal.ID.valueOf()!==0){
      this.goSincronizar(false);
    }else{
      this.show.showAlertTitulo("No hay una sucursal seleccionada","ERROR");
    }
    
  }

  getResumenFacV(){        
    this.show.changeContentLoading("Generando Resumenes de Ventas");
    this.con.getResFac("V",this.FechaIni,this.FechaIni,this.Sucursal.ID).then(async (resV)=>{
        if(resV){
        this.listFV = await JSON.parse(this.con.data);     
        this.totalFV = await this.getSumatoria(this.listFV)
        this.show.changeContentLoading("Generando Resumenes de Compras");
        this.con.getResFac("C",this.FechaIni,this.FechaIni,this.Sucursal.ID).then(async (resC)=>{
          if(resC){
            this.listFC = await JSON.parse(this.con.data);
            this.totalFC = await this.getSumatoria(this.listFC);
          }else{

          }
         
        });      
      }else{
        console.log("Mensaje: ",this.con.mensaje,"\NCodigo: ",this.con.codigo)
      }
      
    });    
  }

  async getSumatoria(listContar:IntFactura[]){
    let total=0;
    await listContar.forEach(element => {
      if(element.Estado==="VIGENTE")
      total+=element.Total;
    });
    return total;
  }

  goDetalleFacturacion(){
    let goPage = this.modal.create(FacturasPage,{FV:this.listFV,FC:this.listFC,TV:this.totalFV,TC:this.totalFC,Sucursal:this.Sucursal});
    goPage.present();
  }

  async goSincronizar(isTap:boolean){   
      await this.show.detenerTiempo();        
      await this.limpiarDatos(); 
      await this.getStock(); 
      await this.getFacCVAños();      
      await this.getPuntoVenta(this.Sucursal.ID);
      await this.getDeudas(this.Sucursal.ID);      
      await this.guardarInformacion();
      
  }

  goConfigurar(){
    let config = this.modal.create(ConfiguracionPage,{"FechaFin":this.FechaFin,"FechaIni":this.FechaIni,"Sucursal":this.Sucursal});
    config.present();
    config.onDidDismiss(async (data)=>{
     
      if(data!==null && data!==undefined){
        this.FechaFin = data.FechaFin
        this.FechaIni = data.FechaIni
        this.Sucursal = data.Sucursal;        
        this.goSincronizar(false);
      }      
    })
  }

  async getDeudas(IDSU){    
    this.show.changeContentLoading("Buscando Deudas a Pagar")
    await this.con.getDeudas(IDSU,"RESCOBRAR").then(async resRC=>{
      if(resRC){
         this.ltDeudaResCobro = await JSON.parse(this.con.data);
        await this.con.getDeudas(IDSU,"COBRAR").then(async resC=>{
          if(resC){
             this.ltDeudaCobro = await JSON.parse(this.con.data);
             this.show.changeContentLoading("Buscando Deudas a Cobrar")
            await this.con.getDeudas(IDSU,"PAGAR").then(async resP=>{
              if(resP){
                this.ltDeudaPagar = await JSON.parse(this.con.data);
                await this.con.getPromDeudaDia().then(async resPro=>{
                  if(resPro){
                    this.promedioUsuarioPago = await JSON.parse(this.con.data);
                    this.minimoProPago=10000;
                    this.maximoProPago=0;
                    await this.promedioUsuarioPago.forEach(elemet=>{
                      this.totalProDiaDeuda = this.totalProDiaDeuda.valueOf() + elemet.Promedio.valueOf();                      
                      
                      if(this.minimoProPago.valueOf() > elemet.Promedio.valueOf()){
                        this.minimoProPago = elemet.Promedio
                      }
                      if(this.maximoProPago.valueOf() < elemet.Promedio.valueOf()){
                        this.maximoProPago = elemet.Promedio
                      }
                      
                    })
                    this.totalProDiaDeuda = this.totalProDiaDeuda.valueOf()/this.promedioUsuarioPago.length.valueOf();     

                    await this.ltDeudaCobro.forEach(element => {
                      this.totalDeudaCobrar = this.totalDeudaCobrar.valueOf() + element.Deuda.valueOf();                      
                    });

                    await  this.ltDeudaPagar.forEach(element => {
                      this.totalDeudaPagar = this.totalDeudaPagar.valueOf() + element.Deuda.valueOf();
                    });                
                    this.CanvasDeuda.data.datasets[0].data=[this.totalDeudaCobrar,this.totalDeudaPagar,0];     
                    this.CanvasDeuda.data.datasets[0].label="CTG Cobrar y Pagar";  
                    this.CanvasDeuda.update();
                  }
                })
              }
            });
          }
        });
      }
    });
  }

  async guardarInformacion(){
    this.show.changeContentLoading("Guardando Informacion");  
    if(this.con.isOnline){
      await this.archivo.escribirArchivo(keyStorage.keySucursal,this.Sucursal);  //Se usa en facturas
      await this.archivo.escribirArchivo(keyStorage.keyListaStockMin,this.ltstokMin);  //Se usa en stock
      await this.archivo.escribirArchivo(keyStorage.keyListaStockResumenMin,this.ltstockMinRes);  //Se usa en stock
      await this.archivo.escribirArchivo(keyStorage.keyListaStockMax,this.ltstokMax);  //Se usa en stock
      await this.archivo.escribirArchivo(keyStorage.keyListaStockResumenMax,this.ltstockMaxRes);  //Se usa en stock
      await this.archivo.escribirArchivo(keyStorage.keyListaResumenDeudaCliente,this.ltDeudaResCobro);
      await this.archivo.escribirArchivo(keyStorage.keyListaDeudaCliente,this.ltDeudaCobro);
      await this.archivo.escribirArchivo(keyStorage.keyListaDeudaEmpresa,this.ltDeudaPagar);
      await this.archivo.escribirArchivo(keyStorage.keydataAñosV,this.dataAñosV);
      await this.archivo.escribirArchivo(keyStorage.keydataAñosC,this.dataAñosC);
      await this.archivo.escribirArchivo(keyStorage.keyltPV,this.ltPV);
      await this.archivo.escribirArchivo(keyStorage.keypromedioUsuarioPago,this.promedioUsuarioPago);
      await this.archivo.escribirArchivo(keyStorage.keylistFC,this.listFV);
      await this.archivo.escribirArchivo(keyStorage.keylistFV,this.listFC);
      await this.archivo.escribirArchivo(keyStorage.keyltValCaja,this.ltValCaja);
    }
    await this.archivo.escribirArchivo(keyStorage.keyFechaSistema,this.FechaIni);
    await this.show.continuarTiempo();
  }

  async getStock(){   
    this.show.changeContentLoading("Cargando Productos Escasos") 
    await this.con.getResStockBajo(this.Sucursal.ID,'B').then(async (resA)=>{
      if(resA){        
        this.ltstockMinRes = await JSON.parse(this.con.data);
        await this.con.getStockBajo(this.Sucursal.ID,'B').then(async (resB)=>{
          if(resB){
            this.ltstokMin = await JSON.parse(this.con.data)
            if(this.ltstokMin!== undefined && this.ltstockMinRes!==undefined){
              this.selectOp(1);
            }            
          }else{
          }
        })
      }else{
      } 
    }) 

    this.show.changeContentLoading("Cargando Productos Excedentes") 
    await this.con.getResStockBajo(this.Sucursal.ID,'A').then(async (resA)=>{
      if(resA){
        this.ltstockMaxRes = await JSON.parse(this.con.data);
        await this.con.getStockBajo(this.Sucursal.ID,'A').then(async (resB)=>{
          if(resB){
            this.ltstokMax = await JSON.parse(this.con.data)            
          }
        })
      } 
    })     
  }

  async getPuntoVenta(IDSU){
    this.show.changeContentLoading("Contando Dinero en Cajas");
    await this.con.getPuntosVenta(IDSU).then(async (resA)=>{
      if(resA){
        this.ltPV = await JSON.parse(this.con.data);
        if(this.ltPV.length>0){
          let tempFecha = new Date(this.FechaIni);
          await this.con.getValPunVenta(IDSU,tempFecha).then(async res=>{
            if(res){
              this.ltValCaja = await JSON.parse(this.con.data); 
              if(this.ltValCaja!==null){
                if(this.ltValCaja.length>0){
                  await this.selectPV(this.ltValCaja[0]);              
                }
              }
            }
          });
        }
      } 
    })    
  }

  async selectPV(item:PuntoVenta){
    if(item!==undefined){
      this.totalVentasUsuarios=0;
      this.totalVentasPunVenta=0;
      this.selectPunVen = item;
      let tempData=[];
      if(this.ltValCaja!==null && this.ltValCaja!== undefined){
        this.ltValCaja.forEach(element => {
          if(element.Nombre === item.Nombre){
            this.totalVentasPunVenta = this.totalVentasPunVenta.valueOf()+element.Total.valueOf();
            tempData.push(element.Total);
          }       
          this.totalVentasUsuarios = this.totalVentasUsuarios.valueOf()+element.Total.valueOf();
        });
        tempData.push(0);
        this.CanvasCaja.data.datasets[0].data=tempData;     
        this.CanvasCaja.data.datasets[0].label=item.Nombre;  
        this.CanvasCaja.update()
      }
    }
  }

  async llenarDatosGraficoStock(){
    let tempData=[];    
    let tempLabel=[];
    if(this.ltStokResumen!=undefined){
      if(this.ltStokResumen.length>0){
        for (let index = 0; index < this.ltStokResumen.length; index++) {
          const element = await this.ltStokResumen[index];
          await tempData.push(element.Cantidad);
          await tempLabel.push(element.Grupo);
          if((index.valueOf()+1) === this.cantMinMostrar.valueOf()){
            break;
          }
        }
      }      
    }      
    this.CanbasStock.data.datasets[0].data=tempData       
    this.CanbasStock.data.labels=tempLabel
    //this.CanbasStock.width = 400;
    this.CanbasStock.resize()
    this.CanbasStock.update()  
  }

  async contarDatosStock(){    
    this.totalStock=0;    
    if(this.ltStokResumen!=undefined){
      if(this.ltStokResumen.length>0){        
        await this.ltStokResumen.forEach(grupo => {
          this.totalStock = this.totalStock.valueOf() + grupo.Cantidad.valueOf();
        });            
        await this.ltStokResumen.forEach(grupo => {
            if(this.GrupoMayorStockBajo.Cantidad<grupo.Cantidad){
              this.GrupoMayorStockBajo=grupo;
            }
        });
      }
    }     
  }

  goDetalleStock(){    
    let detalleStock = this.modal.create(StockPage,{"ltStok":this.ltStok,"ltStokResumen":this.ltStokResumen});
    detalleStock.present();    
  }

  async getFacCVAños(){
    let meses=[];
    const ultimosNMes=4;
    this.show.changeContentLoading("Cargando Facturas de Ventas")
    let añoActual = parseInt(this.FechaIni.split("-")[0])
    await this.con.getFactAnuales("V",1,añoActual).then(async (resV)=>{
      if(resV){
        this.dataAñosV = await JSON.parse(this.con.data)        
        this.show.changeContentLoading("Cargando Facturas de Compras")
        await this.con.getFactAnuales("C",1,añoActual).then(async (resC)=>{
          if(resC){
            this.dataAñosC = await JSON.parse(this.con.data) 
            let facVenta=[];
            let facCompra=[];
            let totalV:number=0,totalC:number=0;
            this.totalFC=0;
            this.totalFV=0;

            for (let index = 0; index < this.dataAñosV.length; index++) {
              const elementV =  this.dataAñosV[index];
              const elementC =  this.dataAñosC[index];
              meses.push(elementV.Meses)
              totalC = totalC.valueOf()+elementC.Total.valueOf();
              totalV = totalV.valueOf()+elementV.Total.valueOf();
              facVenta.push(elementV.Total);
              facCompra.push(elementC.Total);
            }           
            
            let dataDatos=[];
            //-------------------------------------//
            facVenta = facVenta.slice(facVenta.length-ultimosNMes,facVenta.length);
            facCompra = facCompra.slice(facCompra.length-ultimosNMes,facCompra.length);
            meses = meses.slice(meses.length-ultimosNMes,meses.length);              
            //-------------------------------------//
            dataDatos.push(
              {data:facVenta,label:"Ventas", backgroundColor: colorGraficoStandar[0]}
            );
            dataDatos.push(
              {data:facCompra,label:"Compras",backgroundColor: colorGraficoStandar[1]}
            );
            
            this.CanvasFactura.data.datasets=dataDatos        
            this.CanvasFactura.data.labels=meses    
            this.totalFC = totalC.valueOf()/this.dataAñosV.length.valueOf();
            this.totalFV = totalV.valueOf()/this.dataAñosV.length.valueOf();

            this.CanvasFactura.resize();
            this.CanvasFactura.update()   

            //datasets]="barChartData" [labels]="barChartLabels" [options]="barChartOptions" [legend]="barChartLegend" [chartType]="barChartType"
          }
        });
      }
    }).catch(()=>{

    })
  }

  async limpiarDatos(){    
    
    this.show.changeContentLoading("Limpiando Datos Antiguos");
    this.totalUsuarios=0;
    this.totalProDiaDeuda=0;
    this.totalVentasUsuarios=0;
    this.totalStock=0;
    this.totalVentasPunVenta=0;
    this.ltStokResumen=[];
    this.GrupoMayorStockBajo = {Cantidad:0,Grupo:"Desconocido"};   
    this.totalDeudaCobrar=0;
    this.totalDeudaPagar=0;
    this.minimoProPago=0


    //#region Facturas
    try{
      if(this.CanvasFactura.nativeElement!=undefined){          
        this.CanvasFactura = new Chart(this.CanvasFactura.nativeElement, { 
          type: 'bar',
          data: {
              labels: ["Compras","Ventas"],
              datasets: [{      
                  label: 'Sin Caja',             
                  data:[],
                  borderWidth: 2
              }]
          },
          
          options: {             
              scales: {
                  yAxes: [{
                      ticks: {
                          beginAtZero:true
                      }
                  }]
              },
              legend: {
                display: true
              }
          }  
        });
      }else{
        this.CanvasFactura.data.datasets[0].data=[0,0,0]       
        this.CanvasFactura.data.datasets[0].label="Sin Caja";
        //this.CanvasCaja.update()
      }
      //this.CanvasFactura.resize();    
      this.CanvasFactura.update()          
    }catch(ex){

    }
    
    
    //#endregion

    //#region Caja Grafico
    if(this.CanvasCaja.nativeElement!=undefined){          
      this.CanvasCaja = new Chart(this.CanvasCaja.nativeElement, { 
        type: 'horizontalBar',
        data: {
            labels: ["CONTADO", "CREDITO"],
            datasets: [{      
                label: 'Sin Caja',             
                data:[0,0,0],
                backgroundColor: colorGraficoStandar,
                borderWidth: 2
            }]
        },
        
        options: {              
          //responsive:false,    
          //maintainAspectRatio: false,          
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false
                    }
                }]
            },
            legend: {
              display: false,
              labels: {
                  fontColor: 'rgb(255, 99, 132)'
              }
            }
        }  
      });
    }else{
      this.CanvasCaja.data.datasets[0].data=[0,0,0]       
      this.CanvasCaja.data.datasets[0].label="Sin Caja";
      //this.CanvasCaja.update()
    }
    this.CanvasCaja.update()    
    this.selectPunVen={"Nombre":""}
    //#endregion
    
    //#region Deudas Grafico
    if(this.CanvasDeuda.nativeElement!=undefined){
      this.CanvasDeuda = new Chart(this.CanvasDeuda.nativeElement, { 
        type: 'horizontalBar',
        data: {
            labels: ["CTG Cobrar","CTG Pagar"],
            datasets: [{      
                label: 'Sin Caja',             
                data:[0,0,0],
                backgroundColor: colorGraficoStandar,
                borderWidth: 2
            }]
        },
        options: {
          responsive:true,       
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            legend: {
              display: false,
              labels: {
                  fontColor: 'rgb(255, 99, 132)'
              }
            }
        }  
      });
    }else{
      this.CanvasDeuda.data.datasets[0].data=[0,0,0]       
      this.CanvasDeuda.data.datasets[0].label="Sin Datos";
    }
    this.CanvasDeuda.update()
    //#endregion
    
    //#region Stock
    if(this.CanbasStock.nativeElement!=undefined){          
      this.CanbasStock = new Chart(this.CanbasStock.nativeElement, { 
        type: 'pie',
        data: {
            labels: ["asd","asds"],            
            datasets: [{      
                label: 'Sin Caja',             
                data:[3,5],
                backgroundColor: colorGraficoStandar,
                borderWidth: 2
            }]           
        },
        options: {
          legend: {
            display: true,
            position:"bottom",
            labels:{
              fontSize:10
            }
          },
          animation:{
            animateRotate:true,
            animateScale:true
          },
          tooltipis:{
            enable:true
          },
          responsive:false,
          maintainAspectRatio:false
        }
      });
    }else{
      this.CanbasStock.data.datasets[0].data=[0,0,0]       
      this.CanbasStock.data.datasets[0].label="Sin Caja";      
    }    
    this.CanbasStock.resize()
    this.CanbasStock.update()   
    //#endregion
  }
  
  async getUsuarioCaja(IDSU,IDPT){
    let sdw = new Date()
    await this.con.getUsuarioPorCaja(IDSU,IDPT,sdw).then(async res=>{      
      if(res){
        let UserCaja = await JSON.parse(this.con.data);
        UserCaja.forEach(element => {
          this.totalUsuarios=this.totalUsuarios.valueOf()+1;
          this.totalVentasUsuarios = this.totalVentasUsuarios.valueOf()+element.TOTAL.valueOf();
        });
      }
    })
  }

}
