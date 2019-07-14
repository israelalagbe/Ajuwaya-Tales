import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import {AuthService, AuthServiceMoke } from './auth.service';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {AuthGuardService } from './auth.guard.service';
import { CommonModule } from '@angular/common';  
import {HttpModule} from '@angular/http';
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule
  ],
  declarations: [
    AuthComponent,
  ],
  providers:[
  	AuthService,
    AuthGuardService
  	//{ provide:AuthService,useClass:AuthServiceMoke}
  ]
})
export class AuthModule { }
