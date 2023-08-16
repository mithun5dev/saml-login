import { Component, OnInit, ɵangular_packages_core_core_bj } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiResourcesService } from '../../common/services/api-resources.service';
import { AuthenticationService } from '../../common/services/authentication.service';
import { LoadingService } from 'src/app/common/services/loader.service';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet,ToastController,AlertController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OfflineDbService } from 'src/app/common/services/offline-db.service';
import { NetworkService, ConnectionStatus } from 'src/app/common/services/network.service';
import { from } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { HttpHeaders, HttpClient, HttpBackend,HttpResponse  } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppConstants } from 'src/app/common/utility/constants';

//import OneSignal from 'onesignal-cordova-plugin';

import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';

declare var window: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  invalidEmail: any = 'Please enter a valid email address';
  invalidPwd: any = 'Please enter password';
  invalidCredentials: any = false;
  invalidCred: any = 'Invalid credentials';
  csrfToken: any;
  displayLogin: any = false;
  submitted:any=false;
  loadingAlert:any;

  displayLoginForm: any = false;
  
  constructor(
    public formBuilder: FormBuilder,
    private apiResources: ApiResourcesService,
    private authService: AuthenticationService,
    private loadingController: LoadingService,
    private router: Router,
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private iab: InAppBrowser,
    private offlineDB: OfflineDbService,
    private networkService: NetworkService,
    private nativeStorage: NativeStorage,
    
    
    private handler: HttpBackend,
    private http: HttpClient,
    public cookieService: CookieService,
   
    private toastController: ToastController,
    private backgroundMode: BackgroundMode,
    private alertCtrl: AlertController
  ) {
    this.initializeApp();
    // Build required validations for login form email and password
    this.loginForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ]),
      ],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    /** Set up and enable background mode for app to run in background when minimized 
    * Used for plugin background mode 
    */
    this.backgroundMode.setDefaults({
      title: 'Resustain',
      text: 'Running in background..', 
      silent: false });
    this.backgroundMode.enable();

     /** Check if token exists and call get csrf token api for getting and saving token 
     */
    if(!localStorage.getItem("token")){
      this.loadingController.presentLoadingDelayShort();
      this.apiResources.getCsrf().subscribe((response) => {
        console.log("login get csrf --->",response);
        if (response) {
  
        }
        this.loadingController.dismiss();
      }
      , (err) => {
        this.loadingController.dismiss();
        console.error('ErrorDetails---->', err);
        let toast = this.toastController.create({
          message: `error please try again`,
          duration: 1000,
          position: 'bottom'
        });
        toast.then(toast => toast.present());
      });
    }else{
      setTimeout(() => {
        //this.syncService.getAudits();
        this.loadingController.presentLoadingDelayShort();
        console.log("set timeoout first api--------------------");
        this.apiResources.getCsrf().subscribe((response) => {
          console.log("login get csrf --->",response);
          if (response) {
    
          }
          this.loadingController.dismiss();
        }
        , (err) => {
          this.loadingController.dismiss();
          console.error('ErrorDetails---->', err);
          let toast = this.toastController.create({
            message: `error please try again`,
            duration: 1000,
            position: 'bottom'
          });
          toast.then(toast => toast.present());
        });
      
      }, 3000);
    }
    /**
    * Initialize offline storage database and check if user already logged in with 
    * localstorage email and saml type identifier username. If exists navigate to dashhboard. 
    * Otherwise making login form visible. Check is done in both offline and online mode
    */
    this.offlineDB.getDatabaseState().subscribe(ready => {
      if (ready) {
        //console.log('Database is ready----->');
        const self = this;
        if (self.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
          let val = localStorage.getItem('username');
          if(val){
            const email = val;
            self.offlineDB.getCurrentUser(email).then(obj => {
              //console.log('userobj----->', obj);
              if(obj){
  
                if (typeof obj === 'object' && obj.user_name !== '') {
                  self.router.navigateByUrl('/dashboard');
                } else {
                  this.displayLogin = true;
                  //self.router.navigateByUrl('/login');
                }
              }else{
  
                this.displayLogin = true;
  
              }
              
            });
          }else{
            this.displayLogin = true;
          }
         
          // this.loadingController.dismiss();
        } else if (localStorage.getItem('email') && localStorage.getItem('password')) {
          const login = {
            'email': localStorage.getItem('email'),
            'password': localStorage.getItem('password')

          };
          this.displayLogin = false;
          console.log('submitting form --- >', login);
          setTimeout(() => {
            let notificationStr = localStorage.getItem("notificationString");

            if(notificationStr===""){

              this.submitForm(login,true);

            }else{
              self.router.navigateByUrl('/dashboard');
            }
          
          }, 2000);
        } else {
          let val = localStorage.getItem('samllogin');
          if(val && val ==='yes'){

            let valUser = localStorage.getItem('username');
            if(valUser){
              const email = valUser;
              self.offlineDB.getCurrentUser(email).then(obj => {
                //console.log('userobj----->', obj);
                if(obj){
    
                  if (typeof obj === 'object' && obj.user_name !== '') {
                    self.router.navigateByUrl('/dashboard');
                  } else {
                    
                    this.displayLogin = true;
                    //self.router.navigateByUrl('/login');
                  }
                }else{
    
                  this.displayLogin = true;
    
                }
              });
            }
          }else{
            this.displayLogin = true;
          }
        }
      }
    });
  }

  //Validation check for saml login
  samlLoginValid(){
    //this.submitted = true;
    //if (!this.loginForm.valid) { return; }
    this.samlLogin();
  }
  async showLogoutAlert(title, subtitle,msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: subtitle,
      message:msg,
      buttons: [
        {
          text: `Ok`,
          handler: () => {
            // E.g: Navigate to a specific screen
            this.loadingController.presentLoadingShort();
            setTimeout(() => {
              //this.syncService.getAudits();
              console.log("set timeoout first api--------------------");
              //this.loadingController.presentLoadingShort();
              this.apiResources.getCsrf().subscribe((response) => {
                console.log("login get csrf --->",JSON.stringify(response));
                if (response) {
                  // this.apiResources.getCsrf().subscribe((response) => {
                  //   console.log("login get csrf --->",response);
                  //   if (response) {
          
                }
                this.loadingController.dismiss();
              }
              , (err) => {
                this.loadingController.dismiss();
                console.error('ErrorDetails---->', err);
                let toast = this.toastController.create({
                  message: `error please try again`,
                  duration: 1000,
                  position: 'bottom'
                });
                toast.then(toast => toast.present());
              });
              this.offlineDB.clearDb();
              window.cookieMaster.clear();
              localStorage.clear();
              //this.ionicHTTP.clearCookies();
              //this.apiResources.setUserAgent('');
            }, 3000);
          }
        }
      ]
    })
  
    alert.present();
  }
  /**
    * Saml login method for calling microsoft login UI to authunticate user and navigate to dashboard.
    * Used in app browser plugin to load MS login UI and used browser events for getting response
    * @private
    * @method samlLogin
    * @return {none}
    */
  samlLogin() {
    window.cookieMaster.clear();
    localStorage.clear();
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
   
    // this.offlineDB.clearDb();
   // const browser = this.iab.create('https://login.microsoftonline.com/7cc553fc-7b82-4da7-a869-b6e7db5ce612/saml2?SAMLRequest=fZGxbsMgFEV%2FxRsTxiYOdlAcKWqWSOmStB26RIBxg2qDy4Mqn1%2Bcqmq7ZEQ697zLe2sQ4zDxbQwXe9QfUUPItgDaB%2BPsg7MQR%2B1P2n8apZ%2BPhxZdQpiAExKv5%2BkiQFe51xAhCGNz40hMUSAi6chsJkoMgxTqHWW7pDZWzN5fy%2BDeUm40yjtwfXB2MFbnyo2kVmq5XPQK17KhuOpEjUXDVlgyXXdyqTQr6W0ERdl%2B16JzXbKVYLTDXS9ZCpQCC1Y0eCFZ11eypxVdJRQg6r1NfW1oES1ogRNT1E8F5UXJafOKspf0hVtLmhcou46DBT5PalH0ljsBBrgVowYeFD9tHw88gVz8bO1vZLqfmbwLTrkBbdYzzW%2Ft%2FOb%2BjtfkL%2Fv9%2Bn%2FBzRc%3D', '_blank', 'location=no');
   //const browser = this.iab.create('https://login.microsoftonline.com/258ac4e4-146a-411e-9dc8-79a9e12fd6da/saml2?SAMLRequest=fZJPT9wwEMW%2FSm4%2BOY692T%2BxNitFrCqtBKiCtgcuaHAmYNWxtx6nwLevE1SVHuA6eu%2F3nme8JxjdWXdTevI3%2BGtCSkVHhDHZ4C%2BCp2nEeIvxtzX4%2FeayZU8pnUkL8WzPMZQRaaIE1pc2iCnbSEBGiZkqDDj3AOYnK44Zaz3MzH8EFx6zb7QmBgpDCt5Zj6UJo1DrHZgaay7rDfBaSuRNb3Z820CDUg39poclQrHidGzZfa%2BqAeSq4bgaVrxePzR8N0jF19vddo2mrys1S4kmPPnc16eWqTzjVc3V5pusdbXRlbxjxY%2F8hKWlKitWvIzOk56TWjZFrwOQJe1hRNLJ6Nvu6lJnoYa%2FG3tvOX%2FuyetLwQTHDvtZrZd28fDxfvfivW7%2FdrjrzD0dvwZnzWvROReeLyJCwpalOCErvoQ4Qvq4iSzlMrE9HxapxhGs6%2Fo%2BRxMTh7fU%2F3%2FI4Q8%3D', '_blank', 'location=no,closebuttoncaption=Close');
   //const browser = this.iab.create('https://login.microsoftonline.com/3d245fbe-97e6-4b5c-b7ce-b7826e2dee7b/saml2?SAMLRequest=jZExT8MwEIV3JP5D5T1xkiatayWVIhBSpMLQAgMLcuKLapHYwWej%2FnzcIFgQFcsNp%2Ffe6X1XohiHidfeHfUe3j2gu75aLE7joLEi3mpuBCrkWoyA3HX8UN%2FveBYnfAQnpHCCnPXNbUWUXMosL%2FoWos0aVlHeFl3UrjsIg2UryCTAup3lz2BRGV2REEQWDaKHRqMT2oVVkmVRwqKUPSZLnjFe5HHKlhvG8pfZXCOCdcF%2BYzT6EewB7Ifq4Gm%2Fq8jRuQk5pf70Oh0FQhFbQB%2BilY6VoT5YkYrQlp6L004MQyu6tzn4IXRsJGinegX2zthRuL8ZpHE6b5SM%2BlnKYRRqqKUMF5H8UOQz4cssJ2uc6cxAtmdbOQOx%2F3mC%2BGZBtpebl%2FQrNBwo6e%2Bfbz8B','_blank','location=no');
   //const browser = this.iab.create('https://login.microsoftonline.com/3d245fbe-97e6-4b5c-b7ce-b7826e2dee7b/saml2?SAMLRequest=jZExT8MwEIV3JP5D5T1xkqZtaiWVIhBSpMLQAgObY19Vi9guvgvi5%2BMGwYKoWDyc3nvn912N0g4n0Y50dDt4GwHp%2Bmo2%2B7CDw4aNwQkv0aBw0gIKUmLf3m9FkWbCAkktSbKzvrttmNFzXZSLQw%2FJegXLpOwXKulXCuJTFUsoNMCqn%2BTPENB417AYxGYd4gidQ5KO4igriiSrkrx6zOaiqMSiTPNqvq6q8mUyt4gQKNpvvMPRQthDeDcKnnbbhh2JTig4p%2FgzimXSADjGZONS4%2FkYnchlLMvPvbmSw9BL9TrlPsSKnQZH5mAg3PlgJf2NIE%2FzaWJ0cpikAqw0Q6t13IjsB6KYAF9GeQqevPID25xt9cQj%2FOcG8hsF21wsXvOvzJhf898X33wC','_blank','location=yes');
   const browser = this.iab.create('https://tatatest.resustain.io/users/auth/saml','_blank','location=yes,clearcache=yes,clearsessioncache=yes,cleardata=yes');
   
   
   browser.on('exit').subscribe((event: any) => {
      this.samlLoginMethod();
    });

    browser.on('loadstop').subscribe((event: any) => {
      const cookie = '';
      //console.log('event saml: ' + event);
      if (event && event.url === 'https://tatatest.resustain.io/#/') {//#/landing_page
        const self = this;
        const metaPromise = browser.executeScript({
          code: `(function(){
            var csrfToken=null;
            const metas =  document.getElementsByTagName('meta');
            //console.log("meta tag infor----->",metas);
            for (let i = 0; i < metas.length; i++) {
              if (metas[i].getAttribute('name') === 'csrf-token') {
                localStorage.setItem('csrf-token',metas[i].getAttribute('content'));
                return csrfToken = metas[i].getAttribute('content');
              }
            }
          })()`
        });
        metaPromise.then((value) => {
          //console.log(value[0]);
          //console.log('success meta tag response --- >', value[0]);
          self.csrfToken = value[0];
          window.cookieMaster.getCookieValue('https://tatatest.resustain.io', '_treeni_session', function (data: any) {
            localStorage.setItem('cookie', data.cookieValue);
            browser.close();
          }, function (error) {
            if (error) {
              //console.log('error: ' + error);
            }
            browser.close();
          });
          
        }, err => {
          if (err) {
            //console.log('error: ' + err);
            if(window.confirm('Something went wrong! Please try again.'))
  
            {
      
              browser.close();
      
            }
          

          }
        });
      }

      if (event && event.url === 'https://tatatest.resustain.io/users/sign_in#/') {
        setTimeout(() => {
          //this.closeLoader();
        browser.close();
        this.showLogoutAlert('Login Error!','Something went wrong, please try again..','Invalid session error! Please reload the app and login again.');
      }, 3000);
      }
    });
    browser.on('loadstart').subscribe((event: any) => {
      //console.log(event);
    });
    
    }else{

      let toast = this.toastController.create({
        message: `You are offline`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
    }
    
  }

  ionViewWillEnter() {
    //console.log('Inside view Did Enter');
    this.submitted = false;
    this.loginForm.reset();
  }
   /**
    * Reset/Clear form fields email and password
    * 
    * @private
    * @method resetForm
    * @return {none}
    */
  resetForm() {
    // this.formSubmitted = false
    this.submitted = false;
    this.loginForm.reset();
    this.loginForm.markAsUntouched();

  }
 /**
    * Saml login method for getting user data after authenticating.
    * 
    * @private
    * @method samlLoginMethod
    * @return {none}
    */
  samlLoginMethod() {
    const cookieValue = localStorage.getItem('cookie');
    this.apiResources.setCsrfToken(this.csrfToken);
    console.log('apiResources.csrfToken----->', this.apiResources.getCsrfTokenVal());
    this.http = new HttpClient(this.handler);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }).set('x-csrf-token', this.csrfToken),
      observe: 'response' as 'response',
      withCredentials: true
    };
    const ApiUrl = 'https://tatatest.resustain.io/api/set_custom_cookie.json';
    const obj = {
      custom_cookie: cookieValue
    };
    this.loadingController.presentLoading();
    return this.http.post(ApiUrl, obj, httpOptions).subscribe(res => {
      console.log(' response---->', JSON.stringify(res));
      return this.http.get('https://tatatest.resustain.io/units.json', httpOptions).subscribe(res => {
        console.log('unitss--->', res);
      });
    }, err => {
      const obj = {
        user: {
        },
      };
      //console.log('error--->', err);
      return this.http.post('https://tatatest.resustain.io/users/sign_in.json', obj, httpOptions).subscribe(res => {
       
        const userData = res.body || {};
        this.apiResources.setCurrentUser(userData);
        //console.log('unitss--->', res);
        //console.log('unitss--->',  this.apiResources.getCurrentUser());
        localStorage.setItem('email',  this.apiResources.getCurrentUser().email);
              //localStorage.setItem('password', loginData.password);
              this.offlineDB.addCurrentUser( this.apiResources.getCurrentUser()._id, this.apiResources.getCurrentUser().email, userData).then((currentUser) => {
                // //console.log("current user stored offline --->",currentUser);
               // OneSignal.setExternalUserId(this.apiResources.getCurrentUser().email);
               // OneSignal.disablePush(false);

                localStorage.setItem('username',  this.apiResources.getCurrentUser().email);
                localStorage.setItem('samllogin',  'yes');
                this.loadingController.dismiss();
                this.syncData(true);
              }, error => {
                //console.log(error);
              });
        
        // this.router.navigateByUrl('/dashboard');
       
      });
    });
  }

  /**
    * Login user by taking fields email and password
    * And call api after assigning to object
    * @private
    * @method loginData
    * @return {none}
    */
  loginData() {
    const loginData = {
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value,
    };
    this.submitted = true;
    if (!this.loginForm.valid) { return; }
    this.submitForm(loginData,false);
  }

   /**
    * Submitting user data to server with sign_in.json api  
    * 
    * @private
    * @method submitForm
    * @return {none}
    */
  submitForm(loginData,isLoggedIn) {
    const self = this;
    // || !forceRefresh
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {
      this.loadingController.present();
      //Get latest token 
      this.apiResources.getCsrf().subscribe((response) => {
        console.log("login get csrf --->",response);
        if (response) {
          //sign_in.json api called from authService passing login data object
          this.authService.login(loginData).subscribe(
            (response: any) => {
              console.log("login get user --->",response);
              this.invalidCredentials = false;
              const userData = response.body || {};
              //Save user data
              this.apiResources.setCurrentUser(userData);
              const self = this;
              localStorage.setItem('email', loginData.email);
              localStorage.setItem('password', loginData.password);
              //Set onesignal id with user email for push notifications
              //OneSignal.setExternalUserId(response.body.email);
              //OneSignal.disablePush(false);
              //Add User offline data base
              self.offlineDB.addCurrentUser(userData._id, userData.email, userData).then((currentUser) => {
                console.log("current user stored offline --->",currentUser);
                localStorage.setItem('username', loginData.email);
                localStorage.setItem('samllogin',  'no');
                if (response.status !== '498') {
                  console.log(response.status);
                  //   this.loadingController.presentWithMessage("Syncing");
                  self.syncData(isLoggedIn);
                }
                else {
                  this.invalidCredentials = true;
                  this.displayLogin = true;
                  //self.router.navigateByUrl('/login');
                }

              }, error => {

                //console.log(error);
                console.log("login get user error--->",error);
              });
            },
            (err) => {
              this.loadingController.dismiss();
              //  this.invalidCredentials = true;
              console.error('ErrorDetails---->', err);
              if (err) {
                if (err.body && err.body !== '') {
                  if (err.body.error) {
                    this.invalidCredentials = true;
                    this.invalidCred = err.body.error;
                  } else if (err.body.errors && err.body.errors.length > 0) {
                    //this.invalidCredentials = true;
                    if (err.status === 498) {
                      this.submitForm(loginData,isLoggedIn);
                    }
                  }
                }
              }
              // this.invalidCred = err.body.error;
              //this.displayLogin = true;
              //if any error clear user data and show login again 
              localStorage.clear();
              this.offlineDB.clearDb();
              // this.auditService.publishSomeData({
              //   action: 'logout'
              // });
              //this.navCtrl.navigateRoot('/login');
              this.displayLogin = true;
              //this.router.navigateByUrl('/login');
            }
          );
        }
      }, (err) => {
         //if any error clear user data and show toast
        this.loadingController.dismiss();
        this.displayLogin = true;
        //  this.invalidCredentials = true;
        console.error('ErrorDetails---->', err);
        let toast = this.toastController.create({
          message: `Login error please try again`,
          duration: 3000,
          position: 'bottom'
        });
        toast.then(toast => toast.present());
      });
    }else{ 
      // When Offline, check if user is already logged in and then navigate to
      // dashboard otherwise show back login screen
    let val = localStorage.getItem('username');
          if(val){
            const email = val;
            self.offlineDB.getCurrentUser(email).then(obj => {
              //console.log('userobj----->', obj);
              if(obj){
  
                if (typeof obj === 'object' && obj.user_name !== '') {
                  self.router.navigateByUrl('/dashboard');
                } else {
                  this.displayLogin = true;
                  //self.router.navigateByUrl('/login');
                }
              }else{
  
                this.displayLogin = true;
  
              }
              
            });
          }else{
            this.displayLogin = true;
          }
      let toast = this.toastController.create({
        message: `You are offline`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
    }
  }
  /**
    * After successfully login and getting user data 
    * sync data for offline use. Currently sync is not done
    * as it is taking alot of time.
    * @private
    * @method syncData
    * @inputs {boolean}
    * @return {none}
    */
  syncData(isLoggedIn) {
    const self = this;
    //Check if there are any saved records in offline mode and call api for saving
    self.offlineDB.getSavedRecords().then(res => {
      console.log('saved Data---> ', res);
      //  this.loadingController.dismiss();
    }, err => {
      // this.loadingController.dismiss();
      //console.log(err);
      if (err.rows.length > 0) {
        for (let i = 0; i < err.rows.length; i++) {
          const data = JSON.parse(err.rows.item(i).indicator_record);
          // this.indicatorRecordService.save(data).subscribe((data: any) => {
          //   //console.log(data);
          //   //   this.offlineDB.clearSaveData();
          // }, (err: any) => {
          //   //console.log(err);
          // });
        }
      }
    });
    //Get updated/edited records in offline mode and call api for updating
    this.offlineDB.getUpdatedRecords().then(res => {
      //console.log(res);
    }, err => {
      //console.log(err);
      if (err.rows.length > 0) {
        for (let i = 0; i < err.rows.length; i++) {
          const data = JSON.parse(err.rows.item(i).indicator_record);
          const indicator_id = err.rows.item(i).indicator_id;
          // this.indicatorRecordService.update(data, indicator_id).subscribe((dataDb: any) => {
          //   //console.log(dataDb);
          //   //   this.offlineDB.clearSaveData();
          // }, (err: any) => {
          //   //console.log(err);
          // });
        }
      }
    });
    //Get deleted records in offline mode and call api for deleting
    //Currently delete functionality is not available for mobile application
    this.offlineDB.getDeletedRecords().then(data => {
      //console.log(data);
      // this.auditService.deleteRecord(data[0].record_id).subscribe((res) => {
      //   //console.log(res);
      //   // this.location.back();
      //   // this.auditService.publishSomeData({
      //   //   foo: 'bar'
      //   // });
      //   // this.events.publish('returnedFromEdit');
      // }, (err) => {
      // });
    }, (err) => {
      for (let i = 0; i < err.rows.length; i++) {
        // this.auditService.deleteRecord(err.rows.item(i).record_id).subscribe((res) => {
        //   //console.log(res);
        // }, (err) => {
        // });
      }
    });
    //Go to dashboard page
    if(!isLoggedIn){
       //this.offlineDB.clearDb();
       //sync data for offline use. Currently sync is disabled
      this.updateDbFromServer();
    }else{
      this.loadingController.dismiss();
      console.log("set timeoout audits--------------------");
      this.offlineDB.getDatabaseState().subscribe(ready => {
        if (ready) {
      this.router.navigateByUrl('/dashboard');
      }
      });
    }
    
   
  }
   //Go to dashboard page
  updateDbFromServer(){
    // this.loadingController.presentWithMessage("Syncing");
    // setTimeout(() => {

    //     this.syncService.getIndicatorsData();
    //     //console.log("set timeoout data entry--------------------");
      

    // }, 2000);
    setTimeout(() => {
      //this.syncService.getAudits();//syncService is for getting entire app data for offline use
      console.log("set timeoout audits--------------------");
      //Navigate to dashboard
      this.loadingController.dismiss();
            this.offlineDB.getDatabaseState().subscribe(ready => {
              if (ready) {
                this.router.navigateByUrl('/dashboard');
              }
            });
    }, 2000);
   
    
    
  }

  initializeApp() {
    // other code
   
    // this.auditService.getObservable().subscribe((data) => {
    //   //console.log("deleted data -->", data);
    //   if (data.action === 'logout') {
    //     this.displayLogin = true;
    //   }
    // });
  }
}
