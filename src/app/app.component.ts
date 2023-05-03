import { Component } from '@angular/core';
import { Platform,AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppConstants } from './common/utility/constants';

import { Router, ActivatedRoute } from '@angular/router';
//import { OneSignal } from '@ionic-native/onesignal/ngx';
//import OneSignal from 'onesignal-cordova-plugin';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  isAppInForeground = true;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
   
    private alertCtrl: AlertController,
    private router: Router,
    
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
    //  document.addEventListener("deviceready", this.onDeviceReady, false);
    if (this.platform.is('cordova')) {
      this.setPlatformListener();
    }
      this.statusBar.styleLightContent();
      if (this.platform.is('ios')){
        this.statusBar.overlaysWebView(false);
      }
      this.statusBar.backgroundColorByHexString('#273207');
      this.splashScreen.hide();

      
   
      });
  }
   onDeviceReady() {
    //window.open = iab.open;
  }


// Set listener for checking app background or foreground
  setPlatformListener() {
    this.platform.pause.subscribe(() => {// background
      console.log('In Background');
      this.isAppInForeground = false;
    });

    this.platform.resume.subscribe(() => {// foreground
      console.log('In Foreground');
      this.isAppInForeground = true;
     

        
     
    });

    
  }

      async showAlert(title, msg, task) {
        const alert = await this.alertCtrl.create({
          header: title,
          subHeader: msg,
          buttons: [
            {
              text: `Action: ${task}`,
              handler: () => {
                // E.g: Navigate to a specific screen
              }
            }
          ]
        })
        alert.present();
      }
 

  
}
