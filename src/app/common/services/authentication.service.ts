import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { AngularTokenService } from "projects/angular-token/src/public_api";
import { AppConstants } from '../utility/constants';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  loginApiUrl: any = AppConstants.General.BASE_URL + '/users/sign_in.json';
  logoutUrl: any = AppConstants.General.BASE_URL + '/users/sign_out.json';
  constructor(
    private httpClient: HttpClient
     // private angularTokenService: AngularTokenService
  )
  {}

  login(data): Observable<any> {
    let self = this;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
    };
    const obj = {
      user: {
        email: data.email,
        password: data.password,
      },
    };
    return Observable.create(observer => {
      return self.httpClient.post<any>(self.loginApiUrl, obj, httpOptions).subscribe(
        (success)=>{
          observer.next(success);
        },(error)=>{
          observer.error(error);
        }
      );
    });
    /*return new Observable((observer) => {
      //console.log(data);
      const obj= {
        'user': {
          "email":"admin@treeni.com",
          "password":"Treeni@123"
        }
      }
      this.angularTokenService
       .signIn({
        'user': {
          "email":"admin@treeni.com",
          "password":"Treeni@123"
        }
       })
       .subscribe(
         (res) => {
           //console.log(res);
           observer.next(res);
           observer.complete();
         },
         (err) => {
           //console.log(err);
           observer.error(err);
         }
       );
      // observable execution
      //observer.next("bla bla bla")
      //observer.complete()
    });*/

    // return data;
  }
  loginSession(data): Observable<any> {
    let self = this;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
    };
    const obj = {
      user: {
        email: data.email,
        password: data.password,
      },
    };
    return Observable.create(observer => {
      return self.httpClient.post<any>(self.loginApiUrl, obj, httpOptions).subscribe(
        (success)=>{
          observer.next(success);
        },(error)=>{
          observer.error(error);
        }
      );
    });
  }

  logout(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
    };
    // return this.httpClient.delete<any>(this.logoutUrl,httpOptions)
    //   .pipe(
    //     tap(_ => this.log('logout')),
    //     catchError(this.handleError('logout', []))
    //   );
      return Observable.create(observer => {
        this.httpClient.delete(this.logoutUrl,httpOptions).subscribe(
          (success: any) => {
            observer.next(success);
          }, error => {
            //console.log('logout error=>', error);
            observer.error(error);
          }
        );
      });
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //console.log(message);
  }
}
