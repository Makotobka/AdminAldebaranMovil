import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { paginas } from './app.page';
import { importaciones } from './app.importaciones';
import { proveedores } from './app.provedores';

@NgModule({
  declarations: [
    paginas
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    importaciones
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    paginas
  ],
  providers: [
    proveedores
  ]
})

export class AppModule {}
