import {Component} from '@angular/core';
import {Observer} from 'rxjs/Rx'
import {AuthService} from './auth/auth.service'
@Component({
  selector: 'app',
  templateUrl: './app.component.html',
})
export class AppComponent {
	name:string;
	authenticated:Observer<boolean>
	constructor(private authService:AuthService){
		this.name="Israel Alagbe"
		window['me']=this;
	}
	ngOnInit(){
		this.authenticated=this.authService.getAuthenticated();
	}
	
}
