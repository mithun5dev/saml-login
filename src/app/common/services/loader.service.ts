import { Injectable } from "@angular/core";
import { LoadingController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  isLoading = false;

  constructor(public loadingController: LoadingController) {}

  async present() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        spinner: 'bubbles',
        
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() =>console.log("abort presenting"));
          }
        });
      });
  }
  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        spinner: 'bubbles',
        duration: 30000
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() =>console.log("abort presenting"));
          }
        });
      });
  }

  async presentWithMessage(message) {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: message,
        spinner: 'bubbles'
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() =>console.log("abort presenting"));
          }
        });
      });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() =>console.log("dismissed"));
  }
}
