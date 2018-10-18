import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { IfObservable } from 'rxjs/observable/IfObservable';
import { IntFactura } from '../../estructuras/Factura';
import { FacturasPage } from '../facturas/facturas';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { Stock, Res_Stock } from '../../estructuras/Stock';
import { StockPage } from '../stock/stock';

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
  //#endregion
  //#region Stock
    public ltStok:Stock[];
    public ltStokResumen:Res_Stock[];
    public totalStock;
    public GrupoMayorStockBajo:Res_Stock = {Cantidad:0,Grupo:"Desconocido"};
    
    public pieChartLabels:string[] = [];
    public pieChartData:number[] = [];
    public pieChartType:string = 'pie';
    public baseOptions: any = {
      responsive: true,
      maintainAspectRatio: true,
    };
    chartLegend:boolean = false;
  //#endregion
  
  constructor(public modal:ModalController ,public con:ConexionHttpProvider,public navCtrl: NavController, public navParams: NavParams) {
    let temp: string = new Date().toISOString();
    let tempAux = temp.split("T")[0];
    this.FechaFin = tempAux;
    this.FechaIni = tempAux;
  }

  ionViewDidLoad() {
    this.goSincronizar();
  }

  getResumenFacV(){    
    this.con.getResFac("V",this.FechaIni,this.FechaFin,this.Sucursal.ID).then(async ()=>{
      this.listFV = await JSON.parse(this.con.data);     
      this.totalFV = await this.getSumatoria(this.listFV)
      this.con.getResFac("C",this.FechaIni,this.FechaFin,this.Sucursal.ID).then(async ()=>{
        this.listFC = await JSON.parse(this.con.data);
        this.totalFC = await this.getSumatoria(this.listFC);
      });      
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
    let goPage = this.modal.create(FacturasPage,{FV:this.listFV,FC:this.listFC,TV:this.totalFV,TC:this.totalFC});
    goPage.present();
  }

  async goSincronizar(){
    await this.getResumenFacV();
    await this.getStockBajo();
  }

  goConfigurar(){
    let config = this.modal.create(ConfiguracionPage,{"FechaFin":this.FechaFin,"FechaIni":this.FechaIni});
    config.present();
    config.onDidDismiss((data)=>{
     //console.log(data);
      if(data!==null && data!==undefined){
        this.FechaFin = data.FechaFin
        this.FechaIni = data.FechaIni
        this.Sucursal = data.Sucursal;
        this.goSincronizar();
      }      
    })
  }

  getStockBajo(){    
    this.con.getResStockBajo(this.Sucursal.ID).then(async ()=>{
      this.ltStokResumen = await JSON.parse(this.con.data);
      //console.log("res ",this.ltStokResumen);
      this.con.getStockBajo(this.Sucursal.ID).then(async ()=>{
        this.ltStok = await JSON.parse(this.con.data)
        //console.log("total ",this.ltStok);
        await this.contarDatosStock();
        await this.llenarDatosGraficoStock();
      })
    })    
  }

  async llenarDatosGraficoStock(){
    //console.log(this.ltStokResumen);
    //public pieChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail Sales'];
    //public pieChartData:number[] = [300, 500, 100];
    //public pieChartType:string = 'pie';
    
    let temp1=[];
    let temp2=[];
    for (let index = 0; index < this.ltStokResumen.length; index++) {
      const element = await this.ltStokResumen[index];
      await temp1.push(element.Cantidad);
      await this.pieChartLabels.push(element.Grupo);
    }

    //this.pieChartLabels = await temp2;
    this.pieChartData = await temp1;
    console.log(this.pieChartLabels)
    console.log(this.pieChartData)
  }

  contarDatosStock(){
    this.totalStock=0;
    this.ltStokResumen.forEach(grupo => {
      this.totalStock = this.totalStock.valueOf() + grupo.Cantidad.valueOf();
    });

    this.GrupoMayorStockBajo = {Cantidad:0,Grupo:"Desconocido"};
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
}
