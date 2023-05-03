import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from "@ionic/angular";

import { LoginPageRoutingModule } from "./login-routing.module";

import { LoginPage } from "./login.page";
import { ErrorsComponent } from "src/app/common/errors/errors.component";
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


@NgModule({
  imports: [CommonModule, FormsModule,ReactiveFormsModule, IonicModule, LoginPageRoutingModule, ],
  declarations: [LoginPage,ErrorsComponent],
})
export class LoginPageModule {}
