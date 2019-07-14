import {Component,ChangeDetectorRef} from '@angular/core';
import {Observer,Observable} from 'rxjs/Rx'
import {AuthService} from '../auth/auth.service'
import {User} from '../auth/./user'
@Component({
  selector: 'page_body',
  templateUrl: './page.body.component.html',
  
})
export class PageBodyComponent {
	name:string;
	authenticated:Observer<boolean>
	user:any
	userRecords:any
	usersObservable:Observable<any>
	constructor(private authService:AuthService,private changeRef:ChangeDetectorRef){
		this.name="Israel Alagbe"
		
	}
	gotoFollowers(){
    	//this.router.navigate(['pages','profile', this.authService.getCurrentUser().id,'followers'])
    	//pages/profile/Hkn2DuFsrMhn8b10ZvZFyGI2Ptk1/followers
    }
    gotoFollowings(){
    	//this.router.navigate(['pages','profile', this.authService.getCurrentUser().id,'followings'])
    	//pages/profile/Hkn2DuFsrMhn8b10ZvZFyGI2Ptk1/followers
    }
	ngOnInit(){
		//this.authenticated=this.authService.getAuthenticated();
		this.user=this.authService.getCurrentUser()
		this.authService.getCurrentUserRecords().subscribe((userRecords)=>{
			this.userRecords=userRecords
		});
		this.usersObservable=this.authService.getWhotoFollow();
	}
	logout(){
		this.authService.logout()
	}
	canFollow(user_id){
    	return this.authService.canFollow(user_id);
    }
	async unFollowUser(user_id,user:User){
		try{
			await this.authService.unFollowUser(user_id)
			alert("You have unfollowed: "+user.display_name)
			
		}
		catch(e){
			
			console.error("UnError",e)
			alert("Error occured while unfollowing user")
		}
		this.changeRef.markForCheck()
		
	}
	async followUser(user_id:string,user:User){
		try{
			await this.authService.followUser(user_id)
			
			alert("You are now following user:"+user.display_name)

		}
		catch(e){
			console.error("Error",e)
			alert("Error occured while following user")
		}
		this.changeRef.markForCheck()
	}
}
