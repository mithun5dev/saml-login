import { Component, Inject, OnInit, ɵangular_packages_core_core_bj } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiResourcesService } from '../../common/services/api-resources.service';
import { AuthenticationService } from '../../common/services/authentication.service';
import { LoadingService } from 'src/app/common/services/loader.service';
import { Router } from '@angular/router';
import { Platform, IonRouterOutlet, ToastController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OfflineDbService } from 'src/app/common/services/offline-db.service';
import { NetworkService, ConnectionStatus } from 'src/app/common/services/network.service';
import { from } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { HttpHeaders, HttpClient, HttpBackend, HttpResponse, HttpRequest } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { AppConstants } from 'src/app/common/utility/constants';
import { HTTP, HTTPResponse } from "@ionic-native/http/ngx";

//import OneSignal from 'onesignal-cordova-plugin';

import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { DOCUMENT } from '@angular/common';

declare var window: any;
declare var wkWebView: any;
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
  submitted: any = false;

  private _window:Window;
   systemBrowser;

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
    private ionicHTTP: HTTP,
    @Inject(DOCUMENT) private document:Document

  ) {
    this._window = this.document.defaultView;
    this.initializeApp();

  }

  ngOnInit() {
    /** Set up and enable background mode for app to run in background when minimized 
    * Used for plugin background mode 
    */
    this.backgroundMode.setDefaults({
      title: 'Resustain',
      text: 'Running in background..',
      silent: false
    });
    this.backgroundMode.enable();

    /** Check if token exists and call get csrf token api for getting and saving token 
    */
    
    if(!localStorage.getItem("token")){
      this.loadingController.presentLoading();
      this.apiResources.getCsrf().subscribe((response) => {
        console.log("login get csrf --->",JSON.stringify(response));
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
        console.log("set timeoout first api--------------------");
        this.apiResources.getCsrf().subscribe((response) => {
          console.log("login get csrf --->",JSON.stringify(response));
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
    let headers2;
    headers2 = { "Content-Type": "application/json" };
    // headers2["Access-Control-Allow-Origin"]="*";
    // headers2["Origin"]="localhost://"
    //headers2["x-csrf-token"] = this.csrfToken;
    //headers2["x-csrf-token"] = this.csrfToken;
    //headers2["Cookie"] = '_treeni_session='+cookieValue;
    headers2["Accept"]= "application/json";
    this.ionicHTTP.get('https://tatatest.resustain.io/users/sign_in.json','',headers2).then(res => {
         console.log('handler response--->', JSON.stringify(res));
         if (
          res.headers["set-cookie"] ||
          res.headers["Set-Cookie"]
        ) {
          //globalCsrfToken = event.headers('XSRF-TOKEN');
          var globalCookie =
          res.headers["set-cookie"] ||
          res.headers["Set-Cookie"] ||
          null;
          localStorage.setItem('cookie', globalCookie);
          console.log('cookie global--->', globalCookie);
          this.setCookie(globalCookie);
          //wkWebView.setCookie('https://tatatest.resustain.io' + '/', '_treeni_session', globalCookie);
        }
        
     }, error => {
       console.log('Api Error handler: ', JSON.stringify(error));
     });

  }

  //Validation check for saml login
  samlLoginValid() {
    //this.submitted = true;
    //if (!this.loginForm.valid) { return; }
   
     this.samlLogin();
    //this.openCookieUrl();
  }
  openSafariUrl() {
    let url='https://login.microsoftonline.com/3d245fbe-97e6-4b5c-b7ce-b7826e2dee7b/saml2?SAMLRequest=jZExT8MwEIV3JP5D5T1xkqZtaiWVIhBSpMLQAgObY19Vi9guvgvi5%2BMGwYKoWDyc3nvn912N0g4n0Y50dDt4GwHp%2Bmo2%2B7CDw4aNwQkv0aBw0gIKUmLf3m9FkWbCAkktSbKzvrttmNFzXZSLQw%2FJegXLpOwXKulXCuJTFUsoNMCqn%2BTPENB417AYxGYd4gidQ5KO4igriiSrkrx6zOaiqMSiTPNqvq6q8mUyt4gQKNpvvMPRQthDeDcKnnbbhh2JTig4p%2FgzimXSADjGZONS4%2FkYnchlLMvPvbmSw9BL9TrlPsSKnQZH5mAg3PlgJf2NIE%2FzaWJ0cpikAqw0Q6t13IjsB6KYAF9GeQqevPID25xt9cQj%2FOcG8hsF21wsXvOvzJhf898X33wC'
    this.openUrl(url, false);
  }
   openUrl(url, readerMode) {
   
    window['SafariViewController'].isAvailable( (available) =>{
      if (available) {
        var self = this;
        
        window['SafariViewController'].show({
              url: url,
              hidden: false, // default false. You can use this to load cookies etc in the background (see issue #1 for details).
              animated: false, // default true, note that 'hide' will reuse this preference (the 'Done' button will always animate though)
              transition: 'curl', // (this only works in iOS 9.1/9.2 and lower) unless animated is false you can choose from: curl, flip, fade, slide (default)
              enterReaderModeIfAvailable: readerMode, // default false
              tintColor: "#00ffff", // default is ios blue
              barColor: "#0000ff", // on iOS 10+ you can change the background color as well
              controlTintColor: "#ffffff" // on iOS 10+ you can override the default tintColor
              
            },
            // this success handler will be invoked for the lifecycle events 'opened', 'loaded' and 'closed'
            (result) =>{
              console.log('opened safari view',JSON.stringify(result));
              if (result.event === 'opened') {
                console.log('opened');
               
              } else if (result.event === 'loaded') {
                console.log('loaded');
                console.log('opened');
                window.handleOpenURL = (url)=> {
                  console.log('Browser url received: loaded' + url);
                setTimeout(() =>{

                },200);
              }
              } else if (result.event === 'closed') {
                console.log('closed');
              //self.openCookieUrl();
                
              // window['SafariViewController'].cookieMaster.getCookieValue('https://tatatest.resustain.io', '_treeni_session', function (data: any) {
              //         console.log('Data.cookieValue', data.cookieValue);
              //         //localStorage.setItem('cookie', data.cookieValue);
              
              //           }, function (error) {
              //             if (error) {
              //               console.log('Set cookie error: ' + error);
              //             }
                        
              //           });
         
              window['SafariViewController'].show({
                url: 'https://tatatest.resustain.io/#/hidden_token',//'http://iqmonk.com/nitro/hidden.html'
                hidden: true,
                animated: false
              });
              // (window as any).handleOpenURL = (url: string) => {
              //   setTimeout(() => {
              //     this.handleOpenUrl(url);
              //   }, 0);
              // };
             
              window.handleOpenURL = (url)=> {
                console.log('Browser url received: hidden' + url);
                setTimeout(() =>{
                
                  
                
                  window['SafariViewController'].hide();
                  var data = decodeURIComponent(url.substr(url.indexOf('=')+1));
                  console.log('Browser data received: ' + data);
                  console.log('Browser data received: token' + data.split(',')[1]);
                  this.csrfToken = data.split(',')[1];
                  localStorage.setItem('token', this.csrfToken);
                  
                  //this.checkGetTokenFromUrl();
                  this.apiResources.setCsrfToken(this.csrfToken);
                 //this._window.sessionStorage.
                  var cookies_value = data.split(',')[0];//this.ionicHTTP.getCookieString('https://tatatest.resustain.io');
                  //var cookie_name=this.cookieService.get('_treeni_session');
                  console.log('Cookie data received: ' + cookies_value);
                  localStorage.setItem('cookie', cookies_value);
                  setTimeout(() =>{
                    const obj = {
                      "user": {
                    
                     }
                    };
                      let headers2;
                      headers2 = { "Content-Type": "application/json" };
                      headers2["X-CSRF-Token"] = this.csrfToken;
                      //headers2["x-csrf-token"] = this.csrfToken;
                     headers2["Cookie"] = cookies_value;
                      headers2["Accept"]= "application/json";
                      setTimeout(() => {
                        const cookieValue = localStorage.getItem('cookie');
                        //this.apiResources.setCsrfToken(this.csrfToken);
                          console.log('apiResources.csrfToken----->', this.apiResources.getCsrfTokenVal());
                          // setTimeout(() => {
                          //   console.log('Cookie Value', cookieValue);
                          // }, 1000);
                          //this.http = new HttpClient(this.handler);
                        //   this.handler.handle(new HttpRequest('POST','https://tatatest.resustain.io/users/sign_in.json',obj,headers2)).subscribe(res => {
                        //     console.log('handler response--->', JSON.stringify(res));
                        // }, error => {
                        //   console.log('Api Error handler: ', JSON.stringify(error));
                        // });
                        //this.openWindow();
                        var cookie = localStorage.getItem('cookie');;
                      
                        const myInit = {
                          method: "POST",
                          headers: {
                            Accept: "application/json",
                            Cookie: cookie,
                            'X-CSRF-Token':this.csrfToken,
                            'Content-type':"application/json",
                            
                    
                          },
                          mode: "cors",
                          cache: "default",
                        };
                        const myHeaders = new Headers();
                        myHeaders.append("Accept", "application/json");
                        myHeaders.append("Content-type", "application/json");
                        myHeaders.append("X-CSRF-Token", this.csrfToken);
                        myHeaders.append("Cookie", cookie);
                    
                        const myInit2 = {
                          method: "GET",
                          headers: myHeaders,
                          
                        };
                    
                    var myRequest = new Request(window.WebviewProxy.convertProxyUrl('https://tatatest.resustain.io/users/sign_in.json'));
                    
                    
                     fetch(myRequest,myInit2).then((response) => {
                      
                      console.log("fetch response",response);
                      console.debug("fetch response",response);
                    });
                        const httpOptions1 = {
                          headers: {
                            'Content-Type': 'application/json',
                            'x-csrf-token': this.csrfToken,
                            'Cookie':  cookies_value //'_treeni_session=' +
                          },
                          observe: 'response' as 'response',
                          withCredentials: true
                        };
                        console.log('Headers----->', headers2);
                        //console.log('error--->', err);
                      //   console.log('http option1--->', JSON.stringify(httpOptions1));
                      //  this.http.post('https://tatatest.resustain.io/users/sign_in.json', obj, httpOptions1).subscribe(res => {
                
                      //     const userData = res.body || {};
                      //     this.apiResources.setCurrentUser(userData);
                      //     console.log('unitss--->', res);
                      //     console.log('unitss--->', this.apiResources.getCurrentUser());
                      //     localStorage.setItem('email', this.apiResources.getCurrentUser().email);
                      //     //localStorage.setItem('password', loginData.password);
                      //     this.offlineDB.addCurrentUser(this.apiResources.getCurrentUser()._id, this.apiResources.getCurrentUser().email, userData).then((currentUser) => {
                      //       console.log("current user stored offline --->", currentUser);
                      //       // OneSignal.setExternalUserId(this.apiResources.getCurrentUser().email);
                      //       // OneSignal.disablePush(false);
                
                      //       localStorage.setItem('username', this.apiResources.getCurrentUser().email);
                      //       localStorage.setItem('samllogin', 'yes');
                      //       this.loadingController.dismiss();
                      //       this.router.navigateByUrl('/dashboard');
                      //     }, error => {
                      //       console.log(JSON.stringify(error));
                      //     });
                      //     // this.router.navigateByUrl('/menu/dashboard-page');
                      //   }, error => {
                      //     console.log('Api Error: ', JSON.stringify(error));
                      //   });
                      //}, 3000);
                     console.log('Headers----->', headers2);
                  // this.ionicHTTP.post('https://tatatest.resustain.io/users/sign_in.json',obj,headers2).then(res => {
                  //    console.log('from url response--->', JSON.stringify(res)); 
                  //       let respData = null;
                  //     if (res instanceof Object) {
                          
                  //         respData = this.IsJsonString(res.data) ? JSON.parse(res.data) : respData.data;
                  //         console.log('from url response- data -->', JSON.stringify(respData)); 
              
                  //           const userData = res.data.body || {};
                  //           this.apiResources.setCurrentUser(userData);
                  //           console.log('unitss--->', res);
                  //           console.log('unitss--->', this.apiResources.getCurrentUser());
                  //           localStorage.setItem('email', this.apiResources.getCurrentUser().email);
                  //           //localStorage.setItem('password', loginData.password);
                  //           this.offlineDB.addCurrentUser(this.apiResources.getCurrentUser()._id, this.apiResources.getCurrentUser().email, userData).then((currentUser) => {
                  //             console.log("current user stored offline --->", currentUser);
                  //             // OneSignal.setExternalUserId(this.apiResources.getCurrentUser().email);
                  //             // OneSignal.disablePush(false);
              
                  //             localStorage.setItem('username', this.apiResources.getCurrentUser().email);
                  //             localStorage.setItem('samllogin', 'yes');
                  //             this.loadingController.dismiss();
                  //             this.router.navigateByUrl('/dashboard');
                  //           }, error => {
                  //             console.log(JSON.stringify(error));
                  //           });
                  //       }
                        
                       
                  //         // this.router.navigateByUrl('/menu/dashboard-page');  
                  //       }, err => {
                  //         console.log("ERROR Token",JSON.stringify(err));
                  //         //this.samlLoginMethod();
                         
                  //       });
                      }, 3000);
                      }, 2000);
                }, 5000);
              }
              
            }
            },       
           
            function(msg) {
              console.log("KO: " + msg);
            });

            // window.handleOpenURL =  function (url) {
            //   console.log('Browser url received: saml' + url);
            //   setTimeout(function() {
            //     window['SafariViewController'].hide();
            //     var data = decodeURIComponent(url.substr(url.indexOf('=')+1));
            //     console.log('Browser data received: ' + data);
               
            //   }, 0);
            // }
      } else {
        // potentially powered by InAppBrowser because that (currently) clobbers window.open
        //window.open(url, '_blank', 'location=yes');
        this.samlLogin();
      }
    })
  }
  async openWindow(){
    let urlSaml='https://login.microsoftonline.com/3d245fbe-97e6-4b5c-b7ce-b7826e2dee7b/saml2?SAMLRequest=jZExT8MwEIV3JP5D5T1xkqZtaiWVIhBSpMLQAgObY19Vi9guvgvi5%2BMGwYKoWDyc3nvn912N0g4n0Y50dDt4GwHp%2Bmo2%2B7CDw4aNwQkv0aBw0gIKUmLf3m9FkWbCAkktSbKzvrttmNFzXZSLQw%2FJegXLpOwXKulXCuJTFUsoNMCqn%2BTPENB417AYxGYd4gidQ5KO4igriiSrkrx6zOaiqMSiTPNqvq6q8mUyt4gQKNpvvMPRQthDeDcKnnbbhh2JTig4p%2FgzimXSADjGZONS4%2FkYnchlLMvPvbmSw9BL9TrlPsSKnQZH5mAg3PlgJf2NIE%2FzaWJ0cpikAqw0Q6t13IjsB6KYAF9GeQqevPID25xt9cQj%2FOcG8hsF21wsXvOvzJhf898X33wC'
    var cookie = localStorage.getItem('cookie');;
    let headers2;
    headers2 = { "Content-Type": "application/json" };
    headers2["X-CSRF-Token"] = this.csrfToken;
    //headers2["x-csrf-token"] = this.csrfToken;
   headers2["Cookie"] = localStorage.getItem('cookie');
    headers2["Accept"]= "application/json";
    const myInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Cookie: cookie,
        'X-CSRF-Token':this.csrfToken,
        'Content-type':"application/json",
        

      },
      mode: "cors",
      cache: "default",
    };
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-type", "application/json");
    myHeaders.append("X-CSRF-Token", this.csrfToken);
    myHeaders.append("Cookie", cookie);

    const myInit2 = {
      method: "GET",
      headers: myHeaders,
      
    };

var myRequest = new Request(window.WebviewProxy.convertProxyUrl('https://tatatest.resustain.io/users/sign_in.json'));


await fetch(myRequest,myInit2).then((response) => {
  
  console.log("fetch response",response);
  console.debug("fetch response",response);
});
    // const response = await fetch(window.WebviewProxy.convertProxyUrl('https://tatatest.resustain.io/users/sign_in.json'),myInit));
    // console.debug("fetch response",response);
//     this.systemBrowser = window.show(urlSaml, '_blank', 'location=no,toolbar=yes');

   
//     // listen to page load events
//     this.systemBrowser.addEventListener('loadstart', function (event) {
//       var url = event.url,
//         params = {},
//         // get uri
//         parts = url.split('?'),
//         uri,
//         urlParams,
//         loading;
//         console.log('Url window: ', url);
//         if(url==='https://tatatest.resustain.io/#/'){
//           setTimeout(() => {
//           // if there is an uri
//             if (parts[1]) {
//               uri = parts[1];
//               // get uri params
//               urlParams = uri.split('&');

//               // get uri params and store them with key, value
//               angular.forEach(urlParams, function (paramString) {
//                 var param = paramString.split('=');
//                 params[param[0]] = param[1];
//               });
//             }

//             // if there is an email param or an error -> close the window
//             // if (params.email || params.error) {
//             //   this.systemBrowser.close();
//             // }

//           }, 5000);

//         }
      
// });
    
  }
  openCookieUrl(){
    window['SafariViewController'].show({
      url: 'https://tatatest.resustain.io/#/hidden',
      hidden: true,
      animated: false
    });
    (window as any).handleOpenURL= function(url) {
      console.log('Browser url received: ' + url);
      setTimeout(function() {
        
        var data = decodeURIComponent(url.substr(url.indexOf('=')+1));
        console.log('Browser data received: ' + data);
        //cookie
        //token
        window['SafariViewController'].hide();
      }, 1000);
    }
  }

  handleOpenUrlHiddenPage(){

    window['SafariViewController'].show({
      url: 'https://tatatest.resustain.io/#/hidden_token',//
      hidden: true,
      animated: false
    });
    // (window as any).handleOpenURL = (url: string) => {
    //   setTimeout(() => {
    //     this.handleOpenUrl(url);
    //   }, 0);
    // };
   
    window.handleOpenURL = (url)=> {
      console.log('Browser url received: hidden' + url);
      setTimeout(() =>{
      
        
      
        window['SafariViewController'].hide();
        var data = decodeURIComponent(url.substr(url.indexOf('=')+1));
        console.log('Browser data received: ' + data);
        console.log('Browser data received: token' + data.split(',')[1]);
        this.csrfToken = data.split(',')[1];
        localStorage.setItem('token', this.csrfToken);
        
        //this.checkGetTokenFromUrl();
        this.apiResources.setCsrfToken(this.csrfToken);
       //this._window.sessionStorage.
        var cookies_value = data.split(',')[0];//this.ionicHTTP.getCookieString('https://tatatest.resustain.io');
        //var cookie_name=this.cookieService.get('_treeni_session');
        console.log('Cookie data received: ' + cookies_value);
        localStorage.setItem('cookie', cookies_value);
        setTimeout(() =>{
          const obj = {
            "user": {
          
           }
          };
            let headers2;
            headers2 = { "Content-Type": "application/json" };
            headers2["X-CSRF-Token"] = this.csrfToken;
            //headers2["x-csrf-token"] = this.csrfToken;
           headers2["Cookie"] = cookies_value;
            headers2["Accept"]= "application/json";
            setTimeout(() => {
              const cookieValue = localStorage.getItem('cookie');
              //this.apiResources.setCsrfToken(this.csrfToken);
                console.log('apiResources.csrfToken----->', this.apiResources.getCsrfTokenVal());
                // setTimeout(() => {
                //   console.log('Cookie Value', cookieValue);
                // }, 1000);
                //this.http = new HttpClient(this.handler);
              //   this.handler.handle(new HttpRequest('POST','https://tatatest.resustain.io/users/sign_in.json',obj,headers2)).subscribe(res => {
              //     console.log('handler response--->', JSON.stringify(res));
              // }, error => {
              //   console.log('Api Error handler: ', JSON.stringify(error));
              // });
              const httpOptions1 = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-csrf-token': this.csrfToken,
                  'Cookie':  cookies_value //'_treeni_session=' +
                },
                observe: 'response' as 'response',
                withCredentials: true
              };
              console.log('Headers----->', headers2);
              //console.log('error--->', err);
              console.log('http option1--->', JSON.stringify(httpOptions1));
             this.http.post('https://tatatest.resustain.io/users/sign_in.json', obj, httpOptions1).subscribe(res => {
      
                const userData = res.body || {};
                this.apiResources.setCurrentUser(userData);
                console.log('unitss--->', res);
                console.log('unitss--->', this.apiResources.getCurrentUser());
                localStorage.setItem('email', this.apiResources.getCurrentUser().email);
                //localStorage.setItem('password', loginData.password);
                this.offlineDB.addCurrentUser(this.apiResources.getCurrentUser()._id, this.apiResources.getCurrentUser().email, userData).then((currentUser) => {
                  console.log("current user stored offline --->", currentUser);
                  // OneSignal.setExternalUserId(this.apiResources.getCurrentUser().email);
                  // OneSignal.disablePush(false);
      
                  localStorage.setItem('username', this.apiResources.getCurrentUser().email);
                  localStorage.setItem('samllogin', 'yes');
                  this.loadingController.dismiss();
                  this.router.navigateByUrl('/dashboard');
                }, error => {
                  console.log(JSON.stringify(error));
                });
                // this.router.navigateByUrl('/menu/dashboard-page');
              }, error => {
                console.log('Api Error: ', JSON.stringify(error));
              });
            //}, 3000);
          //  console.log('Headers----->', headers2);
        // this.ionicHTTP.post('https://tatatest.resustain.io/users/sign_in.json',obj,headers2).then(res => {
        //    console.log('from url response--->', JSON.stringify(res)); 
        //       let respData = null;
        //     if (res instanceof Object) {
                
        //         respData = this.IsJsonString(res.data) ? JSON.parse(res.data) : respData.data;
        //         console.log('from url response- data -->', JSON.stringify(respData)); 
    
        //           const userData = res.data.body || {};
        //           this.apiResources.setCurrentUser(userData);
        //           console.log('unitss--->', res);
        //           console.log('unitss--->', this.apiResources.getCurrentUser());
        //           localStorage.setItem('email', this.apiResources.getCurrentUser().email);
        //           //localStorage.setItem('password', loginData.password);
        //           this.offlineDB.addCurrentUser(this.apiResources.getCurrentUser()._id, this.apiResources.getCurrentUser().email, userData).then((currentUser) => {
        //             console.log("current user stored offline --->", currentUser);
        //             // OneSignal.setExternalUserId(this.apiResources.getCurrentUser().email);
        //             // OneSignal.disablePush(false);
    
        //             localStorage.setItem('username', this.apiResources.getCurrentUser().email);
        //             localStorage.setItem('samllogin', 'yes');
        //             this.loadingController.dismiss();
        //             this.router.navigateByUrl('/dashboard');
        //           }, error => {
        //             console.log(JSON.stringify(error));
        //           });
        //       }
              
             
        //         // this.router.navigateByUrl('/menu/dashboard-page');  
        //       }, err => {
        //         console.log("ERROR Token",JSON.stringify(err));
        //         //this.samlLoginMethod();
               
        //       });
            }, 3000);
            }, 2000);
      }, 5000);
    }
  }
   dismissSafari() {
    window['SafariViewController'].hide()
  }
  /**
    * Saml login method for calling microsoft login UI to authunticate user and navigate to dashboard.
    * Used in app browser plugin to load MS login UI and used browser events for getting response
    * @private
    * @method samlLogin
    * @return {none}
    */
  samlLogin() {
    if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Online) {

      // this.offlineDB.clearDb();
      // const browser = this.iab.create('https://login.microsoftonline.com/7cc553fc-7b82-4da7-a869-b6e7db5ce612/saml2?SAMLRequest=fZGxbsMgFEV%2FxRsTxiYOdlAcKWqWSOmStB26RIBxg2qDy4Mqn1%2Bcqmq7ZEQ697zLe2sQ4zDxbQwXe9QfUUPItgDaB%2BPsg7MQR%2B1P2n8apZ%2BPhxZdQpiAExKv5%2BkiQFe51xAhCGNz40hMUSAi6chsJkoMgxTqHWW7pDZWzN5fy%2BDeUm40yjtwfXB2MFbnyo2kVmq5XPQK17KhuOpEjUXDVlgyXXdyqTQr6W0ERdl%2B16JzXbKVYLTDXS9ZCpQCC1Y0eCFZ11eypxVdJRQg6r1NfW1oES1ogRNT1E8F5UXJafOKspf0hVtLmhcou46DBT5PalH0ljsBBrgVowYeFD9tHw88gVz8bO1vZLqfmbwLTrkBbdYzzW%2Ft%2FOb%2BjtfkL%2Fv9%2Bn%2FBzRc%3D', '_blank', 'location=no');
      //const browser = this.iab.create('https://login.microsoftonline.com/258ac4e4-146a-411e-9dc8-79a9e12fd6da/saml2?SAMLRequest=fZJPT9wwEMW%2FSm4%2BOY692T%2BxNitFrCqtBKiCtgcuaHAmYNWxtx6nwLevE1SVHuA6eu%2F3nme8JxjdWXdTevI3%2BGtCSkVHhDHZ4C%2BCp2nEeIvxtzX4%2FeayZU8pnUkL8WzPMZQRaaIE1pc2iCnbSEBGiZkqDDj3AOYnK44Zaz3MzH8EFx6zb7QmBgpDCt5Zj6UJo1DrHZgaay7rDfBaSuRNb3Z820CDUg39poclQrHidGzZfa%2BqAeSq4bgaVrxePzR8N0jF19vddo2mrys1S4kmPPnc16eWqTzjVc3V5pusdbXRlbxjxY%2F8hKWlKitWvIzOk56TWjZFrwOQJe1hRNLJ6Nvu6lJnoYa%2FG3tvOX%2FuyetLwQTHDvtZrZd28fDxfvfivW7%2FdrjrzD0dvwZnzWvROReeLyJCwpalOCErvoQ4Qvq4iSzlMrE9HxapxhGs6%2Fo%2BRxMTh7fU%2F3%2FI4Q8%3D', '_blank', 'location=no,closebuttoncaption=Close');
      //const browser = this.iab.create('https://login.microsoftonline.com/3d245fbe-97e6-4b5c-b7ce-b7826e2dee7b/saml2?SAMLRequest=jZExT8MwEIV3JP5D5T1xkiatayWVIhBSpMLQAgMLcuKLapHYwWej%2FnzcIFgQFcsNp%2Ffe6X1XohiHidfeHfUe3j2gu75aLE7joLEi3mpuBCrkWoyA3HX8UN%2FveBYnfAQnpHCCnPXNbUWUXMosL%2FoWos0aVlHeFl3UrjsIg2UryCTAup3lz2BRGV2REEQWDaKHRqMT2oVVkmVRwqKUPSZLnjFe5HHKlhvG8pfZXCOCdcF%2BYzT6EewB7Ifq4Gm%2Fq8jRuQk5pf70Oh0FQhFbQB%2BilY6VoT5YkYrQlp6L004MQyu6tzn4IXRsJGinegX2zthRuL8ZpHE6b5SM%2BlnKYRRqqKUMF5H8UOQz4cssJ2uc6cxAtmdbOQOx%2F3mC%2BGZBtpebl%2FQrNBwo6e%2Bfbz8B','_blank','location=no');
      var browser = this.iab.create('https://login.microsoftonline.com/3d245fbe-97e6-4b5c-b7ce-b7826e2dee7b/saml2?SAMLRequest=jZExT8MwEIV3JP5D5T1xkqZtaiWVIhBSpMLQAgObY19Vi9guvgvi5%2BMGwYKoWDyc3nvn912N0g4n0Y50dDt4GwHp%2Bmo2%2B7CDw4aNwQkv0aBw0gIKUmLf3m9FkWbCAkktSbKzvrttmNFzXZSLQw%2FJegXLpOwXKulXCuJTFUsoNMCqn%2BTPENB417AYxGYd4gidQ5KO4igriiSrkrx6zOaiqMSiTPNqvq6q8mUyt4gQKNpvvMPRQthDeDcKnnbbhh2JTig4p%2FgzimXSADjGZONS4%2FkYnchlLMvPvbmSw9BL9TrlPsSKnQZH5mAg3PlgJf2NIE%2FzaWJ0cpikAqw0Q6t13IjsB6KYAF9GeQqevPID25xt9cQj%2FOcG8hsF21wsXvOvzJhf898X33wC', '_blank', 'location=no,clearcache=no,clearsessioncache=no,usewkwebview=no');//usewkwebview=yes,
      browser.on('exit').subscribe((event: any) => {
        setTimeout(() => {
          //self2.samlLoginMethod();
          console.log('apiResources.csrfToken----->', localStorage.getItem('cookie'));
          // var cookie_str = this.ionicHTTP.getCookieString('https://tatatest.resustain.io');
          // console.log('cookie ionic http----->', cookie_str);
          // localStorage.setItem('cookie',  cookie_str);

          this.samlLoginMethod();
          //this.checkGetTokenFromUrl();
          //this.handleOpenUrlHiddenPage();
        }, 5000);
        
      });

      browser.on('loadstop').subscribe((event: any) => {
        const cookie = '';
        //console.log('event saml: ' + event);
        if(event.cookies && event.cookies['_treeni_session']){

         
          console.log('Data.cookieValue load stop', event.cookies['_treeni_session']);
          localStorage.setItem('cookie',  event.cookies['_treeni_session']);
          
        }
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
            console.log('success meta tag response --- >', value[0]);
            self.csrfToken = value[0];
            localStorage.setItem('token',value[0]);
            window.cookieMaster.getCookieValue('https://tatatest.resustain.io', '_treeni_session', function (data: any) {
              console.log('Data.cookieValue', data.cookieValue);
              localStorage.setItem('cookie', data.cookieValue);
              browser.close();
            }, function (error) {
              if (error) {
                console.log('Set cookie error: ' + error);
              }
              browser.close();
            });

          }, err => {
            if (err) {
              //console.log('error: ' + err);
              if (window.confirm('Something went wrong! Please try again.')) {

                browser.close();

              }


            }
          });
        }

        if (event && event.url === 'https://tatatest.resustain.io/users/sign_in#/') {
          setTimeout(() => {
          browser.close();
        }, 3000);
        }
      });
      browser.on('loadstart').subscribe((event: any) => {
        console.log("Load start event ---->",event.url);
        console.log("Load start event ---->",event.cookies);
        
       
        var cookie_name=this.cookieService.get('_treeni_session');
         
          console.log('cookie service----->', cookie_name);
        
        if (event && event.url === 'https://tatatest.resustain.io/#/') {
        if(event.cookies && event.cookies['_treeni_session']){

         
            console.log('Data.cookieValue load start', event.cookies['_treeni_session']);
            localStorage.setItem('cookie',  event.cookies['_treeni_session']);

          }

        }
        
      });

    } else {

      let toast = this.toastController.create({
        message: `You are offline`,
        duration: 3000,
        position: 'bottom'
      });
      toast.then(toast => toast.present());
    }

  }

  ionViewWillEnter() {
    console.log('Inside view will Enter');
    
  }
  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  setCookie(cookie){
    this.cookieService.set('_treeni_session',cookie);
  }
   
  deleteCookie(){
    this.cookieService.delete('_treeni_session');
  }
   
  deleteAll(){
    this.cookieService.deleteAll();
  }
   checkGetTokenFromUrl(){
    // var cookie_name=this.cookieService.get('_treeni_session');
    // var all_cookies=this.cookieService.getAll();  // get all cookies
    // console.log('cookie service----->', cookie_name);
    // console.log('cookie service----->', JSON.stringify(all_cookies));
    
    const cookieValue = localStorage.getItem('cookie');
    this.apiResources.setCsrfToken(this.csrfToken);
    console.log('apiResources.csrfToken----->', this.apiResources.getCsrfTokenVal());
    // var cookie_str = this.ionicHTTP.getCookieString('https://tatatest.resustain.io');
    // console.log('cookie ionic http----->', cookie_str);
    setTimeout(() => {
     // this.setCookie(cookieValue);
    //   var cookie_name=this.cookieService.get('_treeni_session');
    // var all_cookies=this.cookieService.getAll();  // get all cookies
    // console.log('cookie service----->', cookie_name);
      console.log('Cookie Value', cookieValue);
      const obj = {
        "user": {
      
      }
      };
      let headers2;
      //this.ionicHTTP.clearCookies();
      //this.ionicHTTP.setCookie('https://tatatest.resustain.io','_treeni_session='+cookieValue)
      headers2 = { "Content-Type": "application/json" };
      // headers2["Access-Control-Allow-Origin"]="*";
      // headers2["Origin"]="https://tatatest.resustain.io/";
      
      headers2["x-csrf-token"] = this.csrfToken;
      //headers2["x-csrf-token"] = this.csrfToken;
      headers2["Cookie"] = '_treeni_session='+cookieValue;
      headers2["Accept"]= "application/json";
      // headers2["Sec-Fetch-Dest"]= "empty";
      // headers2["Sec-Fetch-Mode"]= "cors";
      // headers2["Sec-Fetch-Site"]= "cross-site";
//       Sec-Fetch-Dest:  
// empty 
// Sec-Fetch-Mode:  
// cors 
// Sec-Fetch-Site:  
// cross-site 
      //var cookie_str = this.ionicHTTP.getCookieString('https://tatatest.resustain.io');
      //console.log('cookie ionic http 2----->', cookie_str);
      const ApiUrl = 'https://tatatest.resustain.io/api/set_custom_cookie.json';
      const obj1 = {
        custom_cookie: cookieValue
      };
      return this.ionicHTTP.post(ApiUrl, obj1, headers2).then(res => {
        console.log(' response---->', JSON.stringify(res));
        return this.ionicHTTP.get('https://tatatest.resustain.io/units.json', {},headers2).then(res => {
          console.log('unitss--->', JSON.stringify(res));
        });
      }, err => {
        console.log('headers--->', JSON.stringify(headers2));
        this.ionicHTTP.post('https://tatatest.resustain.io/users/sign_in.json',obj,headers2).then(res => {
          console.log('from url response--->', JSON.stringify(res));
             let respData = null;
           if (res instanceof Object) {
               
               respData = this.IsJsonString(res.data) ? JSON.parse(res.data) : respData.data;
               console.log('from url response- data -->', JSON.stringify(respData));
     
                 const userData = res.data.body || {};
                 this.apiResources.setCurrentUser(userData);
                 console.log('unitss--->', res);
                 console.log('unitss--->', this.apiResources.getCurrentUser());
                 localStorage.setItem('email', this.apiResources.getCurrentUser().email);
                 //localStorage.setItem('password', loginData.password);
                 this.offlineDB.addCurrentUser(this.apiResources.getCurrentUser()._id, this.apiResources.getCurrentUser().email, userData).then((currentUser) => {
                   console.log("current user stored offline --->", currentUser);
                   // OneSignal.setExternalUserId(this.apiResources.getCurrentUser().email);
                   // OneSignal.disablePush(false);
     
                   localStorage.setItem('username', this.apiResources.getCurrentUser().email);
                   localStorage.setItem('samllogin', 'yes');
                   this.loadingController.dismiss();
                   this.router.navigateByUrl('/dashboard');
                 }, error => {
                   console.log(JSON.stringify(error));
                 });
             }
             
            
               // this.router.navigateByUrl('/menu/dashboard-page');  
             }, err => {
               console.log("Sign_in error",JSON.stringify(err));
               //   this.ionicHTTP.get('https://tatatest.resustain.io/users/sign_in','',headers2).then(res => {
               //   console.log('from get url response--->', JSON.stringify(res)); 
               // }, err => {
               //   console.log(JSON.stringify(err));
               // });
              
             });

      });
 
    }, 2000);
       
  }

  /**
     * Saml login method for getting user data after authenticating.
     * 
     * @private
     * @method samlLoginMethod
     * @return {none}
     */
  samlLoginMethod() {

    // var cookie_name=this.cookieService.get('_treeni_session');
    // var all_cookies=this.cookieService.getAll();  // get all cookies
    // console.log('cookie service----->', cookie_name);
    // console.log('cookie service----->', JSON.stringify(all_cookies)); 

    const cookieValue = localStorage.getItem('cookie');
    this.apiResources.setCsrfToken(this.csrfToken);
    console.log('apiResources.csrfToken----->', this.apiResources.getCsrfTokenVal());

    //var cookie_str = this.ionicHTTP.getCookieString('https://tatatest.resustain.io');
    //console.log('cookie ionic http----->', cookie_str);
    setTimeout(() => {
      //this.setCookie(cookieValue);
    //   var cookie_name=this.cookieService.get('_treeni_session');
    // var all_cookies=this.cookieService.getAll();  // get all cookies
    // console.log('cookie service----->', cookie_name);
    // console.log('cookie service----->', JSON.stringify(all_cookies)); 
      console.log('Cookie Value', cookieValue);

      this.http = new HttpClient(this.handler);//comment for calling through interceptor. un comment for calling without interceptor

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }).set('x-csrf-token', this.csrfToken),
        observe: 'response' as 'response',
        withCredentials: true
      };
      // const httpOptions = {
      //   headers: new HttpHeaders({
      //     'Content-Type': 'application/json',
      //     'x-csrf-token': this.csrfToken
      //   }),
      //   observe: 'response' as 'response',
      //   withCredentials: true
      // };
      // const httpOptions = {
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-CSRF-Token': this.csrfToken,
      //     'Cookie': '_treeni_session=' + cookieValue
      //   },
      //   observe: 'response' as 'response',
      //   withCredentials: true
      // };
      const ApiUrl = 'https://tatatest.resustain.io/api/set_custom_cookie.json';
      const obj = {
        custom_cookie: cookieValue
      };
      this.loadingController.presentLoading();
      console.log('http option--->', JSON.stringify(httpOptions));
      return this.http.post(ApiUrl, obj, httpOptions).subscribe(res => {
        console.log(' response---->', JSON.stringify(res));
        return this.http.get('https://tatatest.resustain.io/units.json', httpOptions).subscribe(res => {
          console.log('unitss--->', res);
        });
      }, err => {
        const obj = {
          "user": {
          },
        };
        setTimeout(() => {
          const httpOptions1 = {
            headers: {
              'Content-Type': 'application/json',
              'x-csrf-token': this.csrfToken,
              // 'Cookie': '_treeni_session=' + cookieValue,
              // 'Accept': 'application/json'
            },
            observe: 'response' as 'response',
            withCredentials: true
          };
         
          //console.log('error--->', err);
          console.log('http option1--->', JSON.stringify(httpOptions));
          this.http.post('https://tatatest.resustain.io/users/sign_in.json', obj, httpOptions).subscribe(res => {
  
            const userData = res.body || {};
            this.apiResources.setCurrentUser(userData);
            console.log('unitss--->', res);
            console.log('unitss--->', this.apiResources.getCurrentUser());
            localStorage.setItem('email', this.apiResources.getCurrentUser().email);
            //localStorage.setItem('password', loginData.password);
            this.offlineDB.addCurrentUser(this.apiResources.getCurrentUser()._id, this.apiResources.getCurrentUser().email, userData).then((currentUser) => {
              console.log("current user stored offline --->", currentUser);
              // OneSignal.setExternalUserId(this.apiResources.getCurrentUser().email);
              // OneSignal.disablePush(false);
  
              localStorage.setItem('username', this.apiResources.getCurrentUser().email);
              localStorage.setItem('samllogin', 'yes');
              this.loadingController.dismiss();
              this.router.navigateByUrl('/dashboard');
            }, error => {
              console.log(JSON.stringify(error));
            });
            // this.router.navigateByUrl('/menu/dashboard-page');
          }, error => {
            console.log('Api Error: ', JSON.stringify(error));
          //   let headers2;
          //   headers2 = { "Content-Type": "application/json" };
          //   headers2["X-CSRF-Token"] = this.csrfToken;
          //   //headers2["x-csrf-token"] = this.csrfToken;
          //  headers2["Cookie"] = cookieValue;
          //   headers2["Accept"]= "application/json"
          //   this.handler.handle(new HttpRequest('POST','https://tatatest.resustain.io/users/sign_in.json',obj,headers2)).subscribe(res => {
          //     console.log('handler response--->', JSON.stringify(res));
          // }, error => {
          //   console.log('Api Error handler: ', JSON.stringify(error));
          // });
          //   this.apiResources.getCsrf().subscribe((response) => {
          //     console.log("login get csrf --->", JSON.stringify(response));
          //     //this.samlLoginMethod();
             
          //     if (response) {
                
          //     }
             
          //   }
          //   , (err) => {
          //     this.loadingController.dismiss();
          //     console.error('ErrorDetails---->', err);
          //     let toast = this.toastController.create({
          //       message: `error please try again`,
          //       duration: 1000,
          //       position: 'bottom'
          //     });
          //     toast.then(toast => toast.present());
           // });
          });
        }, 3000);
  
     });
    }, 1000);
   
  }




  initializeApp() {
    // other code


  }
}
