import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';
import { AppComponent } from './app.component';
import { GithubService } from './github/shared/github.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import {ServicesComponent} from './services/services.component';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';


import {Number2TextPipe} from './calculator/num2text.pipe'

import {ErrorComponent} from './error.component'



//import {AgoPipe} from './utils/ago.pipe'
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule} from 'angularfire2/firestore';
import { AngularFireDatabase} from 'angularfire2/database'
import { AngularFireAuthModule } from 'angularfire2/auth';
import {FileService} from './utils/file.service'
import {FirebaseApp} from 'angularfire2'
import * as firebase from "firebase";

import {AuthModule} from './auth/auth.module'
import {PageBodyModule} from './body/page.body.module'




export const firebaseConfig = {
  apiKey: "AIzaSyDrSHxpvDlW97IjKmwNs9y28gjKcIl53Ik",
  authDomain: "ajuwayatales.firebaseapp.com",
  databaseURL: "https://ajuwayatales.firebaseio.com/",
  projectId: "ajuwayatales",
  storageBucket: "ajuwayatales.appspot.com",
  messagingSenderId: "1014529531837"
};
firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,

    HomeComponent,
    Number2TextPipe,
    ErrorComponent,
    
    //SafePipe
    //AgoPipe
  ],
  
  imports: [
    //FeedModule,
    AuthModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    RouterModule.forRoot(rootRouterConfig, { useHash: true }),
    PageBodyModule
  ],
  providers: [
    GithubService,
    FileService,
    AngularFireDatabase
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {

}
