import {Component,OnInit} from '@angular/core'

@Component({
	selector:'Error404',
	template:"<h1>Error 404</h1><p>Page not found</p>"
})
export class ErrorComponent implements OnInit{
	
	constructor() {
		// code...
	}

	ngOnInit(){

	}
}