import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { ChatSystem } from './app.component';
import { HomePage } from '../pages/home/home';
import { ImageProvider } from '../providers/image/image';
import { LoadProvider } from "../providers/load-provider";


@NgModule({
  declarations: [
    ChatSystem,
    HomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(ChatSystem)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ChatSystem,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    LoadProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ImageProvider
  ]
})
export class AppModule { }
