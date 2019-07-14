import { Component, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {AuthService} from '../../auth/auth.service'
import {User} from '../../auth/user'
import {Observable} from 'rxjs/Observable'
import {FeedService} from '../../feeds/feeds.service'
import {Feed} from '../../feeds/feed';
import { Router } from '@angular/router';
import  {ActivatedRoute} from '@angular/router'
@Component({
  selector: 'public-profile-component',
  templateUrl: './public.profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicProfileComponent {
	loading=false
	userRecords:any
	userObservable:Observable<User>
	feedsObservable:Observable<Feed[]>
	feeds:Feed[]
	limit = 10;
	prevId: String;
	nextId: String;
	currentPageId: string;
	previousPages: string[]=[];
	_user:User
	user_id:string
	a:any
	constructor(private router: Router,private route:ActivatedRoute,private authService:AuthService,private feedService:FeedService,private changeRef:ChangeDetectorRef){
	}
	gotoFollowers(){
    	this.router.navigate(['pages','profile', this.user_id,'followers'])
    	//pages/profile/Hkn2DuFsrMhn8b10ZvZFyGI2Ptk1/followers
    }
    gotoFollowings(){
    	this.router.navigate(['pages','profile', this.user_id,'followings'])
    	//pages/profile/Hkn2DuFsrMhn8b10ZvZFyGI2Ptk1/followers
    }
    canFollow(user_id){
    	return this.authService.canFollow(user_id);
    }
    async likeFeed(feed:Feed){
    try{
      feed.likes+=1
        await this.feedService.updateLike(feed)
    }
    catch(e){
      feed.likes-=1
      alert("Network connection failed")
    }
   }
	ngOnInit(){
		window.scrollTo(0, 0);
		this.route.params.subscribe(async (res)=>{
       		this.user_id=res.id;
       		this.user=null;
       		this.loadItems()
       		//console.error("Before User",this.user,this._user)
       		//this.a=this.authService.getUser(this.user_id)
       		//this.user=await this.authService.getUser(this.user_id);
       		//console.log("After User",this.user,this._user)
       		this.userObservable=this.authService.getUserObservable(this.user_id).do((user)=>{
       			this.user=user;
       			if(!this.user)
       				this.router.navigate(['error'])

       		})
       		this.changeRef.markForCheck()
       		
       		
     	})
		

	}
	loadItems(){
		const user_id=this.user_id;
		this.showFeeds()
		this.userRecords=this.authService.getUserRecords(user_id).do((user)=>{
			
		});;
	}
	showFeedDetails(feed:Feed){
    	console.log("navigating")
    	this.router.navigate(['pages','feeds', feed.id])
    }
	showFeeds(){
		const user_id=this.user_id
		this.feedsObservable=this.feedService.getFeedsByUser(user_id,this.limit)
			.switchMap((feeds,index)=>{
				feeds=feeds.reverse()
				console.log(feeds)
				this.feeds=feeds.slice(0,this.limit)
				this.nextId=feeds[this.limit]?feeds[this.limit].id:this.nextId;
			/*setTimeout(()=>{
				this.ref.detectChanges()
			},100)*/

			console.log("Next",this.nextId)
				return Observable.of(this.feeds);
			});
	}
	set user(user:User){
		this._user=user;
	}
	get user(){
		return this._user
	}
	get current_user(){
		return this.authService.getCurrentUser()
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
	formatFeedText(text){
    	const maxLen=100
    	if(text&&text.length>maxLen){
      		text=text.substr(0,maxLen)+"........";
    	}
    	return text;
  	}
	
}
