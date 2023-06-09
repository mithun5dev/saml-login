import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { map, catchError } from "rxjs/operators";
import { Platform } from "@ionic/angular";
import { HTTP, HTTPResponse } from "@ionic-native/http/ngx";

import { AppConstants } from 'src/app/common/utility/constants';

import { Router } from '@angular/router';
@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  globalCsrfToken: any = null;
  constructor(private platform: Platform, private ionicHTTP: HTTP,private router: Router) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.globalCsrfToken) {
      request = request.clone({
        setHeaders: { "X-CSRF-TOKEN": this.globalCsrfToken },
      });
    }

    if (!request.headers.has("Content-Type")) {
      request = request.clone({
        setHeaders: {
          "content-type": "application/json",
        },
      });
    }
    if (request.url === AppConstants.General.BASE_URL + '/temp_attachments') {
       
      request = request.clone({
        setHeaders: {
          "content-type": "multipart/form-data",
          //"Referer": AppConstants.General.BASE_URL +'/indicator_data'
        },
      });
    }

    request = request.clone({
      setHeaders: { Accept: "application/json" },
    });

    /**For resolving cors issue when testing on emulator  */
    if (this.platform.is("cordova")) {
      this.ionicHTTP.setDataSerializer("json");
      return new Observable((observer) => {
        let self = this;
        let headers2;
        if(request.headers.get('content-type') === "multipart/form-data"){
          headers2  = { "Content-Type": "multipart/form-data",
         // "Referer": AppConstants.General.BASE_URL +'/indicator_data' 
        };
        }else{
          headers2 = { "Content-Type": "application/json" };
        }
        console.log('http globalCsrfToken--->', this.globalCsrfToken);
        if (this.globalCsrfToken) {
          headers2["X-CSRF-TOKEN"] = this.globalCsrfToken;
        }else{
          let csrfToken = localStorage.getItem('token');
          if(csrfToken){
            headers2["X-CSRF-TOKEN"] = csrfToken;
          }
         
        }
        self.ionicHTTP
          .setServerTrustMode("nocheck")
          .then((success) => {
            /**GET Request Call */
            if (request.method == "GET") {
              console.log('http get data request--->', request);
              console.log('http get data request--->', headers2);
              self.ionicHTTP
                .get(request.urlWithParams, {}, headers2)
                .then((response: HTTPResponse) => {
                  if (response instanceof Object) {
                    let respData = null;
                    if (
                      response.headers["XSRF-TOKEN"] ||
                      response.headers["xsrf-token"]
                    ) {
                      //globalCsrfToken = event.headers('XSRF-TOKEN');
                      self.globalCsrfToken =
                        response.headers["XSRF-TOKEN"] ||
                        response.headers["xsrf-token"] ||
                        null;
                        localStorage.setItem('token', self.globalCsrfToken);
                    }
                    //respData = response.data;
                    if(response.status==401 || response.status==498){
                      //self.router.navigateByUrl('/login');
                      
                    }
                   
                    respData = this.IsJsonString(response.data) ? JSON.parse(response.data) : respData.data
                    observer.next(
                      new HttpResponse({
                        status: response.status,
                        body: respData,
                        headers: <HttpHeaders>(<any>response.headers),
                      })
                    );
                  }
                })
                .catch((error) => {
                  //console.log("error", error);
                  if(error.status==401 || error.status==498){
                    //this.auditService.logout();
                    //self.router.navigateByUrl('/login');
                  }
                  
                  let respData = this.IsJsonString(error.data) ? JSON.parse(error.data) : error.data
                  observer.error({
                    status: error.status,
                    body: respData,
                    headers: <HttpHeaders>(<any>error.headers)
                  }
                  );
                });
            } else if (request.method == "POST") {
              /***POST Call */
              if (request.url === AppConstants.General.BASE_URL + '/temp_attachments') {
                //let body = request.body;
                self.ionicHTTP.setDataSerializer('multipart');
                console.log('http post data request--->', request);
              console.log('http post data request--->', headers2);
                self.ionicHTTP.post(request.url, request.body, headers2).then(
                  (res) => {
                    if (res instanceof Object) {
                      if (
                        res.headers["XSRF-TOKEN"] ||
                        res.headers["xsrf-token"]
                      ) {
                        //globalCsrfToken = event.headers('XSRF-TOKEN');
                        self.globalCsrfToken =
                          res.headers["XSRF-TOKEN"] ||
                          res.headers["xsrf-token"] ||
                          null;
                          localStorage.setItem('token', self.globalCsrfToken);
                      }
                      if(res.status==401 || res.status==498){
                        //this.auditService.logout();
                        //self.router.navigateByUrl('/login');
                      }
                      let respData = JSON.parse(res.data);
                      observer.next(
                        new HttpResponse({
                          status: res.status,
                          body: respData,
                          headers: <HttpHeaders>(<any>res.headers),
                        })
                      );
                    }
                  },
                  (error) => {
                    //console.log("error", error);
                    if(error.status==401 || error.status==498){
                      //this.auditService.logout();
                      //self.router.navigateByUrl('/login');
                    }
                    let respData;
                    if(error.error){
                       respData = JSON.parse(error.error.toString());
                    }
                   
                    observer.error({
                      status: error.status,
                      body: respData,
                      headers: <HttpHeaders>(<any>error.headers)
                    }
                    );
                   // observer.error(error);
                  }
                );
              }else{
              self.ionicHTTP.setDataSerializer('json');
              console.log('http post data request--->', request);
              console.log('http post data request--->', headers2);
              self.ionicHTTP.post(request.url, request.body, headers2).then(
                (res) => {
                  if (res instanceof Object) {
                    if (
                      res.headers["XSRF-TOKEN"] ||
                      res.headers["xsrf-token"]
                    ) {
                      //globalCsrfToken = event.headers('XSRF-TOKEN');
                      self.globalCsrfToken =
                        res.headers["XSRF-TOKEN"] ||
                        res.headers["xsrf-token"] ||
                        null;
                        localStorage.setItem('token', self.globalCsrfToken);
                    }
                    if(res.status==401 || res.status==498){
                      //this.auditService.logout();
                      //self.router.navigateByUrl('/login');
                    }
                    //console.log("error json", res.data);
                    let respData = JSON.parse(res.data);
                    observer.next(
                      new HttpResponse({
                        status: res.status,
                        body: respData,
                        headers: <HttpHeaders>(<any>res.headers),
                      })
                    );
                  }
                },
                (error) => {
                  //console.log("error", error);
                  if(error.status==401 || error.status==498){
                    //this.auditService.logout();
                   // self.router.navigateByUrl('/login');
                  }
                  let respData={error:"Server error. Please try again"};
                  if(error.error){
                    try{
                      respData = JSON.parse(error.error.toString());
                    }catch(e){

                    }
                   
                  }
                 
                  observer.error({
                    status: error.status,
                    body: respData,
                    headers: <HttpHeaders>(<any>error.headers)
                  }
                  );
                 // observer.error(error);
                }
              );
              }
            } else if (request.method == "PUT") {
              // Put Method
              console.log('http get data request--->', request);
              console.log('http get data request--->', headers2);
              self.ionicHTTP.put(request.url, request.body, headers2).then((res) => {
                var respData = null;
                if (respData != null) {
                  this.IsJsonString(res.data) ? respData = JSON.parse(res.data) : respData = res.data
                }
                if(res.status==401 || res.status==498){
                  //this.auditService.logout();
                  //self.router.navigateByUrl('/login');
                }
                observer.next(new HttpResponse(
                  {
                    status: res.status,
                    body: respData,
                    headers: <HttpHeaders>(<any>res.headers)
                  })
                );
              },
                (error) => {
                  if(error.status==401 || error.status==498){
                    //this.auditService.logout();
                    //self.router.navigateByUrl('/login');
                  }
                  //console.log('error', error)
                  observer.error(error)
                });
            }
            else if (request.method == "DELETE") {
              console.log('http get data request--->', request);
              console.log('http get data request--->', headers2);
              self.ionicHTTP.delete(request.url, request.body, headers2).then((res) => {
                var respData = null;
                if (respData != null)
                  this.IsJsonString(res.data) ? respData = JSON.parse(res.data) : respData = res.data
                  if(res.status==401 || res.status==498){
                    //this.auditService.logout();
                    //self.router.navigateByUrl('/login');
                  }
                observer.next(new HttpResponse(
                  {
                    status: res.status,
                    body: respData,
                    headers: <HttpHeaders>(<any>res.headers)
                  })
                );
              },
                (error) => {
                  //console.log('error', error)
                  if(error.status==401 || error.status==498){
                    //this.auditService.logout();
                    self.router.navigateByUrl('/login');
                  }
                  observer.error(error)
                })
            }
          })
          .catch((err) => {
            //console.log("Set ServerTrustMode error------>", err);
          });
      });
    } else {
      return next.handle(request).pipe(
        map((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            //console.log("event--------------->", event);
            if (event.headers.get("XSRF-TOKEN")) {
              //globalCsrfToken = event.headers('XSRF-TOKEN');
              this.globalCsrfToken = event.headers.get("XSRF-TOKEN");
              localStorage.setItem('token', this.globalCsrfToken);
            }
          }
          return event;
        }),
        catchError((error: HttpErrorResponse) => {
          //console.log(error);
          return throwError(error);
        })
      );
    }
  }
  IsJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
