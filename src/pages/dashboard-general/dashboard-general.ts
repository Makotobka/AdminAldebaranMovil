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
    public FacChartData=[];
    public FacChartLabels=[];
    public FacChartType:string = 'horizontalBar';
    public FacChartLegend:boolean = false;  
   
    public FacChartOptions: any = {
      responsive: true,
      maintainAspectRatio: true,
      scaleShowVerticalLines: false,
      legend: {position: 'bottom'}
  };

    public barChartOptions:any = {
      scaleShowVerticalLines: false,
      responsive: true
    };
    public barChartLabels:string[] = [];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
    
    public barChartData:any[] = [
      {data: [0], label: 'Compras'},
      {data: [0], label: 'Ventas'}
    ];

  //{data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'},
  //#endregion
  //#region Stock
    public ltstockMinRes:any=[];
    public ltstockMaxRes:any=[];
    public ltstokMin:any=[];
    public ltstokMax:any=[];
    public appType = "Minimos";
    private cantMinMostrar=10;
    public ltStok:Stock[]=[];
    public ltStokResumen:Res_Stock[]=[];
    public totalStock;
    public GrupoMayorStockBajo: Res_Stock = {Cantidad:0,Grupo:"Desconocido"};    
    public StockchartColor: any[] =  [{backgroundColor:['#d53e4f','#f46d43','#fdae61','#e6f598','#abdda4','#66c2a5','#3288bd','#5e4fa2','#2ecc71','#edd400','#586e75']}]; 
    public StockpieChartLabels:string[] = [];
    public StockpieChartData:number[] = [];
    public StockpieChartType:string = 'pie';
    public StockbaseOptions: any = {
      responsive: true,
      maintainAspectRatio: true,
    };
    StockchartLegend:boolean = false;
    
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
    public barPVChartType="horizontalBar"
    //horizontalBar
    public barPVchartData:any[] = [
      {data: [0], label: 'Compras'},
      {data: [0], label: 'Ventas'}
    ];
    public barPVchartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    public barPVchartLegend:boolean = true;    
    public barPVChartOptions: any = {
        responsive: true,
        maintainAspectRatio: false,
        scaleShowVerticalLines: false,
        legend: {position: 'bottom'}
    };
  //#endregion
  //#regino Deudas
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
    //await this.show.detenerTiempo();
    this.Sucursal = await this.archivo.leerArchivo(keyStorage.keySucursal);    
    console.log(this.Sucursal);
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
            this.FacChartLabels = ["Ventas","Compras"];
            this.FacChartData = [this.totalFV, this.totalFC];    
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
      this.barChartLabels=await [];
      await this.limpiarDatos(); 
      await this.getStock(); 
      await this.getFacCVAños();
      //await this.getResumenFacV();
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
            console.log("stock M", this.ltstokMin)
            console.log("stock MA", this.ltstockMinRes)
            if(this.ltstokMin!== undefined && this.ltstockMinRes!==undefined){
              console.log("entro")
              this.selectOp(2);
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
            if(this.ltstokMax!==undefined && this.ltstockMaxRes!==undefined){
              console.log("entro")
              this.selectOp(1);
            }
            
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
    let temp1=[];    
<<<<<<< HEAD
    if(this.ltStokResumen!==undefined){
=======
    if(this.ltStokResumen!=undefined){
>>>>>>> Oficina
      for (let index = 0; index < this.ltStokResumen.length; index++) {
        const element = await this.ltStokResumen[index];
        await temp1.push(element.Cantidad);
        await this.StockpieChartLabels.push(element.Grupo);
        if((index.valueOf()+1) === this.cantMinMostrar.valueOf()){
          break;
        }
<<<<<<< HEAD
      }  
      //this.pieChartLabels = await temp2;
      this.StockpieChartData = await temp1;
    }
=======
      }
  
      //this.pieChartLabels = await temp2;
      this.StockpieChartData = await temp1;
    }  
    console.log("d",this.StockpieChartData);
    console.log("l",this.StockpieChartLabels);
    console.log("c",this.StockchartColor);
    console.log("ty",this.StockpieChartType);
    console.log("o",this.StockbaseOptions);
    console.log("le",this.StockchartLegend);
