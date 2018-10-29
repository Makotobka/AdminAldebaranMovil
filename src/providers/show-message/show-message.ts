import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Injectable()
export class ShowMessageProvider {

  constructor( private localNotifications: LocalNotifications,private alertCtrl: AlertController, private loadingCtrl: LoadingController,    private actionSheetCtrl: ActionSheetController,    private toastCtrl: ToastController,) {

  }

}
