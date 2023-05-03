import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import { ApiResourcesService } from '../../common/services/api-resources.service';
import { AuthenticationService } from '../../common/services/authentication.service';
import { LoadingService } from 'src/app/common/services/loader.service';
export enum ConnectionStatus {
  Online,
  Offline
}
 
@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);
 //Added services for calling token value when netwoek changes
  constructor(private network: Network, private toastController: ToastController, 
    private platform: Platform, private apiResources: ApiResourcesService,private authService: AuthenticationService,
    private loadingController: LoadingService,) {
    this.platform.ready().then(() => {
      this.initializeNetworkEvents();
      let status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
    });
  }

  public initializeNetworkEvents() {
 
    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        //console.log('Device Offline');
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
 
    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        //console.log('Device Online');
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });

    //Detect network change and show network type
    this.network.onChange().subscribe(() =>{
      console.log('Device network changed');

      // let toast = this.toastController.create({
      //   message: `Network changed to ` +this.network.type,
      //   duration: 1000,
      //   position: 'bottom'
      // });
      // toast.then(toast => toast.present());

      console.log('Device network type',this.network.type);
      let network_type = localStorage.getItem('network_type');
      if(network_type && network_type !==''){

        if(network_type === this.network.type){
          
        }else{
          localStorage.setItem('network_type',this.network.type);
          if(this.network.type !== 'none'){

            this.callLoginApi();
            
          }
        }
        

      }else{
        localStorage.setItem('network_type',this.network.type);
      }
      
      

    });
    this.onNetworkChange();
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);
 
    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    let toast = this.toastController.create({
      message: `You are now ${connection}`,
      duration: 3000,
      position: 'bottom'
    });
    toast.then(toast => toast.present());
  }
 
  public onNetworkChange(): Observable<ConnectionStatus> {
   
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  //For updating token when network is changed
  private async callLoginApi(){
    if (localStorage.getItem('email') && localStorage.getItem('password')) {
      const login = {
        'email': localStorage.getItem('email'),
        'password': localStorage.getItem('password')

      };

    this.loadingController.presentLoading();
    this.authService.login(login).subscribe(
      (response: any) => {
        if (response) {
          this.loadingController.dismiss();
        }
      }
      , (err) => {
        this.loadingController.dismiss();
        console.error('ErrorDetails---->', err);
        // let toast = this.toastController.create({
        //   message: `error please try again`,
        //   duration: 1000,
        //   position: 'bottom'
        // });
        // toast.then(toast => toast.present());
      });
    }else{

      if(!localStorage.getItem("token")){
        this.loadingController.presentLoading();
        this.apiResources.getCsrf().subscribe((response) => {
          console.log("login get csrf --->",response);
          if (response) {

          }
          this.loadingController.dismiss();
        }
        , (err) => {
          this.loadingController.dismiss();
          console.error('ErrorDetails---->', err);
          // let toast = this.toastController.create({
          //   message: `error please try again`,
          //   duration: 1000,
          //   position: 'bottom'
          // });
          // toast.then(toast => toast.present());
        });
      }
     

    }
  }
}
