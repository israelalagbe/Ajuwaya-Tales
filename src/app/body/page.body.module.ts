import {LazyImageComponent} from '../utils/lazy.image.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'; 
import { PageBodyComponent } from '../body/page.body.component';
import {SafePipe} from '../utils/safe.pipe'
import {RouterModule} from '@angular/router';
import {FeedModule} from '../feeds/feed.module'
import {ProfileModule} from '../profile/profile.module'
import {UtilModule} from '../utils/util.module'
@NgModule({
	entryComponents:[
	//LazyImageComponent
	],
	declarations:[
		PageBodyComponent,
    	//LazyImageComponent,
    	//SafePipe
	],
	imports:[
		RouterModule,
		FeedModule,
		ProfileModule,
		UtilModule,
		CommonModule
	]
})
export class PageBodyModule {

}
