import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AppConstants } from "../../common/utility/constants";
import { Observable, of, observable } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root',
})
export class ApiResourcesService {
  logId: any;
  apiUrl = AppConstants.General.BASE_URL + '/users/sign_in';
  currentUser: any={};
  csrfToken:any=null;
  constructor(private httpClient: HttpClient) {}

  getCsrf(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      observe: "response" as "response",
    };
    // var requestDetails = {
    //   url: this.apiUrl,
    //   method: 'GET'
    // };
    //return PromiseFactory.generateHttpPromise(requestDetails);
    return this.httpClient.get(this.apiUrl, httpOptions).pipe(
      tap((_) => this.log("getcsrf")),
      catchError(this.handleError("getCsrf()", []))
    );
    /*.pipe(
      map((res) => {
        this.log('Response received');
        //console.log(res);
        // return of(res as T)
        return of(res);
        //return res;
      }),
      catchError(this.handleError("getCsrf()", []))
    );*/
  }

  private handleError<T>(operation = "operation", result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  setCurrentUser(user){
    this.currentUser =  user;
  }

  getCurrentUser(){
    return this.currentUser;
  }

  setCsrfToken(token){
    this.csrfToken = token;
  }

  setLogId(id){
    this.logId = id;
  }
  getCsrfTokenVal(){
    return this.csrfToken;
  }

  getLogId(){
    return this.logId;
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    //console.log(message);
  }
}
