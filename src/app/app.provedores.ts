import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ErrorHandler, NgModule } from '@angular/core';
import { ConexionHttpProvider } from "../providers/conexion-http/conexion-http";
import { ArchivoInternosProvider } from "../providers/archivo-internos/archivo-internos";
import { ShowMessageProvider } from "../providers/show-message/show-message";

export const proveedores = [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConexionHttpProvider,
    ArchivoInternosProvider,
    ShowMessageProvider
]