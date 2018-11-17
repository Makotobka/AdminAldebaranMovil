import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ConexionHttpProvider } from '../../providers/conexion-http/conexion-http';
import { ShowMessageProvider } from '../../providers/show-message/show-message';
import { ArchivoInternosProvider } from '../../providers/archivo-internos/archivo-internos';
import { keyStorage } from '../../providers/archivo-internos/staticConfigStorage';
import { Chart } from 'chart.js';
import { colorGraficoStandar } from '../../app/app.config';

/**
 * Generated class for the FacturaComparacionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-factura-comparacion',
  templateUrl: 'factura-comparacion.html',
})
export class FacturaComparacionPage {

  @ViewChild('lineCompra')  lineCompra;
  @ViewChild('lineVenta')   lineVenta;
  private maxMesAtras=3;
  public mesName:string;
  private mesMax=20;
  public mesActual:number
  public anoActual:number
  public porMesC:number
  public porMesV:number
  public data=[];  

  constructor(public archivo:ArchivoInternosProvider ,public show:ShowMessageProvider,public con:ConexionHttpProvider ,public navCtrl: NavController, public navParams: NavParams) {
  }

  async ionViewDidLoad() {
    await this.show.detenerTiempo()
    await this.show.changeContentLoading("Descangando Año Actual")
    const fecha = await this.archivo.leerArchivo(keyStorage.keyFechaSistema)
    if(fecha!==undefined && fecha!==null){
      this.anoActual = await parseInt((fecha).split('-')[0]);
      this.mesActual = await parseInt((fecha).split('-')[1]);      
      await this.getFacCVAños(this.anoActual)
      const añoAnterior:number = this.anoActual.valueOf()-1;
      await this.show.changeContentLoading("Descangando Año Anterior")
      await this.getFacCVAños(añoAnterior)   
    } 
    console.log(this.mesMax)
    console.log(this.mesActual)
    if(this.mesMax>=this.mesActual){
      await this.ObtenerValores();      
      await this.limpiarGrafico() 
      await this.llenarGrafico();      
    }else{
      console.log("No existen esos meses")
    }
    await this.show.continuarTiempo();   
    
  }

  async getFacCVAños(AñoDeseado){
    let meses=[];
    this.show.changeContentLoading("Cargando Facturas de Ventas")    
    await this.con.getFactAnuales("V",1,AñoDeseado).then(async (resV)=>{
      if(resV){
        let dataAñosV = await JSON.parse(this.con.data)        
        this.show.changeContentLoading("Cargando Facturas de Compras")
        await this.con.getFactAnuales("C",1,AñoDeseado).then(async (resC)=>{
          if(resC){
            let dataAñosC = await JSON.parse(this.con.data) 
            let facVenta=[];
            let facCompra=[];
            let totalV:number=0,totalC:number=0;

            for (let index = 0; index < dataAñosV.length; index++) {
              const elementV =  dataAñosV[index];
              const elementC =  dataAñosC[index];
              meses.push(elementV.Meses)
              totalC = totalC.valueOf()+elementC.Total.valueOf();
              totalV = totalV.valueOf()+elementV.Total.valueOf();
              facVenta.push(elementV.Total);
              facCompra.push(elementC.Total);
            }  

            if(this.mesMax>meses.length){
              this.mesMax = meses.length;
            }
            this.data.push(
              {
                Año:AñoDeseado,
                Meses:meses,
                FC:facCompra,
                FV:facVenta
              }
            )
            //-------------------------------------//
            //facVenta = facVenta.slice(facVenta.length-ultimosNMes,facVenta.length);
            //facCompra = facCompra.slice(facCompra.length-ultimosNMes,facCompra.length);
            //meses = meses.slice(meses.length-ultimosNMes,meses.length);                         
            //-------------------------------------//
            /*
            dataDatos.push(
              {data:facVenta,label:"Ventas", backgroundColor: this.colorBordePaste[0]}
            );
            dataDatos.push(
              {data:facCompra,label:"Compras",backgroundColor: this.colorBordePaste[1]}
            );

            
            
            this.CanvasFactura.data.datasets=dataDatos        
            this.CanvasFactura.data.labels=meses    
            this.totalFC = totalC.valueOf()/this.dataAñosV.length.valueOf();
            this.totalFV = totalV.valueOf()/this.dataAñosV.length.valueOf();

            this.CanvasFactura.resize();
            this.CanvasFactura.update()   
            */
            //datasets]="barChartData" [labels]="barChartLabels" [options]="barChartOptions" [legend]="barChartLegend" [chartType]="barChartType"
          }
        });
      }
    }).catch(()=>{

    })
  }

  ObtenerValores(){
    if(this.data.length===2){
      for (let i = 0; i < this.data.length; i++) {
        const año = this.data[i];
        for (let j = 0; j < año.Meses.length; j++) {                    
          if(j.valueOf() === (this.mesActual.valueOf()-1)){            
            año.valMesC = año.FC[j].valueOf();
            año.valMesV = año.FV[j].valueOf();
          }        
        }      
      }
      this.porMesC = (((this.data[0].valMesC.valueOf()*100)/this.data[1].valMesC.valueOf())-100).valueOf()
      this.porMesV = (((this.data[0].valMesV.valueOf()*100)/this.data[1].valMesV.valueOf())-100).valueOf()
      this.mesName = this.data[0].Meses[this.mesActual-1];
      
    }    
  }

  limpiarGrafico(){
    if(this.lineVenta.nativeElement!=undefined){          
      this.lineVenta = new Chart(this.lineVenta.nativeElement, { 
        type: 'bar',
        data: {
            labels: [""],
            datasets: [{      
                label: 'Sin Caja',             
                data:[0,0,0],
                backgroundColor: colorGraficoStandar,
                borderWidth: 2
            }]
        },
        
        options: {     
          fill:false,         
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
              display: true
            },
            elements: {
              line: {
                  tension: 0
              }
          }
        }  
      });
    }else{
      this.lineVenta.data.datasets[0].data=[0,0,0]       
      this.lineVenta.data.datasets[0].label="Sin Caja";
    }
    this.lineVenta.update()     
    
    if(this.lineCompra.nativeElement!=undefined){          
      this.lineCompra = new Chart(this.lineCompra.nativeElement, { 
        type: 'bar',
        data: {
            labels: [""],
            datasets: [{      
                label: 'Sin Caja',             
                data:[0,0,0],
                backgroundColor: colorGraficoStandar,
                borderWidth: 2
            }]
        },
        
        options: {     
          fill:false,         
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
              display: true
            },
            elements: {
              line: {
                  tension: 0
              }
          }
        }  
      });
    }else{
      this.lineCompra.data.datasets[0].data=[0,0,0]       
      this.lineCompra.data.datasets[0].label="Sin Caja";
    }
    this.lineCompra.update()       
  }

  llenarGrafico(){        
    let meses=[];
    this.lineVenta.data.datasets=[];
    this.lineCompra.data.datasets=[];

    for (let index = 0; index < this.data.length; index++) {
      const element = this.data[index];      
      let dataV=[];
      let dataC=[];
      meses=[];
      let val = this.mesActual.valueOf()-this.maxMesAtras
      if(val.valueOf()>=0){
        meses = element.Meses.splice(val,this.maxMesAtras);              
        for (let i = val; i < this.mesActual; i++) {          
          console.log("sob ",i)
          dataV.push(element.FV[i])        
          dataC.push(element.FC[i])        
        }        
      }else{
        meses = element.Meses.splice(0,this.mesActual);
        for (let i = 0; i < this.mesActual; i++) {
          console.log("ins ",i)
          dataV.push(element.FV[i])        
          dataC.push(element.FC[i])        
        }        
      }      
      console.log(dataV)
      
      this.lineVenta.data.datasets.push({
        fill:false,
        data:dataV,
        label:element.Año,
        backgroundColor: colorGraficoStandar[index]
      });     

      this.lineCompra.data.datasets.push({
        fill:false,
        data:dataC,
        label:element.Año,
        backgroundColor: colorGraficoStandar[index]
      });   
    }
    this.lineVenta.data.labels = meses;
    this.lineCompra.data.labels = meses;  
    //console.log("ori ",this.lineCompra.data.labels)
    //console.log("nuevo ",this.girarDatos(this.lineCompra.data.labels))
    //this.lineCompra.data.labels = this.girarDatos(this.lineCompra.data.labels)

    this.lineVenta.data.datasets = this.girarDatos(this.lineVenta.data.datasets);
    this.lineCompra.data.datasets = this.girarDatos(this.lineCompra.data.datasets);
    
    this.lineCompra.resize();
    this.lineCompra.update();

    this.lineVenta.resize();
    this.lineVenta.update();
  }

  girarDatos(lista:any[]){
    let otherList=[];
    for (let index = lista.length-1; index >= 0; index--) {      
      otherList.push(lista[index])
    }
    return otherList;
  }
    
}
