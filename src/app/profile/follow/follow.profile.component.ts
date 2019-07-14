import { Component, ChangeDetectionStrategy,ChangeDetectorRef } from '@angular/core';
import {AuthService} from '../../auth/auth.service'
import {User} from '../../auth/user'
import {Observable} from 'rxjs/Observable'
import {FeedService} from '../../feeds/feeds.service'
import {Feed} from '../../feeds/feed';
import { Router } from '@angular/router';
import  {ActivatedRoute} from '@angular/router'
@Component({
  selector: 'follow-profile-component',
  templateUrl: './follow.profile.component.html',
})
export class FollowProfileComponent {
	userRecords:any
	follow_type:any
	user_id:any
	_user:User
	followersObservable:any
	usersObservable:any
	constructor(private router: Router,private route:ActivatedRoute,private authService:AuthService,private feedService:FeedService,private changeRef:ChangeDetectorRef){
	}
	ngOnInit(){
		window.scrollTo(0, 0);
		this.route.params.subscribe(async (res)=>{
			console.log(res.type)
       		this.follow_type=res.type;
       		this.user_id=res.id
       		this.user=null;
       		this.loadItems()
       		this.user=await this.authService.getUser(this.user_id);
       		console.log("Current user profile",this._user)
       		this.changeRef.markForCheck()
     	})
		

	}
	gotoUserProfile(user_id:string){
    	this.router.navigate(['pages','profile',user_id])
    }
	loadItems(){
		const user_id=this.user_id;
		this.userRecords=this.authService.getUserRecords(user_id).do((user)=>{
			console.log("User record",user)
		});;
		if(this.follow_type=='followers'){
			this.usersObservable=this.authService.getFollowers(user_id).do((followers)=>{
				followers&&followers.map((followers)=>{
					followers.user.do((user)=>{

						console.log(user.display_name,"You are following")
					})
				})
			})
		}
		else{
			this.usersObservable=this.authService.getFollowing(user_id).do((followers)=>{
				followers&&followers.map((followers)=>{
					followers.user.do((user)=>{

						console.log(user.display_name,"IS following you")
					})
				})
			})
		}
		/*
		this.followingsObservable=this.authService.getFollowing(user_id).do((followers)=>{
			followers.map((followers)=>{

				followers.user.do((user)=>{
					console.log(user,"You are following")
				})
			})
		})*/
	}
	set user(user:User){
		this._user=user;
	}
	get current_user(){
		return this.authService.getCurrentUser()
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
