import { NgModule, CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpConfigInterceptor } from './common/services/http-config.interceptor';
import { HTTP } from '@ionic-native/http/ngx';
import {WebView} from '@ionic-native/ionic-webview/ngx';

import { DatePicker } from '@ionic-native/date-picker/ngx';
import { IonicSelectableModule } from 'ionic-selectable';
import { DatePipe } from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NgInitDirective } from './ng-init.directive';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { File } from '@ionic-native/file/ngx';
import { UploaderModule } from '@trendster-io/ng-uploader';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx'
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { LocationServiceService } from 'src/app/common/services/location-service.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx'

//import { OneSignal } from '@ionic-native/onesignal/ngx';
//import OneSignal from 'onesignal-cordova-plugin';
@NgModule({
  declarations: [AppComponent, NgInitDirective],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    ReactiveFormsModule, FormsModule,HttpClientModule,
    IonicSelectableModule,UploaderModule
  ],
  
  providers: [
    StatusBar,
    SplashScreen,
    WebView,
    DatePicker,
    DatePipe,
    InAppBrowser,
    FileOpener,
    Keyboard,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS, useClass:HttpConfigInterceptor, multi:true
    },
    HTTP,
    Network,
    SQLite,
    SQLitePorter,
    NativeStorage,
    Camera,
    
    Crop,
    Base64,
    File,
    AndroidPermissions,
    BackgroundMode,
    Geolocation,
    LocationAccuracy,
    LocationServiceService,
    Diagnostic 
    
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
