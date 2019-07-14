import {LazyImageComponent} from '../utils/lazy.image.component'
import { NgModule } from '@angular/core'
 import { CommonModule } from '@angular/common';

import {SafePipe} from '../utils/safe.pipe'
import {RouterModule} from '@angular/router';
import {ProfileComponent} from './profile.component'
import {UtilModule} from '../utils/util.module'
import {PublicProfileComponent} from './public/public.profile.component'
import {FollowProfileComponent} from './follow/follow.profile.component'

@NgModule({
	entryComponents:[
		//LazyImageComponent
	],
	declarations:[
		ProfileComponent,
		PublicProfileComponent,
		FollowProfileComponent
    	//LazyImageComponent,
    	//SafePipe
	],
	imports:[
		RouterModule,
		UtilModule,
		CommonModule
	]
})
export class ProfileModule {

}
