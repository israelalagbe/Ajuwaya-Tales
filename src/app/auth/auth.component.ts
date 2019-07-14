import { Component, ChangeDetectionStrategy } from '@angular/core';
import {AuthService} from './auth.service'
import {User} from './user'
@Component({
  selector: 'ngx-auth',
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
	user:any={}
	loading=false
	constructor(private authService:AuthService){
		(<any>window).a=this
	}
	ngOnInit(){
		this.user={email:'',password:''}
	}
	handleError(){

	}
	async register(data){
		this.loading=true
		try{
			let user=new User()
			user.display_name=data.display_name;
			user.email=data.email
			user.password=data.password

			await this.authService.register(user)
		}
		catch(e){
			console.error(e)
			if(e.message)
				alert(e.message)
			else
				alert("Registration failed, please check your details")
		}	
		finally{
			this.loading=false
		}
	}
	async loginWithEmail(email,password){
		//console.log(email,password)
		//console.log(this.user['email'],this.user['password'])
		this.loading=true
		try{
			await this.authService.loginWithEmail(this.user['email'],this.user['password'])
		}
		catch(e){
			console.error(e)
			alert("Login Failed, please check login details")
		}	
		finally{
			this.loading=false
		}

	}
	async loginWithGoogle(){
		await this.authService.loginWithGoogle()
			alert("Login Failed, please ensure that you are using the correct email")
		
	}
}
