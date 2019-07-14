import {LazyImageComponent} from '../utils/lazy.image.component'
import { NgModule } from '@angular/core'

import {SafePipe} from '../utils/safe.pipe'
import {RouterModule} from '@angular/router';
import {AgoPipe} from './ago.pipe'

@NgModule({
	entryComponents:[
		LazyImageComponent
	],
	declarations:[
    	LazyImageComponent,
    	SafePipe,
    	AgoPipe
	],
	imports:[
		//RouterModule,
	],
	exports:[
		LazyImageComponent,
    	SafePipe,
    	AgoPipe
	]
})
export class UtilModule {

}
