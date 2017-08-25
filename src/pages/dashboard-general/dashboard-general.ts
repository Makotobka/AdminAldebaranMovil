import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { IntFactura } from '../../estructuras/Factura';
import { FacturasPage } from '../facturas/facturas';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { Stock, Res_Stock } from '../../estructuras/Stock';
import { StockPage } from '../stock/stock';
import moment from 'moment';

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

  private Sucursal:any={"ID":1};
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
    public totalUsuarios=0;
    public totalVentasUsuarios=0;
  //#endregion

  constructor(public modal:ModalController ,public con:ConexionHttpProvider,public navCtrl: NavController, public navParams: NavParams) {
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
    await this.getUsuarioCaja();
    await this.getStockBajo();
    await this.getStockAlto();
    await this.getFacCVAños();
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
            //console.log("=>a ",JSON.parse(JSON.stringify(dataLabel)))
            //console.log("=>b ",JSON.parse(JSON.stringify(this.barChartLabels)))
            //this.barChartLabels = await dataLabel;
            //console.log("=>c ",JSON.parse(JSON.stringify(this.barChartLabels)))
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

  limpiarDatos(){    
    this.totalUsuarios=0;
    this.totalVentasUsuarios=0;
    this.totalStock=0;
    this.GrupoMayorStockBajo = {Cantidad:0,Grupo:"Desconocido"};   
  }
  
  async getUsuarioCaja(){
    await this.con.getUsuarioPorCaja(1).then(async res=>{      
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
