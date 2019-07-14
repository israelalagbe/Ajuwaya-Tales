import { Routes } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { RepoBrowserComponent } from './github/repo-browser/repo-browser.component';
import { RepoListComponent } from './github/repo-list/repo-list.component';
import { RepoDetailComponent } from './github/repo-detail/repo-detail.component';
import { ContactComponent } from './contact/contact.component';
import {ServicesComponent} from './services/services.component';
import {CalculatorComponent} from './calculator/calculator.component';
import {ErrorComponent} from './error.component'
import {FeedComponent} from './feeds/feeds.component'
import {FeedDetailsComponent} from './feeds/details/feed.details.component'
import {AuthComponent} from './auth/auth.component'
import { PageBodyComponent } from './body/page.body.component';

import {AuthGuardService } from './auth/auth.guard.service';
import {ProfileComponent} from './profile/profile.component';
import {PublicProfileComponent} from './profile/public/public.profile.component'
import  {FollowProfileComponent} from './profile/follow/follow.profile.component'
export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'pages/feeds', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  // { path: 'services', component: ServicesComponent },
  // { path: 'calculator', component: CalculatorComponent },

  { path: 'auth', component: AuthComponent },
  {
    canActivate:[
        AuthGuardService
      ],
    path:'pages',component:PageBodyComponent, 
    children:[
      { path: 'feeds', component: FeedComponent },
      { path: 'feeds/:id', component: FeedDetailsComponent },
      //{ path: 'profile', component: ProfileComponent },
      { path: 'profile/:id', component: PublicProfileComponent  },
      { path: 'profile/:id/:type', component: FollowProfileComponent  }
    ]
  },
  // { path: 'github', component: RepoBrowserComponent,
  //   children: [
  //     { path: '', component: RepoListComponent },
  //     { path: ':org', component: RepoListComponent,
  //       children: [
  //         { path: '', component: RepoDetailComponent },
  //         { path: ':repo', component: RepoDetailComponent }
  //       ]
  //     }]
  // },
  // { path: 'contact', component: ContactComponent },
  { path: 'error', component: ErrorComponent },
  { path: '**', component: ErrorComponent }
];

