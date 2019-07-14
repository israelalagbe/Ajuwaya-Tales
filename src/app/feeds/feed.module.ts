import { NgModule } from '@angular/core'
import {FeedComponent} from './feeds.component'
import {FeedDetailsComponent} from './details/feed.details.component'

import {FeedService,FeedServiceMock} from './feeds.service'
import {CommentService} from './comment.service'
import {CommonModule} from '@angular/common'
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AgoPipe} from '../utils/ago.pipe'
import {SafePipe} from '../utils/safe.pipe'
import {LazyImageComponent} from '../utils/lazy.image.component'
import {UtilModule} from '../utils/util.module'
@NgModule({
	declarations: [
		FeedComponent,
		FeedDetailsComponent,
		//AgoPipe,
		//SafePipe,
		//LazyImageComponent
	],
	imports: [
		CommonModule,
		HttpModule,
		FormsModule,
		UtilModule
	],
	exports:[
		 // LazyImageComponent,
		 // SafePipe
	],
	entryComponents:[
		//LazyImageComponent
	],
	providers: [
		CommentService,
		FeedService,
		//{provide:FeedService,useClass:FeedServiceMock},
	]
})
export class FeedModule {

}