import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpBackend} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { AppConstants } from '../utility/constants';
import { tap, catchError } from 'rxjs/operators';
import { ApiResourcesService } from './api-resources.service';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  public static readonly GET_MESSAGES_API_URL = AppConstants.General.BASE_URL + '/comments.json';
  constructor(private httpClient: HttpClient,
              private handler: HttpBackend,
              private apiResources: ApiResourcesService) { }

  messages(entityId, subEntityId): Observable<any>{
    const csrfToken = this.apiResources.getCsrfTokenVal();
    if (csrfToken) {
      this.httpClient = new HttpClient(this.handler);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }).set('x-csrf-token', csrfToken),
        observe: 'response' as 'response',
        withCredentials: true,
        // params: this.filter
      };
    }
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      observe: 'response' as 'response',
      params: {
        entity_id: entityId,
        sub_entity_id: subEntityId
      },
      withCredentials: true,
    };

    return this.httpClient.get(CommentsService.GET_MESSAGES_API_URL, httpOptions).pipe(
      tap((_) => this.log('messages')),
      catchError(this.handleError('messages()', []))
    );

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
