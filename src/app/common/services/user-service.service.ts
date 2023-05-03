import { Injectable } from '@angular/core';
import { AppConstants } from '../../common/utility/constants';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor() { }

  getUsers() {

    const requestDetails = {
      url: AppConstants.General.BASE_URL + '/users/all_users.json',
      method: 'GET'
    };
    return;
    // return PromiseFactory.generateHttpPromise(requestDetails);
  }

  randomId(){
    return new Date().getTime().toString() + (Math.floor(Math.random() * 90000) + 10000);
  }

}