>>>>>>> Oficina
  }

  async contarDatosStock(){    
    this.totalStock=0;
<<<<<<< HEAD
    console.log(this.ltStokResumen);    
    if(this.ltStokResumen!== undefined) {
      if(this.ltStokResumen.length>0){
        this.ltStokResumen.forEach(grupo => {
          this.totalStock = this.totalStock.valueOf() + grupo.Cantidad.valueOf();
        });    
        this.ltStokResumen.forEach(grupo => {
=======
    console.log(this.appType)
    if(this.ltStokResumen!=undefined){
      if(this.ltStokResumen.length>0){
        await this.ltStokResumen.forEach(grupo => {
          this.totalStock = this.totalStock.valueOf() + grupo.Cantidad.valueOf();
        });    
        await this.ltStokResumen.forEach(grupo => {
>>>>>>> Oficina
            if(this.GrupoMayorStockBajo.Cantidad<grupo.Cantidad){
              this.GrupoMayorStockBajo=grupo;
            }
        });
      }
<<<<<<< HEAD
    }
=======
    } 
    console.log(this.GrupoMayorStockBajo)   
>>>>>>> Oficina
  }

  goDetalleStock(){    
    let detalleStock = this.modal.create(StockPage,{"ltStok":this.ltStok,"ltStokResumen":this.ltStokResumen});
    detalleStock.present();    
  }

  async getFacCVAños(){
    this.show.changeContentLoading("Cargando Facturas de Ventas")
    let añoActual = parseInt(this.FechaIni.split("-")[0])
    await this.con.getFactAnuales("V",1,añoActual).then(async (resV)=>{
      if(resV){
        this.dataAñosV = await JSON.parse(this.con.data)        
        console.log("VAn",this.dataAñosV)
        this.show.changeContentLoading("Cargando Facturas de Compras")
        await this.con.getFactAnuales("C",1,añoActual).then(async (resC)=>{
          if(resC){
            this.dataAñosC = await JSON.parse(this.con.data) 
            console.log("CAn",this.dataAñosC)
            let facVenta=[];
            let facCompra=[];
            let dataLabel=[]
            let totalV:number=0,totalC:number=0;
            this.totalFC=0;
            this.totalFV=0;
            for (let index = 0; index < this.dataAñosV.length; index++) {
              const elementV =  this.dataAñosV[index];
              const elementC =  this.dataAñosC[index];
              this.barChartLabels.push(elementV.Meses)
              totalC = totalC.valueOf()+elementC.Total.valueOf();
              totalV = totalV.valueOf()+elementV.Total.valueOf();
              facVenta.push(elementV.Total);
              facCompra.push(elementC.Total);
            }           
            let dataDatos=[];
            console.log("TV",totalV)
            console.log("TC",totalC)
            dataDatos.push({data:facVenta,label:"Ventas"});
            dataDatos.push({data:facCompra,label:"Compras"});
            this.barChartData = await dataDatos;
            this.totalFC = totalC.valueOf()/this.dataAñosV.length.valueOf();
            this.totalFV = totalV.valueOf()/this.dataAñosV.length.valueOf();
          }
        });
      }
    }).catch(()=>{

    })
  }

  async limpiarDatos(){    
    this.show.changeContentLoading("Limpiando Datos Antiguos");
    this.totalUsuarios=0;
    this.totalProDiaDeuda=0
    this.totalVentasUsuarios=0;
    this.totalStock=0;
    this.totalVentasPunVenta=0;
    this.ltStokResumen=[]
    this.GrupoMayorStockBajo = {Cantidad:0,Grupo:"Desconocido"};   

    //#region Caja Grafico
    if(this.CanvasCaja.nativeElement!=undefined){          
      this.CanvasCaja = new Chart(this.CanvasCaja.nativeElement, { 
        type: 'horizontalBar',
        data: {
            labels: ["CONTADO", "CREDITO"],
            datasets: [{      
                label: 'Sin Caja',             
                data:[0,0,0],
                backgroundColor: [                        
                    'rgba(54, 162, 235, 0.2)',                        
                    'rgba(75, 192, 192, 0.2)'                        
                ],
                borderColor: [                        
                    'rgba(54, 162, 235, 1)',                        
                    'rgba(75, 192, 192, 1)'                        
                ],
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:false
                    }
                }]
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
                backgroundColor: [                        
                    'rgba(54, 162, 235, 0.2)',                        
                    'rgba(75, 192, 192, 0.2)'                        
                ],
                borderColor: [                        
                    'rgba(54, 162, 235, 1)',                        
                    'rgba(75, 192, 192, 1)'                        
                ],
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
            }
        }  
      });
    }else{
      this.CanvasDeuda.data.datasets[0].data=[0,0,0]       
      this.CanvasDeuda.data.datasets[0].label="Sin Datos";
    }
    this.CanvasDeuda.update()
    
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
