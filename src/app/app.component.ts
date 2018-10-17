import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { CajaPage } from '../pages/caja/caja';
<<<<<<< HEAD
import { LoginPage } from '../pages/login/login';
=======
import { DashboardEspecificoPage } from '../pages/dashboard-especifico/dashboard-especifico';
>>>>>>> Oficina
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
<<<<<<< HEAD
  rootPage:any = LoginPage;
=======
  rootPage:any = DashboardEspecificoPage;
>>>>>>> Oficina

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

