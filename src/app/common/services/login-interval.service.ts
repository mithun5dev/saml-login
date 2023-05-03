import { Injectable } from '@angular/core';
import { AuthenticationService } from 'src/app/common/services/authentication.service';
import { ApiResourcesService } from 'src/app/common/services/api-resources.service';

@Injectable({
  providedIn: 'root'
})
export class LoginIntervalService {

  intervalHandle: any = null; 

  constructor( private apiResources: ApiResourcesService,
    private authService: AuthenticationService,) { }

  setInterval() {

    if (this.intervalHandle === null) {
      this.intervalHandle = setInterval(() => {
        this.callAPI();
      }, 500000);//480000
    } 

    
  }

  closeInterval(){

    if (!this.intervalHandle === null) {
     
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }

  callAPI() {
    console.log('API called');
    this.callLoginApi();
  }

   //For updating token when network is changed
   async callLoginApi(){
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
      const login = {
        'email': localStorage.getItem('email'),
        'password': localStorage.getItem('password')

      };

   
    this.authService.login(login).subscribe(
      (response: any) => {
        if (response) {
          console.log("login get login response --->",response);
        }
      }
      , (err) => {
     
        console.error('ErrorDetails---->', err);
       
      });
    }else{

      if(!localStorage.getItem("token")){
       
        this.apiResources.getCsrf().subscribe((response) => {
          console.log("login get csrf --->",response);
          if (response) {

          }
          
        }
        , (err) => {
          
          console.error('ErrorDetails---->', err);
          
        });
      }
     

    }
  }
}
