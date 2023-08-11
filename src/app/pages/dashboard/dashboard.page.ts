import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { LoginIntervalService } from '../../common/services/login-interval.service';
import { LocationServiceService } from 'src/app/common/services/location-service.service';
import { OfflineDbService } from 'src/app/common/services/offline-db.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  
  unsubscribeBackEvent:any;
  constructor( private platform: Platform,
    private router: Router,
    private authService: AuthenticationService,
    private intervalProvider: LoginIntervalService,
    private locationService:LocationServiceService,
    private offlineDB: OfflineDbService,
    ) { }

  ngOnInit() {

    this.setLoginInterval();
    this.checkLocationEnabled();
  }
   // Call login api for checking session status and update token if session is expired
  setLoginInterval() {
   this.intervalProvider.setInterval();
  }

  //Check if location is enabled for device and get lattitude and longitude values 
  checkLocationEnabled(){
   let isLocationEnabled =  this.locationService.checkLocationEnabled();
   if(isLocationEnabled){

      let location = this.locationService.getLocationCoordinates();
      console.log('Location at dashboard',location);
   }
  }
  ionViewWillLeave() {

    this.unsubscribeBackEvent.unsubscribe();

  }
  // Navigate to notification page
  openNotifications(){
    this.router.navigateByUrl('/notifications');
  }
  
  ionViewWillEnter() {
    //Capture back button event of device and show popup for exiting app
    this.unsubscribeBackEvent = this.platform.backButton.subscribeWithPriority(10,  () => {

      if(window.confirm('Do you want to exit the app?'))

      {

        navigator['app'].exitApp();

      }

     });
     

    
  }

 //Logout of the app and navigate back to login page
 logout() {
 
    //Call logout api
    this.authService.logout().subscribe(
      (res: any) => {
        //Disable push notifications
        //OneSignal.disablePush(true);
        //Clear all user and offline data
        localStorage.clear();
        this.offlineDB.clearDb();
          this.router.navigateByUrl('/login');
         
        
      }, err => {
        //console.log('Error---->', err);
        //Disable push notifications
        //OneSignal.disablePush(true);
        //Clear all user and offline data
        localStorage.clear();
        this.offlineDB.clearDb();
         //Navigate back to login page using service broadcaster
        
          this.router.navigateByUrl('/login');          
        
      }
    );
 
}

addAudit(){
  this.router.navigate(['/audit-module'])
}


 
}
