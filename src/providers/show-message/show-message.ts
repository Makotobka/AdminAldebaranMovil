import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { AlertController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
=======
import { AlertController, LoadingController, Loading, ActionSheetController, ToastController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Storage } from '@ionic/storage';

>>>>>>> Oficina

@Injectable()
export class ShowMessageProvider {

<<<<<<< HEAD
  constructor( private localNotifications: LocalNotifications,private alertCtrl: AlertController, private loadingCtrl: LoadingController,    private actionSheetCtrl: ActionSheetController,    private toastCtrl: ToastController,) {

  }

=======

  public loading:Loading=undefined;  
  private tiempoLoading = undefined;   // En segundos
  private tiempoMaximo = undefined;
  private tiempoIntervalo=10;
  private conTiempo=undefined;
  private idFun=undefined;

  private titulo:string;

  constructor(    private alertCtrl: AlertController,    private loadingCtrl: LoadingController,    private actionSheetCtrl: ActionSheetController,    private toastCtrl: ToastController,        private localNotifications: LocalNotifications    ) {
    
  }

  changeContentLoading(nuevoTexto:string){    
    this.loading.setContent(nuevoTexto)
  }

  showAlertSimple(Texto) {
    let alert = this.alertCtrl.create({
      cssClass: 'alertDialogo',
      message: Texto
    });
    alert.present();
  }

  showAlertTitulo(Texto,Titulo) {
    let alert = this.alertCtrl.create({
      title: Titulo,
      cssClass: 'custom-alert-danger',
      message: Texto,
    });
    alert.present();
  }

  showAlertBotones(titulo:string, bloque:string, botones:any[]){
    let alert = this.alertCtrl.create({
      title:titulo,
      message:bloque,
      buttons:botones
    });

    alert.present();
  }

  showAlertInputs(titulo:string, botones:any[], inputs:any[]){
    let alert = this.alertCtrl.create({
      title: titulo,
      inputs: inputs,
      buttons: botones
    });
    alert.present();
  }

  showToast(Mensaje:string,tiempo?:number,posicion?:string){
    if(posicion==undefined){
      posicion = "bottom";
    }
    if(tiempo==undefined){
      tiempo = 2000;
    }

    let toast = this.toastCtrl.create({
      message: Mensaje,
      duration: tiempo,
      position: posicion
    });

    toast.present();
  }

  showNotificacionLocal(Datos:any){
    this.localNotifications.schedule({
      id: 1,
      text: 'Single ILocalNotification',
      sound: 'file://assets/sounds/notificacionLocal/SEXY.mp3',
      //C:\Programacion\Movil\Ionic\AldebaranMesero\0.0.4\src\assets\sounds\notificacionLocal\SEXY.mp3
      data: { secret: Datos }
    });

    this.localNotifications.on('click').subscribe((data)=>{

    })

  }

  async detenerTiempo(textoContenido?:string,controlTiempo?,nameIcono?:string){    
    let nameIco:string;
    let tiempo=0;
    
      //ios
      //ios-small
      //bubbles
      //circles
      //crescent
      //dots
    

    if(nameIcono==undefined){
      nameIco = 'crescent';
    }

    this.loading = this.loadingCtrl.create({
      content: textoContenido,
      showBackdrop:true,
      spinner: nameIco,
      dismissOnPageChange: true,
      duration: 50000,
    });

    if(controlTiempo){
      this.idFun = setInterval(function run(){
        tiempo++;
      },this.tiempoIntervalo);
    }

    this.loading.onWillDismiss(() => {
      if(controlTiempo){
        this.tiempoLoading = tiempo*this.tiempoIntervalo;
        clearInterval(this.idFun);
      }
    });
    this.loading.present()    
  }

  async continuarTiempo(){
    return this.loading.dismiss();
  }

  getTiempoLoading(){
    return this.tiempoLoading;
  }
>>>>>>> Oficina
}
