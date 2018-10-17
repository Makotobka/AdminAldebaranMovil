import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CajaPage } from '../pages/caja/caja';
import { DashboardEspecificoPage } from '../pages/dashboard-especifico/dashboard-especifico';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = DashboardEspecificoPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

