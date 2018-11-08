import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ErrorHandler, NgModule } from '@angular/core';
import { Screenshot } from '@ionic-native/screenshot';
import { Base64 } from '@ionic-native/base64';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file'
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConexionHttpProvider } from "../providers/conexion-http/conexion-http";
import { ArchivoInternosProvider } from "../providers/archivo-internos/archivo-internos";
import { ShowMessageProvider } from "../providers/show-message/show-message";
<<<<<<< HEAD
=======
import { LocalNotifications } from "@ionic-native/local-notifications";
>>>>>>> Oficina

export const proveedores = [
    StatusBar,
    FilePath,
    SplashScreen,
    Screenshot,
    Base64,
    PhotoViewer,
    File,
    FileTransfer,
    FileTransferObject,    
    FileOpener,
    InAppBrowser,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConexionHttpProvider,
    ArchivoInternosProvider,
    ShowMessageProvider
]