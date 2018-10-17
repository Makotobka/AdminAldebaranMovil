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
  private Sucursal:any={"ID":1,"CIUDAD":"EL EMPALME","AGENCIA": "FARMACIA JAVIER JR"};

  //#region Facturas
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
    public ltstockMinRes:any;
    public ltstockMaxRes:any;
    public ltstokMin:any;
    public ltstokMax:any;
    public appType="Minimos";
    private cantMinMostrar=10;
    public ltStok:Stock[];
    public ltStokResumen:Res_Stock[];
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

  constructor(private archivo:ArchivoInternosProvider,public modal:ModalController ,public con:ConexionHttpProvider,public navCtrl: NavController, public navParams: NavParams) {
    let temp: string = new Date().toISOString();
    let tempAux = temp.split("T")[0];
    this.FechaFin = tempAux;
    this.FechaIni = tempAux;    
   
  }

  refrescarGraficos(){

  }

  async selectOp(val:number){
    if(val===1){
      this.ltStokResumen = this.ltstockMinRes;
      this.ltStok = this.ltstokMin;
    }else{
      this.ltStokResumen = this.ltstockMaxRes;
      this.ltStok = this.ltstokMax;
    }

    await this.contarDatosStock();
    await this.llenarDatosGraficoStock();
  }

  ionViewDidLoad() {
    this.goSincronizar(false);
  }

  getResumenFacV(){    
    this.con.getResFac("V",this.FechaIni,this.FechaFin,this.Sucursal.ID).then(async (resV)=>{
      if(resV){
        this.listFV = await JSON.parse(this.con.data);     
        this.totalFV = await this.getSumatoria(this.listFV)
        this.con.getResFac("C",this.FechaIni,this.FechaFin,this.Sucursal.ID).then(async (resC)=>{
          if(resC){
            this.listFC = await JSON.parse(this.con.data);
            this.totalFC = await this.getSumatoria(this.listFC);
            this.FacChartLabels = ["Ventas","Compras"];
            this.FacChartData = [this.totalFV, this.totalFC];    
          }else{
            //console.log("Mensaje: ",this.con.mensaje,"\NCodigo: ",this.con.codigo)
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
    if(isTap){
      this.barChartLabels=[];
    }
    await this.limpiarDatos();
    //await this.getUsuarioCaja();
    await this.getStockBajo();
    await this.getStockAlto();
    await this.getFacCVAños();
    await this.getPuntoVenta(this.Sucursal.ID);


    await this.guardarInformacion();
    await this.refrescarGraficos();
  }

  goConfigurar(){
    let config = this.modal.create(ConfiguracionPage,{"FechaFin":this.FechaFin,"FechaIni":this.FechaIni});
    config.present();
    config.onDidDismiss((data)=>{
     
      if(data!==null && data!==undefined){
        this.FechaFin = data.FechaFin
        this.FechaIni = data.FechaIni
        this.Sucursal = data.Sucursal;
        this.goSincronizar(false);
      }      
    })
  }

  async guardarInformacion(){

    await this.archivo.escribirArchivo(keyStorage.keySucursal,this.Sucursal);  //Se usa en facturas
    await this.archivo.escribirArchivo(keyStorage.keyListaStockMin,this.ltstokMin);  //Se usa en stock
    await this.archivo.escribirArchivo(keyStorage.keyListaStockResumenMin,this.ltstockMinRes);  //Se usa en stock
    await this.archivo.escribirArchivo(keyStorage.keyListaStockMax,this.ltstokMax);  //Se usa en stock
    await this.archivo.escribirArchivo(keyStorage.keyListaStockResumenMax,this.ltstockMaxRes);  //Se usa en stock

    console.log("Guardado completo")
  }

  getStockBajo(){    
    this.con.getResStockBajo(this.Sucursal.ID,'B').then(async (resA)=>{
      if(resA){
        this.ltstockMinRes = await JSON.parse(this.con.data);
        this.con.getStockBajo(this.Sucursal.ID,'B').then(async (resB)=>{
          if(resB){
            this.ltstokMin = await JSON.parse(this.con.data)
            this.selectOp(2);
          }
        })
      } 
    })    
  }

  getPuntoVenta(IDSU){
    this.con.getPuntosVenta(IDSU).then(async (resA)=>{
      if(resA){
        this.ltPV = await JSON.parse(this.con.data);
        if(this.ltPV.length>0){
          await this.con.getValPunVenta(IDSU).then(async res=>{
            if(res){
              this.ltValCaja = await JSON.parse(this.con.data); 
              if(this.ltValCaja.length>0){
                await this.selectPV(this.ltValCaja[0]);              
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
      this.ltValCaja.forEach(element => {
        if(element.Nombre === item.Nombre){
          this.totalVentasPunVenta = this.totalVentasPunVenta.valueOf()+element.Total.valueOf();
          tempData.push(element.Total);
        }       
        this.totalVentasUsuarios = this.totalVentasUsuarios.valueOf()+element.Total.valueOf();
      });
      tempData.push(0);
      this.CanvasCaja.data.datasets[0].data=tempData     
      this.CanvasCaja.data.datasets[0].label=item.Nombre;  
      this.CanvasCaja.update()
    }
  }

  getStockAlto(){
    this.con.getResStockBajo(this.Sucursal.ID,'A').then(async (resA)=>{
      if(resA){
        this.ltstockMaxRes = await JSON.parse(this.con.data);
        this.con.getStockBajo(this.Sucursal.ID,'A').then(async (resB)=>{
          if(resB){
            this.ltstokMax = await JSON.parse(this.con.data)
            this.selectOp(1);
          }
        })
      } 
    })    
  }

  async llenarDatosGraficoStock(){
    let temp1=[];    
    for (let index = 0; index < this.ltStokResumen.length; index++) {
      const element = await this.ltStokResumen[index];
      await temp1.push(element.Cantidad);
      await this.StockpieChartLabels.push(element.Grupo);
      if((index.valueOf()+1) === this.cantMinMostrar.valueOf()){
        break;
      }
    }

    //this.pieChartLabels = await temp2;
    this.StockpieChartData = await temp1;
  }

  contarDatosStock(){    
    this.totalStock=0;
    this.ltStokResumen.forEach(grupo => {
      this.totalStock = this.totalStock.valueOf() + grupo.Cantidad.valueOf();
    });    
    this.ltStokResumen.forEach(grupo => {
        if(this.GrupoMayorStockBajo.Cantidad<grupo.Cantidad){
          this.GrupoMayorStockBajo=grupo;
        }
    });
  }

  goDetalleStock(){    
    let detalleStock = this.modal.create(StockPage,{"ltStok":this.ltStok,"ltStokResumen":this.ltStokResumen});
    detalleStock.present();    
  }

  async getFacCVAños(){
    await this.con.getFactAnuales("V",1,true).then(async (resV)=>{
      if(resV){
        let dataAñosV = await JSON.parse(this.con.data) 
        await this.con.getFactAnuales("C",1,true).then(async (resC)=>{
          if(resC){
            let dataAñosC = await JSON.parse(this.con.data) 
            let facVenta=[];
            let facCompra=[];
            let dataLabel=[]
            let totalV=0,totalC=0;

            for (let index = 0; index < dataAñosV.length; index++) {
              const elementV = dataAñosV[index];
              const elementC = dataAñosC[index];
              this.barChartLabels.push(elementV.Meses)
              totalC = totalC.valueOf()+elementC.Total.valueOf();
              totalV = totalV.valueOf()+elementV.Total.valueOf();
              facVenta.push(elementV.Total);
              facCompra.push(elementC.Total);
            }           
            let dataDatos=[];

            dataDatos.push({data:facVenta,label:"Ventas"});
            dataDatos.push({data:facCompra,label:"Compras"});
            this.barChartData = await dataDatos;
            this.totalFC = totalC.valueOf()/dataAñosV.length.valueOf();
            this.totalFV = totalV.valueOf()/dataAñosV.length.valueOf();
          }
        });
      }
    }).catch(()=>{

    })
  }

  async limpiarDatos(){    
    this.totalUsuarios=0;
    this.totalVentasUsuarios=0;
    this.totalStock=0;
    this.totalVentasPunVenta=0;
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
    
    await this.archivo.escribirArchivo(keyStorage.keySucursal,undefined);  //Se usa en facturas
    await this.archivo.escribirArchivo(keyStorage.keyListaStockMin,undefined);  //Se usa en stock
    await this.archivo.escribirArchivo(keyStorage.keyListaStockResumenMin,undefined);  //Se usa en stock
    await this.archivo.escribirArchivo(keyStorage.keyListaStockMax,undefined);  //Se usa en stock
    await this.archivo.escribirArchivo(keyStorage.keyListaStockResumenMax,undefined);  //Se usa en stock


  }
  
  async getUsuarioCaja(IDSU,IDPT){
    await this.con.getUsuarioPorCaja(IDSU,IDPT).then(async res=>{      
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
