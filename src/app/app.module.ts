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
import { ConexionHttpProvider } from '../providers/conexion-http/conexion-http';
import { ArchivoInternosProvider } from '../providers/archivo-internos/archivo-internos';
import { IonicStorageModule } from '@ionic/storage';
import { staticConfigStorage } from '../providers/archivo-internos/staticConfigStorage';

@NgModule({
  declarations: [
    paginas
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(staticConfigStorage),
    importaciones
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    paginas
  ],
  providers: [
    proveedores,
    ConexionHttpProvider,
    ArchivoInternosProvider
  ]
})

export class AppModule {}
